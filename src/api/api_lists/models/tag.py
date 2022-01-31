"""
**********************************************************************************
Tag model
**********************************************************************************
"""

from dataclasses import dataclass
from uuid import UUID
from datetime import datetime

@dataclass
class Tag:
    id         : UUID    = None
    name       : str     = None
    color      : str     = None
    created_on: datetime = None
    user_id    : UUID    = None






