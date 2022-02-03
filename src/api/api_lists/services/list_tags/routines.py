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




def cmdSelectAll(list_id: UUID) -> DbOperationResult:
    sql = sql_stmts.SELECT_ALL
    
    parms = (
        str(list_id),
        str(flask.g.client_id)
    )

    return sql_engine.select(sql, parms, True)
