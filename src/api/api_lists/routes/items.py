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

    query_parms = flask.request.args.to_dict(False)
    list_ids = query_parms.get('list_id') or None

    return item_services.getItems(list_ids)


