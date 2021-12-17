
"""
********************************************************************************************
Module:     api
Prefix:     /api
Purpose:    create all the routes for the api
********************************************************************************************
"""

import flask
from .. import api_wrapper
from ..common import security

# module blueprint
bp_api = flask.Blueprint('api', __name__)

#------------------------------------------------------
# Create a new account
#------------------------------------------------------
@bp_api.post('users')
def login():
    request_form = flask.request.form.to_dict()
    api_response = api_wrapper.createAccount(request_form)

    if api_response.ok:
        # save the user's credentials if successfully created an account
        security.clear_session_values()

        user_data: dict = api_response.json()

        security.set_session_values(
            user_id  = user_data.get('id'),
            email    = request_form.get('email'),
            password = request_form.get('password'),
        )

        response_text = ''
    else:
        response_text = api_response.text

    return (response_text, api_response.status_code)

    
