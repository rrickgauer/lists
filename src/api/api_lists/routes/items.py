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
# Do a batch update on multiple items
#------------------------------------------------------
@bp_items.patch('')
@security.login_required
def batch():
    return item_services.patchItems(flask.request)


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

    d = flask.request.form.to_dict()

    print(flask.json.dumps(d, indent=4))

    return item_services.updateItem(item_id, flask.request.form.to_dict())



#------------------------------------------------------
# Delete the item that has the given item id
#------------------------------------------------------
@bp_items.delete('<uuid:item_id>')
@security.login_required
def delete(item_id: UUID):    
    return item_services.deleteItem(item_id)


#------------------------------------------------------
# Update a single item's complete value as either complete or not
#------------------------------------------------------
@bp_items.route('<uuid:item_id>/complete', methods=['PUT', 'DELETE'])
@security.login_required
def completeItem(item_id: UUID):
    return item_services.updateItemComplete(item_id, flask.request.method)

    









