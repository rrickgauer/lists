"""
**********************************************************************************

This module is responsible for 2 things:
    1. Ensuring a given request contains valid data in the body
    2. Parsing the data into a list of Item objects

**********************************************************************************
"""

from __future__ import annotations
from enum import Enum, auto
from uuid import UUID
import flask
from ...models import Item

#------------------------------------------------------
# Set of return codes returned by BatchItemParser.isValid()
#------------------------------------------------------
class ParseReturnCodes(Enum):
    SUCCESS = auto()
    NO_DATA = auto()
    NOT_JSON = auto()
    NOT_LIST = auto()


class BatchItemParserBase:
    """Base parser class"""
    
    #------------------------------------------------------
    # Constructor
    #------------------------------------------------------
    def __init__(self, request: flask.Request):
        self.request = request
        self.items: list[Item] = []
        self._body: list[dict] | list[UUID] = None

    #------------------------------------------------------
    # Print these objects out as a dict
    #------------------------------------------------------
    def __repr__(self) -> str:
        return str(self.__dict__)

    #------------------------------------------------------
    # Make sure the request and incoming are valid
    #------------------------------------------------------
    def isValid(self) -> ParseReturnCodes:
        # make sure the body has data in it
        try:
            self._body = self.request.get_json(silent=True)
        except Exception:
            self._body = None
            return ParseReturnCodes.NO_DATA
        
        # make sure header content type is json
        if not self._body:
            return ParseReturnCodes.NOT_JSON
        
        # top level object must be a list (can contain 1 item)
        if not isinstance(self._body, list):
            return ParseReturnCodes.NOT_LIST

        return ParseReturnCodes.SUCCESS

    #------------------------------------------------------
    # All child classes need to implement this method
    #------------------------------------------------------
    def parseData(self):
        raise NotImplementedError


class BatchItemParserUpdate(BatchItemParserBase):
    """Parser for request body containing list of Item json objects"""
    
    #------------------------------------------------------
    # Transform the incoming json data into a list of Item objects
    #------------------------------------------------------
    def parseData(self):
        self.items.clear()
        
        # transform each json object contained in the body data into an Item model
        for record in self._body:
            item = Item(
                id   = record.get('id'),
                rank = record.get('rank'),
            )

            self.items.append(item)



class BatchItemParserDelete(BatchItemParserBase):
    """Parser for request body containing list of item_ids (UUID's)"""

    #------------------------------------------------------
    # Transform the incoming json data into a list of item ids.
    #------------------------------------------------------
    def parseData(self):
        self.items.clear()
        
        for record in self._body:
            self.items.append(UUID(record))
    