CREATE VIEW View_Users AS 
SELECT 
    u.id AS id,
    u.email AS email,
    u.created_on AS created_on
FROM Users u;