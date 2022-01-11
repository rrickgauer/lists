CREATE VIEW View_Lists AS
SELECT 
    `l`.`id` AS `id`,
    `l`.`name` AS `name`,
    `l`.`type` AS `type`,
    `l`.`created_on` AS `created_on`,
    List_Modified_On(`l`.`id`) as `modified_on`,
    COUNT(i.id) AS count_items
FROM `Lists` `l`
LEFT JOIN Items i ON i.list_id = l.id
GROUP BY l.id;