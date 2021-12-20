
"""
********************************************************************************************
Module:     api_lists
Prefix:     /api/lists
Purpose:    create all the routes for the api-lists
********************************************************************************************
"""
from uuid import UUID
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


#------------------------------------------------------
# Fetch a single list
#------------------------------------------------------
@bp_api_lists.get('<uuid:list_id>')
@security.login_required
def getList(list_id: UUID):
    # redirect the request to the api
    api = api_wrapper.ApiWrapperLists(flask.g)
    response = api.get(list_id)
    return (response.text, response.status_code)





