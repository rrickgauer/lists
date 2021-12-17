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
    db_result = _queryAll(flask.g.client_id)
    
    if db_result.successful:
        return responses.get(db_result.data)
    else:
        return responses.badRequest(db_result.error)  


#------------------------------------------------------
# Get all a user's lists
#------------------------------------------------------
def _queryAll(user_id) -> DbOperationResult:
    sql = '''
    SELECT * FROM View_Lists vl
    WHERE EXISTS (
        SELECT 1 FROM Lists l
        WHERE l.user_id = %s
        AND l.id = vl.id
    )
    ORDER BY created_on DESC
    '''

    parms = (str(user_id),)

    return sql_engine.select(sql, parms, True)


