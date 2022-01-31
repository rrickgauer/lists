"""
********************************************************************************************
Module:     tags
Prefix:     /tags
********************************************************************************************
"""
import flask
from ..common import security
from ..services import tags as tag_services

# module blueprint
bp_tags = flask.Blueprint('tags', __name__)

#------------------------------------------------------
# Retrieve all tags
#------------------------------------------------------
@bp_tags.get('')
@security.login_required
def getAll():
    return tag_services.getAllTags()

