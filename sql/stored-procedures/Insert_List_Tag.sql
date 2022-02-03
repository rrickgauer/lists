-- This procedure creates a new List_Tags record for the given list/tag
-- It also verifies that the given user owns both the list and tag

DELIMITER $$
CREATE PROCEDURE `Insert_List_Tag`(
    IN in_list_id char(36),
    IN in_tag_id char(36),
    IN in_user_id char(36)
)
BEGIN
    INSERT INTO List_Tags (list_id, tag_id)
    (
        SELECT 
        (
            -- insert the list id
            SELECT l.id FROM Lists l
            WHERE l.id = in_list_id
            AND OWNS_LIST(in_user_id, l.id)
        ),
        (
            -- insert the tag id
            SELECT t.id FROM Tags t
            WHERE t.id = in_tag_id
            AND OWNS_TAG(in_user_id, t.id)
        )
    );

END$$
DELIMITER ;
