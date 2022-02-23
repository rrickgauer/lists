"""
**********************************************************************************

List tag services

**********************************************************************************
"""

from __future__ import annotations
from uuid import UUID
import flask
from ...common import responses
from .. import tags as tag_services
from . import sql_commands


#------------------------------------------------------
# Retrieve all the tags assigned to the given list
#------------------------------------------------------
def responseGetTags(list_id: UUID) -> flask.Response:
    sql_result = sql_commands.selectAll(list_id)
    
    if not sql_result.successful:
        return responses.badRequest(str(sql_result.error))

    return responses.get(sql_result.data or [])

#------------------------------------------------------
# Respond to a request to delete all assigned tags for the given list
#------------------------------------------------------
def responseDeleteTags(list_id: UUID) -> flask.Response:
    sql_result = sql_commands.deleteAll(list_id)

    if not sql_result.successful:
        return responses.badRequest(str(sql_result.error))

    # either the user does not own the provided list
    # or there were no tags assigned to this list
    # either way, return a not found
    if sql_result.data == 0:
        return responses.notFound()
    
    return responses.deleted()


#------------------------------------------------------
# Assign the given tag to the given list
#------------------------------------------------------
def responsePostTag(list_id: UUID, tag_id: UUID) -> flask.Response:
    sql_result = sql_commands.insert(list_id, tag_id)

    if not sql_result.successful:
        return responses.notFound()

    tag = tag_services.cmdSelectSingle(tag_id).data

    return responses.created(tag)

#------------------------------------------------------
# Delete a single tag assignment
#------------------------------------------------------
def responseDeleteTag(list_id: UUID, tag_id: UUID) -> flask.Response:
    sql_result = sql_commands.delete(list_id, tag_id)

    if not sql_result.successful:
        return responses.badRequest(str(sql_result.error))

    if sql_result.data != 1:
        return responses.notFound()

    return responses.deleted()

