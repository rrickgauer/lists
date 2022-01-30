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
# Routes with no item_id provided
#------------------------------------------------------
@bp_items.route('', methods=['GET', 'POST', 'PATCH', 'DELETE'])
@security.login_required
def items():
    
    # Create a new item
    if flask.request.method == "POST":
        return item_services.createNewItem(flask.request.form.to_dict())
    
    # Do a batch update on multiple items
    elif flask.request.method == "PATCH":
        return item_services.patchItems(flask.request)
    
    # Do a batch delete of items
    # Body must contain a json list of item ids.
    elif flask.request.method == "DELETE":
        return item_services.batchDeleteItems(flask.request)
    
    # GET
    # Retrieve all of user's list items.
    # Clients can filter based provide multiple list_id's in the request url query parms.
    else:
        # get the list_id query parm(s) if they were provided
        query_parms = flask.request.args.to_dict(False)
        list_ids = query_parms.get('list_id') or None

        return item_services.getItems(list_ids)

        

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
    form = flask.request.form.to_dict()
    return item_services.updateItem(item_id, form)



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

    









