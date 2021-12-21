
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
# Update an existing item
# /items/:item_id
#------------------------------------------------------
@bp_api_items.put('<uuid:item_id>')
@security.login_required
def put(item_id: UUID):
    api = api_wrapper.ApiWrapperItems(flask.g)
    api_response = api.put(flask.request, item_id)

    return (api_response.text, api_response.status_code)






