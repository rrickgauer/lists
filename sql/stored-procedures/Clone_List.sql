DELIMITER $$
CREATE PROCEDURE `Clone_List`(
    IN template_id CHAR(36),
    IN new_list_id CHAR(36)
)
BEGIN
    -- This procedure creates a clone of the given list
    -- It creates a new list record with an id of the given new_list_id
    -- Then, it copies all the items belonging to the existing list into the new list

    -- create a new list record that has the given clone_id and name of the template list
    INSERT INTO Lists (id, user_id, name, `type`)
    SELECT new_list_id, user_id, l.name, 'list' 
    FROM Lists l WHERE l.id = template_id;

    -- copy over all the template's items into the new list
    INSERT INTO Items (id, list_id, content, `rank`, complete)
    SELECT UUID(), new_list_id, i.content, i.`rank`, i.complete
    FROM Items i
    WHERE i.list_id = template_id;
    
END$$
DELIMITER ;
