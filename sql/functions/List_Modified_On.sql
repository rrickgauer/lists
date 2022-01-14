DELIMITER $$

CREATE FUNCTION List_Modified_On(
    list_id CHAR(36)
) 
RETURNS TIMESTAMP
DETERMINISTIC
BEGIN
    -- This function calculates the given lists modified_on value
    -- If the list has any child items, then retrieve the most recent modified_on value for any item
    -- Otherwise, return the list's created_on value

    DECLARE item_modified_on TIMESTAMP;
    
    -- retrieve the most recent modified_on item value
    SELECT i.modified_on
    INTO item_modified_on
    FROM Items i 
    WHERE i.list_id = list_id
    ORDER BY i.modified_on DESC 
    LIMIT 1;
    
    -- if it's not null return it
    IF ISNULL(item_modified_on) = FALSE THEN
        RETURN (item_modified_on);
    END IF;
    
    -- if we get to this point then the list does not have any child items
    -- so just return the list's created_on value
    SELECT l.created_on
    INTO item_modified_on
    FROM Lists l
    WHERE l.id = list_id
    LIMIT 1;
    
    RETURN (item_modified_on);
    
END$$
DELIMITER ;