"""
********************************************************************************************
Module:     lists
Prefix:     /lists
********************************************************************************************
"""

import flask
from ..common import security
from ..services import lists as list_services

# module blueprint
bp_lists = flask.Blueprint('lists', __name__)

#------------------------------------------------------
# Retrieve a single user
#------------------------------------------------------
@bp_lists.get('')
@security.login_required
def get():

    return list_services.getAllLists()