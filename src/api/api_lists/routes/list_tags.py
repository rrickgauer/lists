"""
********************************************************************************************
Module:     list_tags
Prefix:     /lists/:list_id/tags
********************************************************************************************
"""
from uuid import UUID
import flask
from ..common import security
from ..services import list_tags as list_tag_services


# module blueprint
bp_list_tags = flask.Blueprint('list_tags', __name__)

#------------------------------------------------------
# Retrieve all the tags for a list
#------------------------------------------------------
@bp_list_tags.get('')
@security.login_required
def getAll(list_id: UUID):
    return list_tag_services.responseGetTags(list_id)


#------------------------------------------------------
# Delete all assigned tags for the given list
#------------------------------------------------------
@bp_list_tags.delete('')
@security.login_required
def deleteAll(list_id: UUID):
    return list_tag_services.responseDeleteTags(list_id)



#------------------------------------------------------
# Assign the given tag to the given list
#------------------------------------------------------
@bp_list_tags.post('<uuid:tag_id>')
@security.login_required
def assignNewTag(list_id: UUID, tag_id: UUID):
    return list_tag_services.responsePostTag(list_id, tag_id)


#------------------------------------------------------
# Assign the given tag to the given list
#------------------------------------------------------
@bp_list_tags.delete('<uuid:tag_id>')
@security.login_required
def deleteTagAssignment(list_id: UUID, tag_id: UUID):
    return list_tag_services.responseDeleteTag(list_id, tag_id)