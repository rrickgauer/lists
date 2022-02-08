-- This function checks if the given user owns the given tag

DELIMITER $$
CREATE FUNCTION `Owns_Tag`(
    in_user_id CHAR(36),
    in_tag_id CHAR(36)
) RETURNS tinyint(1)
    DETERMINISTIC
BEGIN
    DECLARE record_count INT DEFAULT 0;
    DECLARE is_user_tag BOOL;
    
    SELECT COUNT(*) 
    INTO record_count
    FROM Tags t
    WHERE t.id = in_tag_id
    AND t.user_id = in_user_id
    LIMIT 1;
    
    IF record_count = 1 THEN
        SET is_user_tag = TRUE;
    ELSE
        SET is_user_tag = FALSE;
    END IF;

    RETURN (is_user_tag);
END$$
DELIMITER ;
