
"""
********************************************************************************************
Module:     api_items
Prefix:     /api/items
Purpose:    create all the routes for the api-items
********************************************************************************************
"""
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
    api_response = api.get(flask.request.args)

    return (api_response.text, api_response.status_code)





