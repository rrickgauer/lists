"""
********************************************************************************************
Module:     users
Prefix:     /users
Purpose:    create all the routes related to users
********************************************************************************************
"""

import uuid
from datetime import date, datetime
import flask

from ..models import User

# module blueprint
bp_users = flask.Blueprint('users', __name__)

#------------------------------------------------------
# Users
#------------------------------------------------------
@bp_users.route('')
def get():

    user = User(
        id = uuid.uuid4(),
        # email = 'this is the email',
        # password = 'password',
        # created_on = datetime.now()
    )

    return flask.jsonify(user.__dict__)

    return 'users'
