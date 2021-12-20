CREATE VIEW View_Items AS 
SELECT 
    i.id AS id,
    i.content AS content,
    i.rank AS `rank`,
    i.complete AS complete,
    i.created_on AS created_on,
    i.modified_on AS modified_on,
    i.list_id AS list_id,
    l.name AS list_name
FROM Items i
LEFT JOIN Lists l ON l.id = i.list_id;