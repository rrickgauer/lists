"""
**********************************************************************************
List model
**********************************************************************************
"""

from enum import Enum
from dataclasses import dataclass
from uuid import UUID
from datetime import datetime


class ListType(str, Enum):
    LIST    : str = 'list'
    TEMPLATE: str = 'template'

    @classmethod
    def _missing_(cls, value):
        return ListType.LIST


@dataclass
class List:
    id         : UUID    = None
    user_id    : UUID    = None
    name       : str     = None
    created_on: datetime = None
    type      : ListType = ListType.LIST