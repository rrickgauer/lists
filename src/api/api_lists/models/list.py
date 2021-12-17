"""
**********************************************************************************
List model
**********************************************************************************
"""

from dataclasses import dataclass
from uuid import UUID
from datetime import datetime

@dataclass
class List:
    id        : UUID     = None
    user_id   : UUID     = None
    name      : str      = None
    created_on: datetime = None