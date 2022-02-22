"""
**********************************************************************************

This module contains all the business logic for lists services.

**********************************************************************************
"""
from enum import Enum
from uuid import UUID, uuid4
from datetime import datetime
import uuid
import flask
import pymysql.commands
from pymysql.structs import DbOperationResult
from ...common import responses
from ...models import List, ListType


# the template for selecting multiple lists from the database
SQL_SELECT_ALL_TEMPLATE = '''
    SELECT * FROM View_Lists vl
    WHERE EXISTS (
        SELECT 1 FROM Lists l
        WHERE l.user_id = %s
        AND l.id = vl.id
        {}
    )
    ORDER BY modified_on DESC
'''


# Holds all the sql statements for selecting multiple lists (all or filter by type)
class SqlSelectStmts(str, Enum):
    ALL         = SQL_SELECT_ALL_TEMPLATE.format('')                        # all lists
    FILTER_TYPE = SQL_SELECT_ALL_TEMPLATE.format(' AND l.`type` = %s ')     # Filter by list type


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
        return _queryAll()
    else:
        list_type = ListType(filter_type_val)
        return _queryAllFilterByType(list_type)

#------------------------------------------------------
# Get all a user's lists from the database
#------------------------------------------------------
def _queryAll() -> DbOperationResult:
    sql = SQL_SELECT_ALL_TEMPLATE.format('')
    parms = (str(flask.g.client_id),)

    return pymysql.commands.selectAll(sql, parms)


#------------------------------------------------------
# Returns all lists of the given type
#------------------------------------------------------
def _queryAllFilterByType(filter_type: ListType) -> DbOperationResult:
    sql = SqlSelectStmts.FILTER_TYPE.value

    parms = (
        str(flask.g.client_id),
        filter_type.value
    )

    return pymysql.commands.selectAll(sql, parms)


#------------------------------------------------------
# Send a response with a single list
#------------------------------------------------------
def getList(list_id: UUID) -> flask.Response:
    query_result = _query(list_id)

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

    clone_db_result = cmdCloneList(list_id, new_list)

    if not clone_db_result.successful:
        return responses.badRequest(clone_db_result.error)

    db_select = _query(new_list.id)

    return responses.created(db_select.data) 


#------------------------------------------------------
# Execute sql to clone the given list
#
# Args:
#   existing_list_id: id of the existing list
#   new_list_id: designated ID to give the newly created list
#------------------------------------------------------
def cmdCloneList(existing_list_id: UUID, new_list: List) -> DbOperationResult:
    
    parms = (
        str(new_list.user_id),
        str(existing_list_id),
        str(new_list.id),
        new_list.name,
    )

    sql = 'CALL Clone_List(%s, %s, %s, %s);'

    return pymysql.commands.modify(sql, parms)

#------------------------------------------------------
# Fetch a single list from the database
#------------------------------------------------------
def _query(list_id: UUID) -> DbOperationResult:
    sql = '''
        SELECT * FROM View_Lists vl
        WHERE vl.id = %s
        AND vl.id IN (SELECT l.id FROM Lists l WHERE l.user_id = %s)
        LIMIT 1
    '''

    parms = (
        str(list_id), 
        str(flask.g.client_id)
    )

    return pymysql.commands.select(sql, parms)


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
    db_result = _modifyDbCommand(new_list)

    if not db_result.successful:
        return responses.badRequest(db_result.error)

    # determine the appropriate return code we need to send back
    if db_result.data == 1:
        response_function = responses.created
    else:
        response_function = responses.updated   # 2 rows updated

    # retrieve the list object from the database that contains all the updated values
    response_data = _query(new_list.id)

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
# SQL command that either inserts a new list, or updates
# an exiting record's name if it already exists.
#------------------------------------------------------
def _modifyDbCommand(list_: List) -> DbOperationResult:
    sql = '''
        INSERT INTO Lists (id, user_id, name, created_on, `type`) 
        VALUES (%s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE 
        name   = VALUES(name),
        `type` = VALUES (`type`);
    '''

    parms = (
        str(list_.id),
        str(list_.user_id),
        list_.name,
        list_.created_on,
        list_.type
    )

    return pymysql.commands.modify(sql, parms)


#------------------------------------------------------
# Delete a list
#------------------------------------------------------
def deleteList(list_id: UUID) -> flask.Response:
    db_result = _cmdDeleteList(List(id=list_id))

    if not db_result.successful:
        return responses.badRequest(db_result.error)

    # if the rows affected is not 1 the list does not exist or is not owned by the client
    if db_result.data != 1:
        return responses.forbidden()

    return responses.deleted()
    
#------------------------------------------------------
# SQL command that deletes the given list from the database
#------------------------------------------------------
def _cmdDeleteList(list_: List) -> DbOperationResult:
    sql = 'DELETE FROM Lists WHERE id=%s AND user_id=%s'
    parms = (str(list_.id), str(flask.g.client_id))

    return pymysql.commands.modify(sql, parms)
