
"""
********************************************************************************************
Module:     api_lists
Prefix:     /api/lists
Purpose:    create all the routes for the api-lists
********************************************************************************************
"""
import flask
from .. import api_wrapper
from ..common import security

# module blueprint
bp_api_lists = flask.Blueprint('api_lists', __name__)

#------------------------------------------------------
# Create a new list
#------------------------------------------------------
@bp_api_lists.post('')
@security.login_required
def newList():
    # redirect the request to the api
    api = api_wrapper.ApiWrapperLists(flask.g)
    response = api.post(flask.request.form)

    return (response.text, response.status_code)





