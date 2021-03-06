"""
**********************************************************************************
This module contains all services related to tags.
**********************************************************************************
"""
from typing import Tuple
from enum import Enum
from datetime import datetime
from uuid import UUID, uuid4
import flask
from colour import Color
from ...common import responses
from ...models import Tag
from . import sql_commands


# Text color values
class TextColors(str, Enum):
    WHITE = '#ffffff'
    BLACK = '#000000'


# Possible error messages to return for a bad request
class ErrorMessages(str, Enum):
    POST_MISSING_FIELDS = 'Missing a required field: name or tag'


#------------------------------------------------------
# Get all tags response
#------------------------------------------------------
def responseGetAllTags() -> flask.Response:
    sql_result = sql_commands.selectAll()

    if not sql_result.successful:
        return responses.badRequest(sql_result.error)
    
    return responses.get(sql_result.data)
    

#------------------------------------------------------
# Respond to a POST /tags request
#------------------------------------------------------
def responsePostTag(flask_request: flask.Request) -> flask.Response:
    new_tag_id = uuid4()    # new tags get an auto-generated UUID
    request_form = flask_request.form.to_dict()
    return _responsePutPostTag(new_tag_id, request_form, responses.created)

#------------------------------------------------------
# Respond to PUT /tags/:tag_id request
#------------------------------------------------------
def responsePutTag(tag_id: UUID, flask_request: flask.Request) -> flask.Response:
    request_form = flask_request.form.to_dict()
    return _responsePutPostTag(tag_id, request_form, responses.updated)

#------------------------------------------------------
# Shared logic for POST/PUT requests
#------------------------------------------------------
def _responsePutPostTag(tag_id: UUID, flask_request_form: dict, responses_method) -> flask.Response:
    # update/insert the given tag_id and request form dictionary
    successful, error_message = modifyTag(tag_id, flask_request_form)

    # if it's not successful return error message
    if not successful:
        return responses.badRequest(error_message)

    # return the response used for a GET request for a single tag
    tag_view_table = sql_commands.selectSingle(tag_id).data

    return responses_method(tag_view_table)

#------------------------------------------------------
# Modify the tag record with the given tag_id to have the values of the dict passed in
#
# Returns a tuple:
#   bool: successful - whether or not the database record was successfully updated
#   str: error message - the error message if the update was not successful
#------------------------------------------------------
def modifyTag(tag_id: UUID, tag_dict: dict) -> Tuple[bool, str]:
    # create a new Tag object from the request body data
    new_tag = setupNewTagObject(tag_id, tag_dict)

    # Request must contain name and color fields 
    if not isTagValidForModify(new_tag):
        return (False, ErrorMessages.POST_MISSING_FIELDS)

    # figure out what the color_text value should be, and set it
    new_tag.color_text = getColorTextValue(new_tag.color).value

    # insert it into the database
    sql_result = sql_commands.modify(new_tag)

    if not sql_result.successful:
        return (False, str(sql_result.error))

    return (True, None)

#------------------------------------------------------
# Create a new Tag object from the request body data dict
#------------------------------------------------------
def setupNewTagObject(tag_id: UUID, request_form: dict) -> Tag:
    new_tag = dictToTag(request_form)
    setExistingTagObjectField(new_tag, tag_id)
    return new_tag

#------------------------------------------------------
# Parse the given dictionary into a Tag object
#------------------------------------------------------
def dictToTag(tag_dict: dict) -> Tag:
    return Tag(
        name  = tag_dict.get('name') or None,
        color = tag_dict.get('color') or None,
    )

#------------------------------------------------------
# Set the given Tag object's property values to client id, created_on and the given tag_id
#------------------------------------------------------
def setExistingTagObjectField(new_tag: Tag, tag_id: UUID):
    new_tag.id         = tag_id
    new_tag.created_on = datetime.now()
    new_tag.user_id    = flask.g.client_id


#------------------------------------------------------
# Request must contain name and color fields 
#------------------------------------------------------
def isTagValidForModify(tag: Tag) -> bool:
    if None in [tag.name, tag.color]:
        return False
    else:
        return True

#------------------------------------------------------
# Determine the color_text value of a tag, given its color
#
# Args:
#   tag_color - the tag's color as a hex string
#------------------------------------------------------
def getColorTextValue(tag_color: str) -> TextColors:
    # default to black
    text_color = TextColors.BLACK

    try:
        pycolor = Color(tag_color)
        hue, saturation, luminance = pycolor.get_hsl()

        if luminance < .5:
            text_color = TextColors.WHITE

    except Exception as e:
        print(e)

    return text_color


#------------------------------------------------------
# Respond to a get request for a single tag
#------------------------------------------------------
def responseGetSingleTag(tag_id: UUID) -> flask.Response:
    # fetch the tag record from the database
    sql_result = sql_commands.selectSingle(tag_id)

    # sql error
    if not sql_result.successful:
        return responses.badRequest(str(sql_result.error))

    # either the tag DNE or the client does not own the tag
    if not sql_result.data:
        return responses.forbidden()

    return responses.get(sql_result.data)

#------------------------------------------------------
# Respond to a delete request for a single tag
#------------------------------------------------------
def responseDeleteTag(tag_id: UUID) -> flask.Response:
    # delete the record from the database
    sql_result = sql_commands.delete(tag_id)

    # make sure the sql command was correct
    if not sql_result.successful:
        return responses.badRequest(str(sql_result.error))

    # if the returned data is not 1 then one of these cases is true:
    #   - the client does not own the tag 
    #   - tag does not exist
    if sql_result.data != 1:
        return responses.forbidden()

    # all good, tag successfully deleted 
    return responses.deleted()


