
# This module contains all the sql statements for tags

SELECT_ALL = '''
    SELECT * FROM View_Tags vt
    WHERE EXISTS (
        SELECT 1 FROM Tags t
        WHERE t.user_id = %s 
        AND t.id = vt.id
    )
    ORDER BY vt.name ASC;
'''


INSERT_UPDATE = '''
    INSERT INTO Tags (id, name, color, created_on, user_id) 
    VALUES (%s, %s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    color = VALUES(color);
'''



