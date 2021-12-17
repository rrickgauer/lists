from enum import Enum
from functools import wraps
import flask


#------------------------------------------------------
# Session key names for the session
#------------------------------------------------------
class SessionKeys(str, Enum):
    USER_ID  = 'userID'
    EMAIL    = 'email'
    PASSWORD = 'password'


#------------------------------------------------------
# Decorator function that verifies that the user's session variables are set.
# If they are, save them to the flask.g object.
# Otherwise, redirect them to the login page.
#------------------------------------------------------
def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        # if user is not logged in, redirect to login page
        if not flask.session:
            # redirect_url = f'{LOGIN_URL_PREFIX}/login'
            return flask.redirect('/login', 302)

        # set the flask g object
        flask.g.user_id  = flask.session.get(SessionKeys.USER_ID)
        flask.g.email    = flask.session.get(SessionKeys.EMAIL)
        flask.g.password = flask.session.get(SessionKeys.PASSWORD)

        return f(*args, **kwargs)

    return wrap


#------------------------------------------------------
# Clear the session values
#------------------------------------------------------
def clear_session_values():
    flask.session.clear()

#------------------------------------------------------
# Set the session values with the given values.
#------------------------------------------------------
def set_session_values(user_id: int, email: str, password: str):
    flask.session.setdefault(SessionKeys.USER_ID, user_id)
    flask.session.setdefault(SessionKeys.EMAIL, email)
    flask.session.setdefault(SessionKeys.PASSWORD, password)