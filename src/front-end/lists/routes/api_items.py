
"""
********************************************************************************************
Module:     api_items
Prefix:     /api/items
Purpose:    create all the routes for the api-items
********************************************************************************************
"""
from uuid import UUID
import flask
from .. import api_wrapper
from ..common import security

# module blueprint
bp_api_items = flask.Blueprint('api_items', __name__)

#------------------------------------------------------
# Get all items
#------------------------------------------------------
@bp_api_items.get('')
@security.login_required
def getItems():
    api = api_wrapper.ApiWrapperItems(flask.g)
    api_response = api.get(flask.request)

    return (api_response.text, api_response.status_code)




#------------------------------------------------------
# Patch items
#------------------------------------------------------
@bp_api_items.patch('')
@security.login_required
def batchUpdate():
    api = api_wrapper.ApiWrapperItems(flask.g)
    api_response = api.patch(flask.request)


    return 'hello'
    return (api_response.text, api_response.status_code)











#------------------------------------------------------
# Update an existing item
# /items/:item_id
#------------------------------------------------------
@bp_api_items.put('<uuid:item_id>')
@security.login_required
def put(item_id: UUID):
    api = api_wrapper.ApiWrapperItems(flask.g)
    api_response = api.put(flask.request, item_id)

    return (api_response.text, api_response.status_code)


#------------------------------------------------------
# Delete an item
# /items/:item_id
#------------------------------------------------------
@bp_api_items.delete('<uuid:item_id>')
@security.login_required
def delete(item_id: UUID):
    api = api_wrapper.ApiWrapperItems(flask.g)
    response = api.delete(flask.request, item_id)

    return (response.text, response.status_code)

#------------------------------------------------------
# Update an item's complete value
# /items/:item_id/complete
#------------------------------------------------------
@bp_api_items.route('<uuid:item_id>/complete', methods=['PUT', 'DELETE'])
@security.login_required
def updateComplete(item_id: UUID):
    api = api_wrapper.ApiWrapperItemComplete(flask.g)

    if flask.request.method == 'PUT':
        api_response = api.put(item_id)
    else:
        api_response = api.delete(item_id)
    
    return (api_response.text, api_response.status_code)



