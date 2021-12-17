"""
**********************************************************************************************

This module handles generating flask responses.

A flask response is a tuple that consists of:
    - the body
    - return code

**********************************************************************************************
"""

from http import HTTPStatus
import flask


#----------------------------------------------------------
# Resource successfully GET - the normal return
#----------------------------------------------------------
def get(output=None) -> flask.Response:
    return _standardReturn(output, HTTPStatus.OK)

#----------------------------------------------------------
# Resource was successfully UPDATED
#----------------------------------------------------------
def updated(output=None) -> flask.Response:
    return _standardReturn(output, HTTPStatus.OK)

#----------------------------------------------------------
# Resource was successfully CREATED
#----------------------------------------------------------
def created(output=None) -> flask.Response:
    return _standardReturn(output, HTTPStatus.CREATED)

#----------------------------------------------------------
# Resource was successfully DELETED
#----------------------------------------------------------
def deleted(output=None) -> flask.Response:
    return _standardReturn(output, HTTPStatus.NO_CONTENT)

#----------------------------------------------------------
# Client error
#----------------------------------------------------------
def badRequest(output=None) -> flask.Response:
    return _standardReturn(output, HTTPStatus.BAD_REQUEST)

#----------------------------------------------------------
# Not found error
#----------------------------------------------------------
def notFound(output=None) -> flask.Response:
    return _standardReturn(output, HTTPStatus.NOT_FOUND)

def forbidden(output=None) -> flask.Response:
    return _standardReturn(output, HTTPStatus.FORBIDDEN)

#----------------------------------------------------------
# The standard return logic for all the methods
#----------------------------------------------------------
def _standardReturn(output, response_code: HTTPStatus) -> flask.Response:
    
    if not output:
        return ('', response_code)
    else:
        return (flask.jsonify(output), response_code)



