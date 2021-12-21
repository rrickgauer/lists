"""
**********************************************************************************

This module contains all the business logic for item services.

**********************************************************************************
"""
from __future__ import annotations
from datetime import datetime
from re import S
from uuid import UUID, uuid4
import flask
from ..db_manager import commands as sql_engine, DbOperationResult
from ..common import responses
from ..models import Item, ItemComplete


SQL_SELECT_INIT = '''
    SELECT * FROM View_Items vi
    WHERE vi.list_id in (SELECT l.id FROM Lists l WHERE l.user_id = %s)
'''


#------------------------------------------------------
# Response to a GET request for items
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



def createNewItem(request_body: dict) -> flask.Response:
    new_item = Item(
        id          = uuid4(),
        list_id     = request_body.get('list_id') or None,
        content     = request_body.get('content') or None,
        complete    = ItemComplete.NO,
    )

    # verify that the content and list_id fields are present
    if None in [new_item.list_id, new_item.content]:
        return responses.badRequest('Missing one of the required fields: list_id or content')
    
    # insert the item into the database
    db_result = _modifyDbCommand(new_item)

    if not db_result.successful:
        return responses.badRequest(db_result.error)
    
    # retrieve the list object from the database that contains all the updated values
    response_data = _query(new_item.id)

    return responses.created(response_data.data)



#------------------------------------------------------
# SQL command that either inserts a new list, or updates
# an exiting record's name if it already exists.
#------------------------------------------------------
def _modifyDbCommand(item: Item) -> DbOperationResult:
    sql = '''
        INSERT INTO Items (id, list_id, content, `rank`, complete) 
        VALUES (%s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE 
        content  = VALUES(content),
        complete = VALUES(complete),
        `rank`     = VALUES(`rank`);
    '''

    parms = (
        str(item.id),
        str(item.list_id),
        item.content,
        item.rank,
        item.complete.value,
    )

    return sql_engine.modify(sql, parms)


#------------------------------------------------------
# Response to a GET request for a single item
#------------------------------------------------------
def getItem(item_id: UUID) -> flask.Response:
    db_result = _query(item_id)

    if not db_result.successful:
        return responses.badRequest(db_result.error)

    return responses.get(db_result.data)


#------------------------------------------------------
# Retrieve the given item from the database
#------------------------------------------------------
def _query(item_id: UUID) -> DbOperationResult:
    sql = f'{SQL_SELECT_INIT} AND vi.id = %s LIMIT 1;'
    
    parms = (
        str(flask.g.client_id),
        str(item_id)
    )

    return sql_engine.select(sql, parms, False)
