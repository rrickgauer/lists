"""
**********************************************************************************

All the sql statements for Lists

**********************************************************************************
"""

from enum import Enum

# the template for selecting multiple lists from the database
SELECT_ALL_TEMPLATE = '''
    SELECT * FROM View_Lists vl
    WHERE EXISTS (
        SELECT 1 FROM Lists l
        WHERE l.user_id = %s
        AND l.id = vl.id
        {}
    )
    ORDER BY modified_on DESC
'''


# Holds all the sql statements for selecting multiple lists (all or filter by type)
class SqlSelectStmts(str, Enum):
    ALL         = SELECT_ALL_TEMPLATE.format('')                        # all lists
    FILTER_TYPE = SELECT_ALL_TEMPLATE.format(' AND l.`type` = %s ')     # Filter by list type


# sql statement for selecting a single list
SELECT_SINGLE = '''
    SELECT * FROM View_Lists vl
    WHERE vl.id = %s
    AND vl.id IN (SELECT l.id FROM Lists l WHERE l.user_id = %s)
    LIMIT 1
'''

# sql statement that either inserts a new list, or updates an existing one
MODIFY = '''
    INSERT INTO Lists (id, user_id, name, created_on, `type`) 
    VALUES (%s, %s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE 
    name   = VALUES(name),
    `type` = VALUES (`type`);
'''


# sql statement to delete a list
DELETE = 'DELETE FROM Lists WHERE id=%s AND user_id=%s'


CLONE_LIST = 'CALL Clone_List(%s, %s, %s, %s);'