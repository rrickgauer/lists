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
from .. import tags as tag_services
from . import sql_stmts


#------------------------------------------------------
# Retrieve all the tags assigned to the given list
#------------------------------------------------------
def responseGetTags(list_id: UUID) -> flask.Response:
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
def responseDeleteTags(list_id: UUID) -> flask.Response:
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


#------------------------------------------------------
# Assign the given tag to the given list
#------------------------------------------------------
def responsePostTag(list_id: UUID, tag_id: UUID) -> flask.Response:
    sql_result = cmdInsert(list_id, tag_id)

    if not sql_result.successful:
        return responses.notFound()

    tag = tag_services.cmdSelectSingle(tag_id).data

    return responses.created(tag)


#------------------------------------------------------
# SQL command to insert the new List_Tags record
#------------------------------------------------------
def cmdInsert(list_id: UUID, tag_id: UUID) -> DbOperationResult:
    sql = sql_stmts.INSERT_SINGLE

    parms = (
        str(list_id),
        str(tag_id),
        str(flask.g.client_id)
    )

    return sql_engine.modify(sql, parms)


#------------------------------------------------------
# Delete a single tag assignment
#------------------------------------------------------
def responseDeleteTag(list_id: UUID, tag_id: UUID) -> flask.Response:
    sql_result = cmdDeleteSingle(list_id, tag_id)

    if not sql_result.successful:
        return responses.badRequest(str(sql_result.error))

    if sql_result.data != 1:
        return responses.notFound()

    return responses.deleted()


#------------------------------------------------------
# SQL command to delete a single tag assignment
#------------------------------------------------------
def cmdDeleteSingle(list_id: UUID, tag_id: UUID) -> DbOperationResult:
    sql = sql_stmts.DELETE_SINGLE

    parms = (
        str(list_id),
        str(tag_id),
        str(flask.g.client_id)
    )

    return sql_engine.modify(sql, parms)






