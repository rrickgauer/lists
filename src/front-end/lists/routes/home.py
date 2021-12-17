"""
********************************************************************************************
Module:     home
Prefix:     ''
Purpose:    Home page routing
********************************************************************************************
"""

import flask
from ..common import security


# module blueprint
bp_home = flask.Blueprint('home', __name__)

#------------------------------------------------------
# Home page (search page)
#------------------------------------------------------
@bp_home.route('')
@security.login_required
def home():
    return flask.render_template('home/home.html')
