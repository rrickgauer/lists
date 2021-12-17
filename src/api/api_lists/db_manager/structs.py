"""
**********************************************************************************

Some database structures/models used throughout the application.

**********************************************************************************
"""

from dataclasses import dataclass

#----------------------------------------------------------
# This class is used when a function executes a database 
# command.
# 
# It is a way to standardize the return result of an sql 
# operation.
#----------------------------------------------------------
@dataclass
class DbOperationResult:
    successful: bool = False
    data = None
    error: str = None






