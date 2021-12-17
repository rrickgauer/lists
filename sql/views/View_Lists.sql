CREATE VIEW `View_Lists` AS
SELECT 
    `l`.`id` AS `id`,
    `l`.`name` AS `name`,
    `l`.`created_on` AS `created_on`,
    0 AS `count_items`
FROM
    `Lists` `l`;
