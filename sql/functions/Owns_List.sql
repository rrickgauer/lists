-- This function checks if the given user owns the given list

DELIMITER $$
CREATE FUNCTION `Owns_List`(
    in_user_id CHAR(36),
    in_list_id CHAR(36)
) RETURNS tinyint(1)
    DETERMINISTIC
BEGIN
    DECLARE record_count INT DEFAULT 0;
    DECLARE is_user_list BOOL;
    
    SELECT COUNT(*) 
    INTO record_count
    FROM Lists l 
    WHERE l.id = in_list_id
    AND l.user_id = in_user_id
    LIMIT 1;
    
    IF record_count = 1 THEN
        SET is_user_list = TRUE;
    ELSE
        SET is_user_list = FALSE;
    END IF;

    RETURN (is_user_list);
END$$
DELIMITER ;
