"""
**********************************************************************************

This module contains all the business logic for lists services.

**********************************************************************************
"""
from uuid import UUID, uuid4
from datetime import datetime
import uuid
import flask
from pymysql.structs import DbOperationResult
from ...common import responses
from ...models import List, ListType
from . import sql_engine as sql_engine

#------------------------------------------------------
# Return all of a user's lists
#------------------------------------------------------
def getAllLists(request_args: dict) -> flask.Response:
    db_result = _selectMultiple(request_args)
    
    if db_result.successful:
        return responses.get(db_result.data)
    else:
        return responses.badRequest(db_result.error)  


#------------------------------------------------------
# If the given request_args has a url query arg, return all lists of that type
# Otherwise, return all the lists owned by the client
#------------------------------------------------------
def _selectMultiple(request_args: dict) -> DbOperationResult:
    filter_type_val = request_args.get('type') or None

    if not filter_type_val:
        return sql_engine.selectAll()
    else:
        list_type = ListType(filter_type_val)
        return sql_engine.selectAllOfType(list_type)


#------------------------------------------------------
# Send a response with a single list
#------------------------------------------------------
def getList(list_id: UUID) -> flask.Response:
    query_result = sql_engine.selectSingle(list_id)

    if not query_result.successful:
        return responses.badRequest(query_result.error)

    return responses.get(query_result.data)

#------------------------------------------------------
# Generate response for cloning a list
#------------------------------------------------------
def cloneListResponse(list_id: UUID, request_form: dict) -> flask.Response:
    new_list = List(
        id      = uuid.uuid4(),
        user_id = flask.g.client_id,
        name    = request_form.get('name') or None
    )

    if not new_list.name:
        return responses.badRequest('Missing required request body field: name')

    clone_db_result = sql_engine.clone(list_id, new_list)

    if not clone_db_result.successful:
        return responses.badRequest(clone_db_result.error)

    db_select = sql_engine.selectSingle(new_list.id)

    return responses.created(db_select.data) 


#------------------------------------------------------
# Create a brand new list
#------------------------------------------------------
def createList(request_body: dict) -> flask.Response:
    # need to create a new uuid for the list
    new_list_id = uuid4()

    return _modifyList(new_list_id, request_body)

#------------------------------------------------------
# Update an existing list or create a list with the given id
#------------------------------------------------------
def updateList(list_id: UUID, request_body: dict) -> flask.Response:
    return _modifyList(list_id, request_body)


#------------------------------------------------------
# Steps to take for creating or updating a list
#------------------------------------------------------
def _modifyList(list_id: UUID, request_body: dict) -> flask.Response:
    # create a new list model
    new_list = dictToList(request_body)
    new_list.id = list_id

    # make sure the request body contained a name field
    if not new_list.name:
        return responses.badRequest('Missing required field: name')
    
    # insert the record into the database
    db_result = sql_engine.modify(new_list)

    if not db_result.successful:
        return responses.badRequest(db_result.error)

    # determine the appropriate return code we need to send back
    if db_result.data == 1:
        response_function = responses.created
    else:
        response_function = responses.updated   # 2 rows updated

    # retrieve the list object from the database that contains all the updated values
    response_data = sql_engine.selectSingle(new_list.id)

    return response_function(response_data.data)


#------------------------------------------------------
# Parse the given dict into a new List model object
#------------------------------------------------------
def dictToList(dict_obj: dict) -> List:
    return List(
        user_id    = flask.g.client_id,
        name       = dict_obj.get('name') or None,
        created_on = datetime.now(),
        type       = ListType(dict_obj.get('type'))
    )

#------------------------------------------------------
# Delete a list
#------------------------------------------------------
def deleteList(list_id: UUID) -> flask.Response:
    db_result = sql_engine.delete(List(id=list_id))

    if not db_result.successful:
        return responses.badRequest(db_result.error)

    # if the rows affected is not 1 the list does not exist or is not owned by the client
    if db_result.data != 1:
        return responses.forbidden()

    return responses.deleted()
    
