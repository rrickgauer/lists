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
from ...db_manager import commands as sql_engine, DbOperationResult
from ...common import responses
from ...models import Item, ItemComplete

from .parser import BatchItemParserUpdate, ParseReturnCodes, BatchItemParserDelete

SQL_SELECT_INIT = '''
    SELECT * FROM View_Items vi
    WHERE vi.list_id in (SELECT l.id FROM Lists l WHERE l.user_id = %s)
'''


#------------------------------------------------------
# Response to a GET request for items
#------------------------------------------------------
def getItems(list_ids: list[UUID]=None) -> flask.Response:
    if not list_ids:
        db_result = _queryAll()                     # return all the items
    else:
        db_result = _queryFilterByLists(list_ids)   # return the items that belong to the given lists
    
    if not db_result.successful:
        return responses.badRequest(db_result.error)

    return responses.get(db_result.data)
    

#------------------------------------------------------
# Get all items from database
#------------------------------------------------------
def _queryAll() -> DbOperationResult:
    sql = f'{SQL_SELECT_INIT} ORDER BY created_on DESC'
    parms = (str(flask.g.client_id),)

    return sql_engine.select(sql, parms, True)


#------------------------------------------------------
# Get the items that are children of the given lists
#------------------------------------------------------
def _queryFilterByLists(list_ids: list[UUID]) -> DbOperationResult:
    sql = _getQueryFilterStmt(len(list_ids)) + ' ORDER BY -`rank` DESC, modified_on DESC;'
    parms = _getQueryFilterParms(list_ids)
    return sql_engine.select(sql, parms, True)


#------------------------------------------------------
# Generate the select statement for _queryFilterByLists
#------------------------------------------------------
def _getQueryFilterStmt(num_lists) -> str:
    result_stmt = SQL_SELECT_INIT + ' AND vi.list_id IN ({})'

    first = True
    sql = ''

    for i in range(num_lists):
        if not first:
            sql += ','
        else:
            first = False
        
        sql += '%s'

    return result_stmt.format(sql)

#------------------------------------------------------
# Generate the parms tuple required for the select stmt
#------------------------------------------------------
def _getQueryFilterParms(list_ids: list[UUID]) -> tuple:
    id_string = []
    
    for list_id in list_ids:
        id_string.append(str(list_id))
    
    return (str(flask.g.client_id),) + tuple(id_string)


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
    db_result = _modifyDbCommand(new_item)

    if not db_result.successful:
        return responses.badRequest(db_result.error)

    # retrieve the list object from the database that contains all the updated values
    response_data = _query(new_item.id)

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
# SQL command that either inserts a new list, or updates
# an exiting record's name if it already exists.
#------------------------------------------------------
def _modifyDbCommand(item: Item) -> DbOperationResult:
    sql = '''
        INSERT INTO Items (id, list_id, content, `rank`, complete, created_on) 
        VALUES (%s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE 
        content  = VALUES(content),
        complete = VALUES(complete),
        `rank`     = VALUES(`rank`);
    '''

    parms = (
        str(item.id),
        str(item.list_id),
        item.content,
        item.rank,
        item.complete.value,
        item.created_on.isoformat()
    )

    return sql_engine.modify(sql, parms)


#------------------------------------------------------
# Determine the appropriate response function to use 
# for requests that modify/insert an item.
#
# If rows_affected = 1 then return a created response code
# Otherwise, return an updated response code.
#
# Returns a function.
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
    db_result = _query(item_id)

    if not db_result.successful:
        return responses.badRequest(db_result.error)

    return responses.get(db_result.data)


#------------------------------------------------------
# Retrieve the given item from the database
#------------------------------------------------------
def _query(item_id: UUID) -> DbOperationResult:
    sql = f'{SQL_SELECT_INIT} AND vi.id = %s LIMIT 1;'
    
    parms = (
        str(flask.g.client_id),
        str(item_id)
    )

    return sql_engine.select(sql, parms, False)



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
    

    db_result = _cmdUpdateItemComplete(item_id, item_complete)

    if not db_result.successful:
        return responses.badRequest(db_result.error)
    
    return return_method()


#------------------------------------------------------
# Retrieve the given item from the database
#------------------------------------------------------
def _cmdUpdateItemComplete(item_id: UUID, complete: ItemComplete) -> DbOperationResult:
    sql = 'UPDATE Items SET complete=%s WHERE id=%s'
    parms = (complete.value, str(item_id))

    return sql_engine.modify(sql, parms)


