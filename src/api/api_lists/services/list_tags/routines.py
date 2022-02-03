"""
**********************************************************************************

List tag services

**********************************************************************************
"""

from __future__ import annotations
from uuid import UUID
import flask
from ...common import responses
from ...db_manager import DbOperationResult
from ...db_manager import commands as sql_engine
from . import sql_stmts


#------------------------------------------------------
# Retrieve all the tags assigned to the given list
#------------------------------------------------------
def responseGetAll(list_id: UUID) -> flask.Response:
    sql_result = cmdSelectAll(list_id)
    
    if not sql_result.successful:
        return responses.badRequest(str(sql_result.error))

    return responses.get(sql_result.data or [])


#------------------------------------------------------
# SQL command that selects all the tags assigned to the given list
#------------------------------------------------------
def cmdSelectAll(list_id: UUID) -> DbOperationResult:
    sql = sql_stmts.SELECT_ALL
    
    parms = (
        str(list_id),
        str(flask.g.client_id)
    )

    return sql_engine.select(sql, parms, True)

#------------------------------------------------------
# Respond to a request to delete all assigned tags for the given list
#------------------------------------------------------
def responseDeleteAll(list_id: UUID) -> flask.Response:
    sql_result = cmdDeleteAll(list_id)

    if not sql_result.successful:
        return responses.badRequest(str(sql_result.error))

    # either the user does not own the provided list
    # or there were no tags assigned to this list
    # either way, return a not found
    if sql_result.data == 0:
        return responses.notFound()
    
    return responses.deleted()

#------------------------------------------------------
# SQL command to delete all tag assignments for the given list
#------------------------------------------------------
def cmdDeleteAll(list_id: UUID) -> DbOperationResult:
    sql = sql_stmts.DELETE_ALL
    
    parms = (
        str(list_id),
        str(flask.g.client_id)
    )

    return sql_engine.modify(sql, parms)



