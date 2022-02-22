"""
**********************************************************************************

This module contains all the business logic for item services.

**********************************************************************************
"""
from __future__ import annotations
from typing import Tuple
from datetime import datetime
from uuid import UUID, uuid4
import flask
from ...common import responses
from ...models import Item, ItemComplete
from .parser import BatchItemParserUpdate, ParseReturnCodes, BatchItemParserDelete
from . import sql_commands as sql_engine

#------------------------------------------------------
# Response to a GET request for items
#------------------------------------------------------
def getItems(list_ids: list[UUID]=None) -> flask.Response:
    if not list_ids:
        db_result = sql_engine.selectAll()                     # return all the items
    else:
        db_result = sql_engine.selectAllFromLists(list_ids)   # return the items that belong to the given lists
    
    if not db_result.successful:
        return responses.badRequest(db_result.error)

    return responses.get(db_result.data)


#------------------------------------------------------
# Response to a POST item request
#------------------------------------------------------
def createNewItem(request_body: dict) -> flask.Response:
    return _modifyItemActions(uuid4(), request_body)


#------------------------------------------------------
# Response to a PUT item request
#------------------------------------------------------
def updateItem(item_id: UUID, request_body: dict) -> flask.Response:
    return _modifyItemActions(item_id, request_body)


#------------------------------------------------------
# Consolidated actions to be taken when either inserting
# a new item or updating an existing item.
#------------------------------------------------------
def _modifyItemActions(item_id: UUID, request_body: dict) -> flask.Response:
    # create a new Item object from the provided request body
    new_item = _parseItemFromDict(request_body)
    new_item.id = item_id

    # verify that the content and list_id fields are present
    if None in [new_item.list_id, new_item.content]:
        return responses.badRequest('Missing one of the required fields: list_id or content')

    # record the changes in the database
    db_result = sql_engine.modify(new_item)

    if not db_result.successful:
        return responses.badRequest(str(db_result.error))

    # retrieve the list object from the database that contains all the updated values
    response_data = sql_engine.selectSingle(new_item.id)

    # determine the appropriate return code we need to send back
    response_function = _determineResponseFunction(db_result.data)

    return response_function(response_data.data)


#------------------------------------------------------
# Given a dict, create an Item object whose properties
# have the values provided in the dict.
#------------------------------------------------------
def _parseItemFromDict(item_dict: dict) -> Item:
    item = Item(
        list_id    = item_dict.get('list_id') or None,
        content    = item_dict.get('content') or None,
        created_on = datetime.now(),
        complete   = _parseCompleteDictFIeld(item_dict),
        rank       = item_dict.get('rank') or None
    )

    return item


#------------------------------------------------------
# Parses the given dict for the complete field.
#
# If one is not provided, return the default value (no).
#
# If the field is provided, try to parse it. 
# If that fails, return the default value.
#------------------------------------------------------
def _parseCompleteDictFIeld(item_dict: dict) -> ItemComplete:
    complete_val = item_dict.get('complete') or None

    if not complete_val:
        # no value was provided in the dict
        item_complete = ItemComplete.NO 
    else:
        # try to parse the field
        try:
            item_complete = ItemComplete(complete_val)
        except ValueError:
            # invalid value provided, so go with the default
            item_complete = ItemComplete.NO
    
    return item_complete



#------------------------------------------------------
# Determine the appropriate response function to use 
# for requests that modify/insert an item.
#
# If rows_affected = 1 then return a created response code
# Otherwise, return an updated response code.
#
# Returns a response function.
#------------------------------------------------------
def _determineResponseFunction(rows_affected: int):
    if rows_affected == 1:
        return responses.created
    else:
        return responses.updated


#------------------------------------------------------
# Response to a GET request for a single item
#------------------------------------------------------
def getItem(item_id: UUID) -> flask.Response:
    db_result = sql_engine.selectSingle(item_id)

    if not db_result.successful:
        return responses.badRequest(db_result.error)

    return responses.get(db_result.data)

#------------------------------------------------------
# Update a single item's complete value.
# If request method is put, mark the item as complete
# If the request is delete, mark the item as not complete
#------------------------------------------------------
def updateItemComplete(item_id: UUID, request_method: str) -> flask.Response:
    
    if request_method == 'PUT':
        item_complete = ItemComplete.YES
        return_method = responses.updated
    else:
        item_complete = ItemComplete.NO
        return_method = responses.deleted
    

    db_result = sql_engine.updateComplete(item_id, item_complete)

    if not db_result.successful:
        return responses.badRequest(db_result.error)
    
    return return_method()


#------------------------------------------------------
# Delete the given item
#------------------------------------------------------
def deleteItem(item_id: UUID) -> flask.Response:
    db_result = sql_engine.delete(item_id)

    if not db_result.successful:
        return responses.badRequest(db_result.error)

    # make sure the item exists and belongs to the client
    if db_result.data != 1:
        return responses.notFound()

    return responses.deleted()

#------------------------------------------------------
# Execute a sql command to delete the given item
#------------------------------------------------------
def patchItems(flask_request: flask.Request) -> flask.Response:
    parsing_result, items = _parseBatchUpdateRequestData(flask_request)

    # if data was invalid, reply with an invalid response
    if parsing_result != ParseReturnCodes.SUCCESS:
        return responses.badRequest(parsing_result.name)

    # return a response here if there are no items to be updated
    if len(items) < 1:
        return responses.updated()


    # save updates in the database
    db_result = sql_engine.updateRanks(items)

    if not db_result.successful:
        return responses.badRequest(db_result.error)

    return responses.updated()



#------------------------------------------------------
# Given the flask request, parse the data into a list of Item objects
#
# Returns a tuple:
#   - parser return code
#   - list of parsed Item objects
#------------------------------------------------------
def _parseBatchUpdateRequestData(flask_request: flask.Request) -> Tuple[ParseReturnCodes, list[Item]]:
    # be sure the request data was valid
    parser = BatchItemParserUpdate(flask_request)
    parsing_result = parser.isValid()

    # transform the incoming json data into a list of Item objects
    if parsing_result == ParseReturnCodes.SUCCESS:
        parser.parseData()

    return (parsing_result, parser.items)


#------------------------------------------------------
# Respond to a request to do a batch delete of existing items
#------------------------------------------------------
def batchDeleteItems(flask_request: flask.Request) -> flask.Response:
    # get the list of item id's
    item_ids, err_msg = _parseBatchDeleteRequestBody(flask_request)

    if not item_ids:
        return responses.badRequest(err_msg)

    # no need to do anything else if an empty list was provided
    if len(item_ids) == 0:
        return responses.deleted()

    # delete the items from the database
    sql_result = sql_engine.deleteBatch(item_ids)

    if not sql_result.successful:
        return responses.badRequest(sql_result.error)

    return responses.deleted()


#------------------------------------------------------
# Parse the request body for the list of item id's to be deleted
#
# Returns a tuple comprised of:
#   list of item ids or null if there was an error
#   error message or null if okay
#------------------------------------------------------
def _parseBatchDeleteRequestBody(request: flask.Request) -> Tuple[list[UUID], str]:
    parser = BatchItemParserDelete(request)

    # make sure the request has a valid json body
    parser_rc = parser.isValid()

    if parser_rc != ParseReturnCodes.SUCCESS:
        return (None, parser_rc.name)

    # value error is raised if there is an invalid UUID in the request body 
    # (can't be cast as a UUID)
    try:
        parser.parseData()
    except ValueError as e:
        return (None, str(e))
        
    return (parser.items, None)



