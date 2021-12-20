"""
********************************************************************************************
Module:     lists
Prefix:     /lists
********************************************************************************************
"""
from uuid import UUID
import flask
from ..common import security
from ..services import lists as list_services, items as item_services

# module blueprint
bp_lists = flask.Blueprint('lists', __name__)

#------------------------------------------------------
# Retrieve all lists
#------------------------------------------------------
@bp_lists.get('')
@security.login_required
def getAll():
    return list_services.getAllLists()


#------------------------------------------------------
# Retrieve a single list
#------------------------------------------------------
@bp_lists.get('<uuid:list_id>')
@security.login_required
def get(list_id: UUID):
    return list_services.getList(list_id)


#------------------------------------------------------
# Create a new list
#------------------------------------------------------
@bp_lists.post('')
@security.login_required
def post():
    return list_services.createList(flask.request.form.to_dict())
    

#------------------------------------------------------
# Update an existing list
# Or Create a new list with the provided list id from the url
#------------------------------------------------------
@bp_lists.put('<uuid:list_id>')
@security.login_required
def put(list_id: UUID):
    return list_services.updateList(list_id, flask.request.form.to_dict())


#------------------------------------------------------
# Retrieve the items for a single list
#------------------------------------------------------
@bp_lists.get('<uuid:list_id>/items')
@security.login_required
def getListItems(list_id: UUID):
    return item_services.getItems([list_id])


