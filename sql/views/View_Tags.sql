CREATE VIEW View_Tags AS 
SELECT 
    t.id AS id,
    t.name AS name,
    t.color AS color,
    t.color_text AS color_text,
    t.created_on AS created_on
FROM Tags t;