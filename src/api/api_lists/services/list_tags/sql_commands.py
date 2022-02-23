
from __future__ import annotations
from uuid import UUID
import flask
import pymysql.commands
from pymysql.structs import DbOperationResult
from . import sql_stmts


#------------------------------------------------------
# SQL command that selects all the tags assigned to the given list
#------------------------------------------------------
def selectAll(list_id: UUID) -> DbOperationResult:
    sql = sql_stmts.SELECT_ALL
    
    parms = (
        str(list_id),
        str(flask.g.client_id)
    )

    return pymysql.commands.selectAll(sql, parms)

#------------------------------------------------------
# SQL command to delete all tag assignments for the given list
#------------------------------------------------------
def deleteAll(list_id: UUID) -> DbOperationResult:
    sql = sql_stmts.DELETE_ALL
    
    parms = (
        str(list_id),
        str(flask.g.client_id)
    )

    return pymysql.commands.modify(sql, parms)


#------------------------------------------------------
# SQL command to insert the new List_Tags record
#------------------------------------------------------
def insert(list_id: UUID, tag_id: UUID) -> DbOperationResult:
    sql = sql_stmts.INSERT_SINGLE

    parms = (
        str(list_id),
        str(tag_id),
        str(flask.g.client_id)
    )

    return pymysql.commands.modify(sql, parms)

#------------------------------------------------------
# SQL command to delete a single tag assignment
#------------------------------------------------------
def delete(list_id: UUID, tag_id: UUID) -> DbOperationResult:
    sql = sql_stmts.DELETE_SINGLE

    parms = (
        str(list_id),
        str(tag_id),
        str(flask.g.client_id)
    )

    return pymysql.commands.modify(sql, parms)