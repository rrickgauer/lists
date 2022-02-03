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
        AND     lt.list_id IN 
                (
                    SELECT l.id 
                    FROM Lists l 
                    WHERE l.user_id = %s
                )
    );
'''