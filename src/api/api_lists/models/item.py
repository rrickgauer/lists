"""
**********************************************************************************
List model
**********************************************************************************
"""
from enum import Enum
from dataclasses import dataclass
from uuid import UUID
from datetime import datetime



class ItemComplete(str, Enum):
    NO  = "n"
    YES = "y"
    

@dataclass
class Item:
    id          : UUID         = None         
    list_id     : UUID         = None         
    content     : str          = None         
    rank        : int          = None         
    complete    : ItemComplete = ItemComplete.NO
    created_on  : datetime     = None
    modified_on : datetime     = None
