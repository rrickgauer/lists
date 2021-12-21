"""
********************************************************************************************
Module:     items
Prefix:     /items
********************************************************************************************
"""
from uuid import UUID
import flask
from ..common import security
from ..services import items as item_services


# module blueprint
bp_items = flask.Blueprint('items', __name__)

#------------------------------------------------------
# Retrieve all of user's list items.
#
# Clients can filter based provide multiple list_id's in
# the request url query parms.
#------------------------------------------------------
@bp_items.get('')
@security.login_required
def getAll():
    # get the list_id query parm(s) if they were provided
    query_parms = flask.request.args.to_dict(False)
    list_ids = query_parms.get('list_id') or None

    return item_services.getItems(list_ids)


#------------------------------------------------------
# Create a new item
#------------------------------------------------------
@bp_items.post('')
@security.login_required
def post():
    return item_services.createNewItem(flask.request.form.to_dict())

#------------------------------------------------------
# Retrieve a single item
#------------------------------------------------------
@bp_items.get('<uuid:item_id>')
@security.login_required
def get(item_id: UUID):
    return item_services.getItem(item_id)


#------------------------------------------------------
# Update an existing item or create a new one with the 
# given item id
#------------------------------------------------------
@bp_items.put('<uuid:item_id>')
@security.login_required
def put(item_id: UUID):
    return item_services.updateItem(item_id, flask.request.form.to_dict())









