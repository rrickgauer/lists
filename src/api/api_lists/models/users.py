"""
**********************************************************************************

User model

**********************************************************************************
"""

from dataclasses import dataclass
from uuid import UUID
from datetime import datetime

@dataclass
class User:
    id        : UUID     = None
    email     : str      = None
    password  : str      = None
    created_on: datetime = None




