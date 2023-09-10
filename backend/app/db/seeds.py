from sqlalchemy import create_engine
from sqlalchemy.sql import text
import random
import string
import os
env_var = os.environ

# SQLAlchemy >= 1.4 deprecated the use of `postgres://` in favor of `postgresql://`
# for the database connection url
database_url = env_var['DATABASE_URL'].replace("postgres://", "postgresql://")

engine = create_engine(database_url, echo=False)

user_insert_statement = text("""INSERT INTO users(username, email, salt, bio, hashed_password, role) VALUES(:username, :email, :salt, :bio, :hashed_password, :role) ON CONFLICT DO NOTHING""")

letters = string.ascii_lowercase

with engine.connect() as con:
    regularUser = {'username': 'regularUser', 'email':'regularUser@mail.com', 'salt': 'abc', 'bio': 'bio', 'hashed_password':'123456', 'role': 'user'}
    con.execute(user_insert_statement, **regularUser)

    adminUser = {'username': 'adminUser', 'email':'adminUser@mail.com', 'salt': 'abc', 'bio': 'bio', 'hashed_password':'123456', 'role': 'admin'}
    con.execute(user_insert_statement, **adminUser)
