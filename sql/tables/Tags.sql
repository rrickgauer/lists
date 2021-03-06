CREATE TABLE Tags (
    id CHAR(36) NOT NULL UNIQUE,
    name CHAR(30) NOT NULL,
    color CHAR(7) NOT NULL,
    color_text char(7) NOT NULL,
    created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id CHAR(36) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON UPDATE CASCADE ON DELETE CASCADE
);