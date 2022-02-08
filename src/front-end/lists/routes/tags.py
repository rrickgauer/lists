"""
********************************************************************************************
Module:     tags
Prefix:     '/tags'
Purpose:    Routing for tags


Outgoing data:
    - lists (collection)
        - id
        - name
        - color
        - created_on
        - text_color

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
    try:
        tags_api_response = tag_services.getAllTags()
        tags = tags_api_response.json()
    except:
        tags = []

    tag_services.calculateTextColors(tags)

    payload = dict(
        tags = tags
    )

    return flask.render_template('tags/index.html', data=payload)

    
