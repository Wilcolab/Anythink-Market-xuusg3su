-- name: get-user-by-email^
SELECT id,
       username,
       email,
       salt,
       hashed_password,
       bio,
       image,
       created_at,
       updated_at,
       role
FROM users
WHERE email = :email
LIMIT 1;

-- name: get-all-users^
SELECT id,
       username,
       email,
       salt,
       hashed_password,
       bio,
       image,
       created_at,
       updated_at,
       role
FROM users
LIMIT 100;



-- name: get-user-by-username^
SELECT id,
       username,
       email,
       salt,
       hashed_password,
       bio,
       image,
       created_at,
       updated_at,
       role
FROM users
WHERE username = :username
LIMIT 1;


-- name: create-new-user<!
INSERT INTO users (username, email, salt, hashed_password, role)
VALUES (:username, :email, :salt, :hashed_password, :role)
RETURNING
    id, created_at, updated_at;


-- name: update-user-by-username<!
UPDATE
    users
SET username        = :new_username,
    email           = :new_email,
    salt            = :new_salt,
    hashed_password = :new_password,
    bio             = :new_bio,
    image           = :new_image
WHERE username = :username
RETURNING
    updated_at;
