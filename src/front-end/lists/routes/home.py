"""
********************************************************************************************
Module:     home
Prefix:     ''
Purpose:    Home page routing
********************************************************************************************
"""
import flask
from lists_common import flaskutil
from ..common import security
from ..api_wrapper import lists as api_wrapper_lists
from ..services import lists as list_services

# module blueprint
bp_home = flask.Blueprint('home', __name__)

#------------------------------------------------------
# Home page (search page)
#------------------------------------------------------
@bp_home.route('')
@security.login_required
def home():
    response = api_wrapper_lists.getAllLists(flask.g)

    if not response.ok:
        return (response.text, response.status_code)

    try:
        lists_collection = response.json()
    except Exception as e:
        lists_collection = []   # empty response body

    payload = list_services.getHomePagePayload(lists_collection)

    return flask.render_template('home/home.html', data=payload)

