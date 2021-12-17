"""
**********************************************************************************

This module contains all the business logic for lists services.

**********************************************************************************
"""

from uuid import UUID
import flask
from ..db_manager import commands as sql_engine, DbOperationResult
from ..common import responses


#------------------------------------------------------
# Response to a GET request for a single user
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


