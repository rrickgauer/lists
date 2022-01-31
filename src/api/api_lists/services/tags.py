"""
**********************************************************************************
This module contains all services related to tags.
**********************************************************************************
"""


import flask
from ..db_manager import commands as sql_engine, DbOperationResult
from ..common import responses

SQL_SELECT_ALL = '''
    SELECT * FROM View_Tags vt
    WHERE EXISTS (
        SELECT 1 FROM Tags t
        WHERE t.user_id = %s 
        AND t.id = vt.id
    )
'''

#------------------------------------------------------
# Get all tags response
#------------------------------------------------------
def getAllTags() -> flask.Response:
    sql_result = cmdSelectAll()

    if not sql_result.successful:
        return responses.badRequest(sql_result.error)
    
    return responses.get(sql_result.data)

#------------------------------------------------------
# Get all the user's tags from the database
#------------------------------------------------------
def cmdSelectAll() -> DbOperationResult:
    sql = SQL_SELECT_ALL
    parms = (str(flask.g.client_id), )

    return sql_engine.select(sql, parms, True)