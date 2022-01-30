"""
********************************************************************************************
Module:     tags
Prefix:     '/tags'
Purpose:    Routing for tags

********************************************************************************************
"""
import flask
from ..common import security

# module blueprint
bp_tags = flask.Blueprint('tags', __name__)

#------------------------------------------------------
# Tags page
#------------------------------------------------------
@bp_tags.route('')
@security.login_required
def tagsHome():
    return flask.render_template('tags/index.html', data=None)

    
