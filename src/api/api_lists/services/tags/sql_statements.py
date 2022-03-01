"""
**********************************************************************************
All the SQL statements for selecting/modifying Tags in the database
**********************************************************************************
"""

# Select all tags owned by a user
SELECT_ALL = '''
    SELECT * FROM View_Tags vt
    WHERE EXISTS (
        SELECT 1 FROM Tags t
        WHERE t.user_id = %s 
        AND t.id = vt.id
    )
    ORDER BY vt.name ASC;
'''

# Select a single tag
SELECT_SINGLE = '''
    SELECT * FROM View_Tags vt
    WHERE EXISTS (
        SELECT 1 FROM Tags t
        WHERE t.user_id = %s 
        AND t.id = vt.id
        AND t.id = %s
    )
    ORDER BY vt.name ASC;
'''


#------------------------------------------------------
# Insert or update a tag - depends on whether it exists already
# 
# Parms:
#   1. id
#   2. name
#   3. color
#   4. color_text
#   5. created_on
#   6. user_id
#------------------------------------------------------
MODIFY = '''
    INSERT INTO Tags (id, name, color, color_text, created_on, user_id) 
    VALUES (%s, %s, %s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    color = VALUES(color),
    color_text = VALUES(color_text);
'''

# Delete a tag
DELETE = '''
    DELETE FROM Tags t 
    WHERE t.id = %s
    AND t.user_id = %s;
'''



