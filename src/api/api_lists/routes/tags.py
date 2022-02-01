"""
********************************************************************************************
Module:     tags
Prefix:     /tags
********************************************************************************************
"""
from uuid import UUID
import flask
from ..common import security
from ..services import tags as tag_services

# module blueprint
bp_tags = flask.Blueprint('tags', __name__)


#------------------------------------------------------
# Endpoints for tags with no id in the url
#------------------------------------------------------
@bp_tags.route('', methods = ['GET', 'POST'])
@security.login_required
def tagsNoID():
    # create a new tag
    if flask.request.method == 'POST':
        return tag_services.postTag(flask.request)
    
    # Retrieve all tags
    else:
        return tag_services.getAllTags()


#------------------------------------------------------
# Endpoints for tags with no id in the url
#------------------------------------------------------
@bp_tags.route('<uuid:tag_id>', methods = ['GET'])
@security.login_required
def tagsWithIDtagsNoID(tag_id: UUID):

    return tag_services.getSingleTag(tag_id)

