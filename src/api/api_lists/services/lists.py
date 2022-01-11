"""
**********************************************************************************

This module contains all the business logic for lists services.

**********************************************************************************
"""

from uuid import UUID, uuid4
from datetime import datetime
import flask
from ..db_manager import commands as sql_engine, DbOperationResult
from ..common import responses
from ..models import List, ListType


#------------------------------------------------------
# Return all of a user's lists
#------------------------------------------------------
def getAllLists() -> flask.Response:
    db_result = _queryAll()
    
    if db_result.successful:
        return responses.get(db_result.data)
    else:
        return responses.badRequest(db_result.error)  


#------------------------------------------------------
# Get all a user's lists from the database
#------------------------------------------------------
def _queryAll() -> DbOperationResult:
    sql = '''
    SELECT * FROM View_Lists vl
    WHERE EXISTS (
        SELECT 1 FROM Lists l
        WHERE l.user_id = %s
        AND l.id = vl.id
    )
    ORDER BY created_on DESC
    '''

    parms = (str(flask.g.client_id),)

    return sql_engine.select(sql, parms, True)


#------------------------------------------------------
# Send a response with a single list
#------------------------------------------------------
def getList(list_id: UUID) -> flask.Response:
    query_result = _query(list_id)

    if not query_result.successful:
        return responses.badRequest(query_result.error)

    return responses.get(query_result.data)

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

    parms = (str(list_id), str(flask.g.client_id))

    return sql_engine.select(sql, parms, False)


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
    new_list = List(
        id         = list_id,
        user_id    = flask.g.client_id,
        name       = request_body.get('name') or None,
        created_on = datetime.now(),
        type       = ListType(request_body.get('type'))
    )

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

    return sql_engine.modify(sql, parms)


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

    return sql_engine.modify(sql, parms)