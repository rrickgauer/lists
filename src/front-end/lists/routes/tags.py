"""
********************************************************************************************
Module:     tags
Prefix:     '/tags'
Purpose:    Routing for tags

********************************************************************************************
"""
import flask
from ..common import security
from ..services import tags as tag_services

# module blueprint
bp_tags = flask.Blueprint('tags', __name__)

#------------------------------------------------------
# Tags page
#------------------------------------------------------
@bp_tags.route('')
@security.login_required
def tagsHome():

    tags_api_response = tag_services.getAllTags()

    payload = dict()
    

    try:
        tags = tags_api_response.json()
    except:
        tags = []

    payload = dict(
        tags = tags
    )

    return flask.render_template('tags/index.html', data=payload)

    
