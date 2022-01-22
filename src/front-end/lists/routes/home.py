"""
********************************************************************************************
Module:     home
Prefix:     ''
Purpose:    Home page routing

********************************************************************************************
"""
import flask
from ..common import security
from ..api_wrapper import lists as api_wrapper_lists
from ..services import lists as list_services
import flaskforward

# module blueprint
bp_home = flask.Blueprint('home', __name__)

#------------------------------------------------------
# Home page
# The outgoing data is a dict with fields:
#   lists: list of List objects
#------------------------------------------------------
@bp_home.route('')
@security.login_required
def home():
    response = api_wrapper_lists.getAllLists(flask.g)


    # return the api error if one occurs
    if not response.ok:
        return (response.text, response.status_code)

    # parse the response body data
    try:
        lists_collection = response.json()
    except Exception as e:
        lists_collection = []   # empty response body

    # setup the outgoing payload into a format the template file can use
    payload = list_services.getHomePagePayload(lists_collection)
    
    # generate the response html
    response = flask.make_response(flask.render_template('home/home.html', data=payload))

    # save the user's email as a cookie
    response_updated = security.save_user_email_cookie(response)

    return response_updated

    
