"""
********************************************************************************************
Module:     users
Prefix:     /users
Purpose:    create all the routes related to users
********************************************************************************************
"""

import uuid
import flask
from ..services import users as user_services

# module blueprint
bp_users = flask.Blueprint('users', __name__)

#------------------------------------------------------
# Retrieve a single user
#------------------------------------------------------
@bp_users.get('<uuid:user_id>')
def get(user_id: uuid.UUID):
    return user_services.responseGet(user_id)


#------------------------------------------------------
# Create a new user
#------------------------------------------------------
@bp_users.post('')
def post():
    request_body = flask.request.form.to_dict()
    return user_services.responsePost(request_body)
