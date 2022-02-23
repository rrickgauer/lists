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

# Insert or update a tag - depends on whether it exists already
MODIFY = '''
    INSERT INTO Tags (id, name, color, created_on, user_id) 
    VALUES (%s, %s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    color = VALUES(color);
'''

# Delete a tag
DELETE = '''
    DELETE FROM Tags t 
    WHERE t.id = %s
    AND t.user_id = %s;
'''



