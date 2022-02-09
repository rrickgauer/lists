DELIMITER $$
CREATE DEFINER=`main`@`%` PROCEDURE `Clone_List`(
    IN in_user_id char(36),
    IN template_id CHAR(36),
    IN new_list_id CHAR(36),
    IN new_list_name char(100)
)
BEGIN

	/****************************************************************************************
	This procedure creates a clone of the given list
	It creates a new list record with an id of the given new_list_id
	Then, it copies all the items belonging to the existing list into the new list
	Then, it assigns all the tags that are currently assigned to the template
	*****************************************************************************************/

    -- create a new list record that has the given clone_id and name of the template list
    INSERT INTO Lists (id, user_id, name, `type`, created_on)
    SELECT new_list_id, in_user_id, new_list_name, 'list', NOW() 
    FROM Lists l 
    WHERE l.id = template_id
    AND l.user_id = in_user_id;
    
    
    -- copy over all the template's items into the new list
    INSERT INTO Items (id, list_id, content, `rank`, complete)
    SELECT UUID(), new_list_id, i.content, i.`rank`, i.complete
    FROM Items i
    WHERE i.list_id = template_id;
    
    -- copy over all the template's assigned tag records for the new list
    INSERT INTO List_Tags (list_id, tag_id)
	SELECT new_list_id, lt.tag_id
	FROM List_Tags lt
	WHERE lt.list_id = template_id;
    
END$$
DELIMITER ;
