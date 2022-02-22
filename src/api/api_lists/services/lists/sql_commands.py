"""
**********************************************************************************

All the database commands for Lists

**********************************************************************************
"""


from uuid import UUID
import flask
import pymysql.commands
from pymysql.structs import DbOperationResult
from ...models import List, ListType
from . import sql_stmts

#------------------------------------------------------
# Get all a user's lists from the database
#------------------------------------------------------
def selectAll() -> DbOperationResult:
    sql = sql_stmts.SELECT_ALL_TEMPLATE.format('')
    parms = (str(flask.g.client_id),)

    return pymysql.commands.selectAll(sql, parms)


#------------------------------------------------------
# Returns all lists of the given type
#------------------------------------------------------
def selectAllOfType(filter_type: ListType) -> DbOperationResult:
    sql = sql_stmts.SqlSelectStmts.FILTER_TYPE.value

    parms = (
        str(flask.g.client_id),
        filter_type.value
    )

    return pymysql.commands.selectAll(sql, parms)

#------------------------------------------------------
# Fetch a single list from the database
#------------------------------------------------------
def selectSingle(list_id: UUID) -> DbOperationResult:
    parms = (
        str(list_id), 
        str(flask.g.client_id)
    )

    return pymysql.commands.select(sql_stmts.SELECT_SINGLE, parms)

#------------------------------------------------------
# SQL command that either inserts a new list, or updates
# an exiting record's name if it already exists.
#------------------------------------------------------
def modify(list_: List) -> DbOperationResult:
    parms = (
        str(list_.id),
        str(list_.user_id),
        list_.name,
        list_.created_on,
        list_.type
    )

    return pymysql.commands.modify(sql_stmts.MODIFY, parms)

#------------------------------------------------------
# SQL command that deletes the given list from the database
#------------------------------------------------------
def delete(list_: List) -> DbOperationResult:
    parms = (str(list_.id), str(flask.g.client_id))
    return pymysql.commands.modify(sql_stmts.DELETE, parms)

#------------------------------------------------------
# Execute sql to clone the given list
#
# Args:
#   existing_list_id: id of the existing list
#   new_list_id: designated ID to give the newly created list
#------------------------------------------------------
def clone(existing_list_id: UUID, new_list: List) -> DbOperationResult:
    parms = (
        str(new_list.user_id),
        str(existing_list_id),
        str(new_list.id),
        new_list.name,
    )

    return pymysql.commands.modify(sql_stmts.CLONE_LIST, parms)