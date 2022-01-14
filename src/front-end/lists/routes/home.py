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

    lists = response.json()
    lists_by_type = api_wrapper_lists.splitListsByType(lists)

    return flask.render_template('home/home.html', data=lists_by_type)
