"""
**********************************************************************************

List tag services

**********************************************************************************
"""


import flask
from uuid import UUID



#------------------------------------------------------
# Retrieve all the tags for the given list
#------------------------------------------------------
def responseGetAll(list_id: UUID) -> flask.Response:
    return 'get all list tags'