#------------------------------------------------------
# Delete the given item
#------------------------------------------------------
def deleteItem(item_id: UUID) -> flask.Response:
    db_result = _cmdDeleteItem(item_id)

    if not db_result.successful:
        return responses.badRequest(db_result.error)

    # make sure the item exists and belongs to the client
    if db_result.data != 1:
        return responses.notFound()

    return responses.deleted()

#------------------------------------------------------
# Execute a sql command to delete the given item
#------------------------------------------------------
def _cmdDeleteItem(item_id: UUID) -> DbOperationResult:
    sql = '''
        DELETE FROM Items WHERE id=%s
        AND EXISTS (SELECT 1 FROM Lists l WHERE l.user_id=%s)
    '''

    parms = (
        str(item_id), 
        str(flask.g.client_id)
    )

    return sql_engine.modify(sql, parms)


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
    db_result = _cmdBatchUpdateItemRanks(items)

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
# Execute the sql command to batch update item ranks
#------------------------------------------------------
def _cmdBatchUpdateItemRanks(items: list[Item]) -> DbOperationResult:
    # generate the update sql statement
    sql = _generateBatchUpdateSqlStatement(items)

    # transform the list of items into a tuple
    parms = _itemsListToTuple(items)

    return sql_engine.modify(sql, parms)


#------------------------------------------------------
# Generate the sql batch rank update statement
#------------------------------------------------------
def _generateBatchUpdateSqlStatement(items: list[Item]) -> str:
    # generate the string with all the tuples in it
    parms_str = _getBatchUpdateParmSqlString(items)
    
    sql = f'INSERT INTO Items (id, `rank`) VALUES {parms_str} ON DUPLICATE KEY UPDATE `rank`=values(`rank`);'

    return sql


#------------------------------------------------------
# Generate a the parameter portion (%s, %s) of the batch 
# update sql string with the given number of items
#
# Args:
#   num_items: number of (%s, %s) elements to add to the string
#------------------------------------------------------
def _getBatchUpdateParmSqlString(items: list[Item]) -> str:
    first = True
    sql = ''

    for i in items:
        if not first:
            sql += ', '
        else:
            first = False
        
        sql += '(%s, %s)'


    return sql


#------------------------------------------------------
# Transform the given list of items into a tuple 
# for the batch update sql statement.
#------------------------------------------------------
def _itemsListToTuple(items: list[Item]) -> tuple:
    tuple_list = []

    for item in items:
        tuple_list.append(str(item.id))
        tuple_list.append(item.rank)

    return tuple(tuple_list)

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
    sql_result = _cmdBatchDeleteItems(item_ids)

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


#------------------------------------------------------
# Delete the given list of item ids from the database
#------------------------------------------------------
def _cmdBatchDeleteItems(item_ids: list[UUID]) -> DbOperationResult:
    # generate the sql statement for the delete command
    sql = _generateBatchDeleteSqlStmt(len(item_ids))

    # get the parms
    parms = _getBatchDeleteSqlParms(item_ids)

    return sql_engine.modify(sql, parms)


#------------------------------------------------------
# Generate the sql statement for the batch delete command
# Every item to be deleted needs to have a corresponding '%s' in the statement
#
# Args:
#   num_items: number of items to be deleted
#
# Returns a str: the delete sql statement
#------------------------------------------------------
def _generateBatchDeleteSqlStmt(num_items: int) -> str:
    sql = '''
        DELETE FROM Items i 
        WHERE i.id IN (%s{remaining}) 
        AND i.list_id IN (SELECT l.id FROM Lists l WHERE l.user_id=%s)
    '''

    # create '%s' string of all items besides first 1 since 
    # it's already in the string created above
    percents = ', %s' * (num_items - 1)
    sql = sql.format(remaining=percents)

    return sql

#------------------------------------------------------
# Generate the paramter tuple for the batch delete sql command
# Tuple is all the item_id's and then the client_id
#------------------------------------------------------
def _getBatchDeleteSqlParms(item_ids: list[UUID]) -> tuple:
    # convert all the item_id UUID's into strings
    str_ids = tuple(map(lambda item_id: str(item_id) , item_ids))
    
    # parms are all the item_id's then the client_id
    parms = (*str_ids, str(flask.g.client_id))

    return parms


