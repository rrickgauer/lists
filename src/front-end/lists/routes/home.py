"""
********************************************************************************************
Module:     home
Prefix:     ''
Purpose:    Home page routing

Outgoing data:
    - lists (collection)
        - id
        - name
        - type
        - created_on
        - modified_on
        - count_items
        - type_icon
    
    - tags (collection)
        - id
        - name
        - color
        - created_on

********************************************************************************************
"""
import flask
from ..common import security
from ..services import lists as list_services
from ..services import tags as tag_services

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
    payload = dict(
        lists = list_services.getUserListsCollectionPayload(),
        tags = tag_services.getTagsHomePagePayload()
    )

    # generate the response html
    response = flask.make_response(flask.render_template('home/home.html', data=payload))

    # save the user's email as a cookie
    response_updated = security.save_user_email_cookie(response)

    return response_updated

    
