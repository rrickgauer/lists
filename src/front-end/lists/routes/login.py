"""
********************************************************************************************
Module:     login
Prefix:     /login
Purpose:    create all the routes related to loggin in or creating an account
********************************************************************************************
"""

import flask
from ..common import security

# module blueprint
bp_login = flask.Blueprint('login', __name__)

#------------------------------------------------------
# Home page (search page)
#------------------------------------------------------
@bp_login.route('')
def login():
    security.clear_session_values()

    payload = dict(
        cookies = flask.request.cookies.to_dict()
    )
    
    return flask.render_template('login/login.html', data=payload)
