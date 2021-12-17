"""
********************************************************************************************
Module:     home
Prefix:     ''
Purpose:    Home page routing
********************************************************************************************
"""

import flask
from ..common import security
from ..api_wrapper import ApiWrapperLists


# module blueprint
bp_home = flask.Blueprint('home', __name__)

#------------------------------------------------------
# Home page (search page)
#------------------------------------------------------
@bp_home.route('')
@security.login_required
def home():

    api_response = ApiWrapperLists(flask.g).get()

    if not api_response.ok:
        return (api_response.text, api_response.status_code)

    return flask.render_template('home/home.html', data=api_response.json())
