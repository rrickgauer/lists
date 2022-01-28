
"""
********************************************************************************************
Module:     api
Prefix:     /api
Purpose:    create all the routes for the api
********************************************************************************************
"""

import flask
import flaskforward
from .. import api_wrapper
from ..common import security

# module blueprint
bp_api = flask.Blueprint('api', __name__)

#------------------------------------------------------
# Create a new account
#------------------------------------------------------
@bp_api.post('users')
def signUp():
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


#------------------------------------------------------
# Create a new account
#
# Need to provide email and password in request body
#------------------------------------------------------
@bp_api.post('login')
def login():
    # create a user api wrapper to fetch their account data
    user_email    = flask.request.form.get('email') or None
    user_password = flask.request.form.get('password') or None

    body = flaskforward.structs.SingleRequest(
        url = f'{api_wrapper.URL_BASE}{api_wrapper.ApiUrls.USERS}',
        auth = (user_email, user_password),
        method = flaskforward.enums.RequestMethods.GET
    )

    api_response = flaskforward.routines.sendRequest(body)


    # invalid email/password combination
    if not api_response.ok:
        return (api_response.text, api_response.status_code)
    
    # save the user's credentials since it was a successful login
    security.clear_session_values()

    security.set_session_values(
        user_id  = api_response.json().get('id'),
        email    = user_email,
        password = user_password,
    )

    return ('', api_response.status_code)


#------------------------------------------------------
# Forward all these requests to the api
#------------------------------------------------------
@bp_api.route('<path:api_endpoint>', methods=flaskforward.enums.RequestMethods.values())
@security.login_required
def router(api_endpoint):
    body = flaskforward.structs.SingleRequest(
        url    = f'{api_wrapper.base_wrapper.URL_BASE}{api_endpoint}',
        auth   = (flask.g.email, flask.g.password),
        method = flask.request.method,
        data   = flaskforward.routines._getData(flask.request),
        params = flask.request.args.to_dict(),
        headers = dict(),
    )

    if flask.request.is_json:
        body.headers.setdefault('Content-Type', 'application/json')

    api_response = flaskforward.routines.sendRequest(body)

    return flaskforward.routines.toFlaskResponse(api_response)
