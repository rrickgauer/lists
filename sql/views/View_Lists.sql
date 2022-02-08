SELECT `l`.`id`                               AS `id`,
       `l`.`name`                             AS `name`,
       `l`.`type`                             AS `type`,
       `l`.`created_on`                       AS `created_on`,
       LIST_MODIFIED_ON(`l`.`id`)             AS `modified_on`,
       (SELECT COUNT(0)
        FROM   `List_Tags` `lt`
        WHERE  ( `lt`.`list_id` = `l`.`id` )) AS `count_tags`,
       (SELECT COUNT(0)
        FROM   `Items` `i`
        WHERE  ( `i`.`list_id` = `l`.`id` ))  AS `count_items`
FROM   `Lists` `l`
GROUP  BY `l`.`id` 