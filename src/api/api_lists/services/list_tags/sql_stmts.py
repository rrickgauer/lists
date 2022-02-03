"""
This module holds all the sql statements for List_Tags
"""


#------------------------------------------------------
# Select all the tags assigned to a list
#
# 2 parms: 
#   - list_id
#   - user_id
#------------------------------------------------------
SELECT_ALL = '''
    SELECT * 
    FROM View_Tags vt
    WHERE EXISTS 
    (
        SELECT  1 
        FROM    List_Tags lt
        WHERE   lt.list_id = %s 
        AND     lt.tag_id = vt.id
        AND     Owns_List(%s, lt.list_id)
    )
    
    ORDER BY vt.name ASC;
'''

#------------------------------------------------------
# Delete all the tag assignments to a list
#
# 2 parms: 
#   - list_id
#   - user_id
#------------------------------------------------------
DELETE_ALL = '''
    DELETE FROM List_Tags lt
    WHERE   lt.list_id = %s
    AND     OWNS_LIST(%s, lt.list_id);
'''


#------------------------------------------------------
# Insert a List_Tags record
# Calls a stored procedure
#
# 3 parms: 
#   - list_id
#   - tag_id
#   - user_id
#------------------------------------------------------
INSERT_SINGLE = 'CALL Insert_List_Tag(%s, %s, %s);'