from __future__ import annotations
import flask
from functools import wraps
from ..db_manager import commands as sql_engine


#------------------------------------------------------
# Verifies that:
#   - client request has basic authentication header fields
#   - the credentials are correct
#------------------------------------------------------
def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        # if user is not logged in, redirect to login page
        if not flask.request.authorization:
            flask.abort(401)
        
        # make sure the user is authorized
        client_id = getUserID(flask.request.authorization.username, flask.request.authorization.password)

        if client_id == None:
            flask.abort(403)
        
        flask.g.client_id = client_id

        return f(*args, **kwargs)

    return wrap


#------------------------------------------------------
# Get a user's id from their email/password combination
#
# Parms:
#   email - user's email
#   password - user's password
# 
# Returns: 
#   user's id - (email/password combo was correct)
#   None - (INCORRECT email/password combo)
#------------------------------------------------------
def getUserID(email: str, password: str) -> str | None:
    try:
        sql = 'SELECT id FROM Users u WHERE u.email=%s AND u.password=%s LIMIT 1'
        parms = (email, password)

        db_return = sql_engine.select(sql, parms, False)
        return db_return.data.get('id')
    except Exception as e:
        print(e)
        return None
