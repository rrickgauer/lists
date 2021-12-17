"""
********************************************************************************************
Module:     lists
Prefix:     /lists
********************************************************************************************
"""
from uuid import UUID
import flask
from ..common import security
from ..services import lists as list_services

# module blueprint
bp_lists = flask.Blueprint('lists', __name__)

#------------------------------------------------------
# Retrieve all lists
#------------------------------------------------------
@bp_lists.get('')
@security.login_required
def getAll():
    return list_services.getAllLists()


#------------------------------------------------------
# Retrieve a single list
#------------------------------------------------------
@bp_lists.get('<uuid:list_id>')
@security.login_required
def get(list_id: UUID):
    return list_services.getList(list_id)
    





