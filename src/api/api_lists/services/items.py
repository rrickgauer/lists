"""
**********************************************************************************

This module contains all the business logic for lists services.

**********************************************************************************
"""

import flask
from ..db_manager import commands as sql_engine, DbOperationResult
from ..common import responses


#------------------------------------------------------
# Response to a GET request for a single user
#------------------------------------------------------
def getItems() -> flask.Response:
    
    db_result = _queryAll()

    if not db_result.successful:
        return responses.badRequest(db_result.error)

    return responses.get(db_result.data)
    

#------------------------------------------------------
# Get all a user's lists from the database
#------------------------------------------------------
def _queryAll() -> DbOperationResult:
    sql = '''
    SELECT * FROM View_Items vi
    WHERE vi.list_id in (
        SELECT l.id FROM Lists l WHERE l.user_id = %s
    );
    '''

    parms = (str(flask.g.client_id),)

    return sql_engine.select(sql, parms, True)



