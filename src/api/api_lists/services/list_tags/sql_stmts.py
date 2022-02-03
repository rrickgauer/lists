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