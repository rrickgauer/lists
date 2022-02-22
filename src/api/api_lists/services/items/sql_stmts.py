from __future__ import annotations
from uuid import UUID
import flask

SQL_SELECT_INIT = '''
    SELECT * FROM View_Items vi
    WHERE vi.list_id in (SELECT l.id FROM Lists l WHERE l.user_id = %s)
'''


MODIFY = '''
    INSERT INTO Items (id, list_id, content, `rank`, complete, created_on) 
    VALUES (%s, %s, %s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE 
    content  = VALUES(content),
    complete = VALUES(complete),
    `rank`     = VALUES(`rank`);
'''


UPDATE_COMPLETE = 'UPDATE Items SET complete=%s WHERE id=%s;'


DELETE = '''
    DELETE FROM Items WHERE id=%s
    AND EXISTS (SELECT 1 FROM Lists l WHERE l.user_id=%s)
'''

DELETE_BATCH_TEMPLATE = '''
    DELETE FROM Items i 
    WHERE i.id IN (%s{remaining}) 
    AND i.list_id IN (SELECT l.id FROM Lists l WHERE l.user_id=%s)
'''


TEMPLATE_BATCH_UPDATE = 'INSERT INTO Items (id, `rank`) VALUES {named_parms} ON DUPLICATE KEY UPDATE `rank`=values(`rank`);'




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


#------------------------------------------------------
# Generate the sql statement for the batch delete command
# Every item to be deleted needs to have a corresponding '%s' in the statement
#
# Args:
#   num_items: number of items to be deleted
#
# Returns a str: the delete sql statement
#------------------------------------------------------
def generateBatchDeleteSqlStmt(num_items: int) -> str:
    sql = DELETE_BATCH_TEMPLATE

    # create '%s' string of all items besides first 1 since 
    # it's already in the string created above
    percents = ', %s' * (num_items - 1)
    sql = sql.format(remaining=percents)

    return sql

#------------------------------------------------------
# Generate the paramter tuple for the batch delete sql command
# Tuple is all the item_id's and then the client_id
#------------------------------------------------------
def getBatchDeleteSqlParms(item_ids: list[UUID]) -> tuple:
    # convert all the item_id UUID's into strings
    str_ids = tuple(map(lambda item_id: str(item_id) , item_ids))
    
    # parms are all the item_id's then the client_id
    parms = (*str_ids, str(flask.g.client_id))

    return parms


#------------------------------------------------------
# Generate the sql batch rank update statement
#------------------------------------------------------
def generateBatchUpdateSqlStatement(num_items: int) -> str:
    # generate the string with all the tuples in it
    parms_str = _getBatchUpdateParmSqlString(num_items)
    
    sql = TEMPLATE_BATCH_UPDATE.format(parms_str)

    return sql


#------------------------------------------------------
# Generate a the parameter portion (%s, %s) of the batch 
# update sql string with the given number of items
#
# Args:
#   num_items: number of (%s, %s) elements to add to the string
#------------------------------------------------------
def _getBatchUpdateParmSqlString(num_items: int) -> str:
    first = True
    sql = ''

    for i in range(num_items):
        if not first:
            sql += ', '
        else:
            first = False
        
        sql += '(%s, %s)'


    return sql



