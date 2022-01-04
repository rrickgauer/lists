
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
# Send an api request for existing lists
#------------------------------------------------------
@bp_api_lists.route('<uuid:list_id>', methods=['GET', 'PUT', 'DELETE'])
@security.login_required
def existingList(list_id: UUID):
    # redirect the request to the api
    api = api_wrapper.ApiWrapperLists(flask.g)

    if flask.request.method == 'DELETE':
        response = api.delete(flask.request, list_id)                  # delete a list
    elif flask.request.method == 'PUT':
        response = api.put(flask.request, list_id)      # put a list
    else:
        response = api.get(list_id)                     # get a list
    
    return (response.text, response.status_code)
    




