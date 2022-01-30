from __future__ import annotations
from enum import Enum


# Icons for list types - Boxicons
class ListTypeIcons(str, Enum):
    LIST     = 'bx-list-check'
    TEMPLATE = 'bx-copy-alt'


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

    return dict(lists=lists_api_response)