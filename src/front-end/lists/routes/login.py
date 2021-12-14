"""
********************************************************************************************
Module:     login
Prefix:     /login
Purpose:    create all the routes related to loggin in or creating an account
********************************************************************************************
"""

import flask


# module blueprint
bp_login = flask.Blueprint('login', __name__)



#------------------------------------------------------
# Home page (search page)
#------------------------------------------------------
@bp_login.route('')
def login():
    return flask.render_template('login/login.html')
