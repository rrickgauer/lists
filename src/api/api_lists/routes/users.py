"""
********************************************************************************************
Module:     users
Prefix:     /users
Purpose:    create all the routes related to users
********************************************************************************************
"""

import flask
from ..services import users as user_services
from ..common import security


# module blueprint
bp_users = flask.Blueprint('users', __name__)

#------------------------------------------------------
# Retrieve a single user
#------------------------------------------------------
@bp_users.get('')
@security.login_required
def get():
    return user_services.responseGet(flask.g.client_id)

#------------------------------------------------------
# Create a new user
#------------------------------------------------------
@bp_users.post('')
def post():
    request_body = flask.request.form.to_dict()
    return user_services.responsePost(request_body)
