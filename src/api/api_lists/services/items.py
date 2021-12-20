"""
**********************************************************************************

This module contains all the business logic for item services.

**********************************************************************************
"""
from __future__ import annotations
from uuid import UUID
import flask
from ..db_manager import commands as sql_engine, DbOperationResult
from ..common import responses


SQL_SELECT_INIT = '''
    SELECT * FROM View_Items vi
    WHERE vi.list_id in (SELECT l.id FROM Lists l WHERE l.user_id = %s)
'''


#------------------------------------------------------
# Response to a GET request for a single user
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
    sql = SQL_SELECT_INIT
    parms = (str(flask.g.client_id),)

    return sql_engine.select(sql, parms, True)


#------------------------------------------------------
# Get the items that are children of the given lists
#------------------------------------------------------
def _queryFilterByLists(list_ids: list[UUID]) -> DbOperationResult:
    sql = _getQueryFilterStmt(len(list_ids))
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

