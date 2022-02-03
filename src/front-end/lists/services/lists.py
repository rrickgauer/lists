from __future__ import annotations
from enum import Enum
import flask
from ..api_wrapper import lists as api_wrapper_lists


# Icons for list types - Boxicons
class ListTypeIcons(str, Enum):
    LIST     = 'bx-list-check'
    TEMPLATE = 'bx-copy-alt'



def getUserListsCollectionPayload() -> list[dict]:
    # fetch the user's lists
    try:
        response = api_wrapper_lists.getAllLists(flask.g)
        lists_collection = response.json()
    except Exception as e:
        print(e)
        lists_collection = []   # empty response body

    # generate the icons
    assignListTypeIcons(lists_collection)

    return lists_collection



#------------------------------------------------------
# transform the given List collection into the payload for jinja to render
#------------------------------------------------------
def assignListTypeIcons(lists_api_response: list[dict]):
    # set the type icon for each list
    for list_record in lists_api_response:
        list_type = list_record.get('type')

        if list_type == 'list':
            list_record.setdefault('type_icon', ListTypeIcons.LIST.value)
        else:
            list_record.setdefault('type_icon', ListTypeIcons.TEMPLATE.value)