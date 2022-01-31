import requests
import flask
import flaskforward
from .. import api_wrapper

def getAllTags() -> requests.Response:
    
    body = flaskforward.structs.SingleRequest(
        url    = f'{api_wrapper.base_wrapper.URL_BASE}{api_wrapper.ApiUrls.TAGS}',
        auth   = (flask.g.email, flask.g.password),
        method = 'GET',
    )

    api_response = flaskforward.routines.sendRequest(body)

    return api_response
