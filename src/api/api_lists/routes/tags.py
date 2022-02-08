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
        return tag_services.responsePostTag(flask.request)
    
    # Retrieve all tags
    else:
        return tag_services.responseGetAllTags()


#------------------------------------------------------
# Endpoints for tags with no id in the url
#------------------------------------------------------
@bp_tags.route('<uuid:tag_id>', methods = ['GET', 'DELETE', 'PUT'])
@security.login_required
def tagsWithIDtagsNoID(tag_id: UUID):

    if flask.request.method == 'DELETE':
        return tag_services.responseDeleteTag(tag_id)
    elif flask.request.method == 'PUT':
        return tag_services.responsePutTag(tag_id, flask.request)
    else:
        return tag_services.responseGetSingleTag(tag_id)

