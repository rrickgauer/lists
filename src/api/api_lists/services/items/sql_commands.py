from __future__ import annotations
from uuid import UUID
import flask
import pymysql.commands
from pymysql.structs import DbOperationResult
from ...models import Item, ItemComplete
from . import sql_stmts

#------------------------------------------------------
# Get all items from database
#------------------------------------------------------
def selectAll() -> DbOperationResult:
    sql = f'{sql_stmts.SQL_SELECT_INIT} ORDER BY created_on DESC'
    parms = (str(flask.g.client_id),)

    return pymysql.commands.selectAll(sql, parms)


#------------------------------------------------------
# Get the items that are children of the given lists
#------------------------------------------------------
def selectAllFromLists(list_ids: list[UUID]) -> DbOperationResult:
    sql = sql_stmts._getQueryFilterStmt(len(list_ids)) + ' ORDER BY -`rank` DESC, modified_on DESC;'
    parms = sql_stmts._getQueryFilterParms(list_ids)
    return pymysql.commands.selectAll(sql, parms)


#------------------------------------------------------
# SQL command that either inserts a new list, or updates
# an exiting record's name if it already exists.
#------------------------------------------------------
def modify(item: Item) -> DbOperationResult:
    parms = (
        str(item.id),
        str(item.list_id),
        item.content,
        item.rank,
        item.complete.value,
        item.created_on.isoformat()
    )

    return pymysql.commands.modify(sql_stmts.MODIFY, parms)

#------------------------------------------------------
# Retrieve the given item from the database
#------------------------------------------------------
def selectSingle(item_id: UUID) -> DbOperationResult:
    sql = f'{sql_stmts.SQL_SELECT_INIT} AND vi.id = %s LIMIT 1;'
    
    parms = (
        str(flask.g.client_id),
        str(item_id)
    )

    return pymysql.commands.select(sql, parms)


#------------------------------------------------------
# Retrieve the given item from the database
#------------------------------------------------------
def updateComplete(item_id: UUID, complete: ItemComplete) -> DbOperationResult:
    parms = (
        complete.value, 
        str(item_id)
    )

    return pymysql.commands.modify(sql_stmts.UPDATE_COMPLETE, parms)

#------------------------------------------------------
# Execute a sql command to delete the given item
#------------------------------------------------------
def delete(item_id: UUID) -> DbOperationResult:
    parms = (
        str(item_id), 
        str(flask.g.client_id)
    )

    return pymysql.commands.modify(sql_stmts.DELETE, parms)


#------------------------------------------------------
# Execute the sql command to batch update item ranks
#------------------------------------------------------
def updateRanks(items: list[Item]) -> DbOperationResult:
    # generate the update sql statement
    sql = sql_stmts.generateBatchUpdateSqlStatement(len(items))

    # transform the list of items into a tuple
    parms = _itemsListToTuple(items)

    return pymysql.commands.modify(sql, parms)


#------------------------------------------------------
# Transform the given list of items into a tuple 
# for the batch update sql statement.
#------------------------------------------------------
def _itemsListToTuple(items: list[Item]) -> tuple:
    tuple_list = []

    for item in items:
        tuple_list.append(str(item.id))
        tuple_list.append(item.rank)

    return tuple(tuple_list)


#------------------------------------------------------
# Delete the given list of item ids from the database
#------------------------------------------------------
def deleteBatch(item_ids: list[UUID]) -> DbOperationResult:
    # generate the sql statement for the delete command
    sql = sql_stmts.generateBatchDeleteSqlStmt(len(item_ids))

    # get the parms
    parms = sql_stmts.getBatchDeleteSqlParms(item_ids)

    return pymysql.commands.modify(sql, parms)