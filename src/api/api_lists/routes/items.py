"""
********************************************************************************************
Module:     items
Prefix:     /items
********************************************************************************************
"""

import flask
from ..common import security
from ..services import items as item_services


# module blueprint
bp_items = flask.Blueprint('items', __name__)

#------------------------------------------------------
# Retrieve all a user's list items
#------------------------------------------------------
@bp_items.get('')
@security.login_required
def getAll():
    return item_services.getItems()


