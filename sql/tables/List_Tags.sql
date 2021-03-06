CREATE TABLE List_Tags (
    list_id CHAR(36) NOT NULL,
    tag_id CHAR(36) NOT NULL,
    created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (list_id, tag_id),
    FOREIGN KEY (list_id) REFERENCES Lists(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES Tags(id) ON UPDATE CASCADE ON DELETE CASCADE
);