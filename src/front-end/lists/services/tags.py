from __future__ import annotations
import requests
from enum import Enum
import flask
from colour import Color
import flaskforward
from .. import api_wrapper


# Bootstrap text color classes
class TextColors(str, Enum):
    WHITE = 'text-light'
    BLACK = 'text-black'

#------------------------------------------------------
# Generate the tags collection for the home page payload
#------------------------------------------------------
def getTagsHomePagePayload() -> list[dict]:
    
    # fetch the tags from the api
    try:
        tags = getAllTags().json()
    except Exception as e:
        print(e)
        tags = []
    
    return tags


#------------------------------------------------------
# Fetch all the user's tags from the api
#------------------------------------------------------
def getAllTags() -> requests.Response:
    body = flaskforward.structs.SingleRequest(
        url    = f'{api_wrapper.base_wrapper.URL_BASE}{api_wrapper.ApiUrls.TAGS}',
        auth   = (flask.g.email, flask.g.password),
        method = 'GET',
    )

    return flaskforward.routines.sendRequest(body)


#------------------------------------------------------
# Calculate the tag text color for all the given tags
#------------------------------------------------------
def calculateTextColors(tags: list[dict]) -> list[dict]:
    for tag in tags:
        tag_color = tag.get('color')
        tag['text_color'] = _getTextColor(tag_color).value

#------------------------------------------------------
# If tag color's luminance is > .5 ---> text color = white
# Otherwise ---> text color = black
#------------------------------------------------------
def _getTextColor(tag_color: str) -> TextColors:
    pycolor = Color(tag_color)

    hue, saturation, luminance = pycolor.get_hsl()

    if luminance > .5:
        return TextColors.BLACK
    else:
        return TextColors.WHITE
    
