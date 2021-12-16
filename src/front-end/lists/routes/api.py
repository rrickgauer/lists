
"""
********************************************************************************************
Module:     api
Prefix:     /api
Purpose:    create all the routes for the api
********************************************************************************************
"""

import flask
# from requests import api

from .. import api_wrapper


# module blueprint
bp_api = flask.Blueprint('api', __name__)



#------------------------------------------------------
# Home page (search page)
#------------------------------------------------------
@bp_api.post('users')
def login():
    request_form = flask.request.form.to_dict()
    api_response = api_wrapper.createAccount(request_form)

    return (api_response.text, api_response.status_code)

    
