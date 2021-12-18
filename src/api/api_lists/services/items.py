"""
**********************************************************************************

This module contains all the business logic for lists services.

**********************************************************************************
"""

from uuid import UUID, uuid4
from datetime import datetime
import flask
from ..db_manager import commands as sql_engine, DbOperationResult
from ..common import responses
from ..models import List


#------------------------------------------------------
# Response to a GET request for a single user
#------------------------------------------------------
def getAllItems() -> flask.Response:
    return responses.get('Items services')


    

    