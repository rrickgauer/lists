from __future__ import annotations
from uuid import UUID
import requests
import flask
from .base_wrapper import ApiWrapperBase, ApiUrls, RequestParms


class ApiWrapperItems(ApiWrapperBase):
    URL = ApiUrls.ITEMS     # /items

    #------------------------------------------------------
    # Get items
    #------------------------------------------------------
    def get(self, flask_request: flask.Request) -> requests.Response:
        request_parms = self._generateRequestParms(self.URL, flask_request)
        return self._get(request_parms)


    #------------------------------------------------------
    # Update an item
    #------------------------------------------------------
    def put(self, flask_request: flask.Request, item_id: UUID) -> requests.Response:
        url           = f'{self.URL}/{item_id}'
        request_parms = self._generateRequestParms(url, flask_request)

        return self._put(request_parms)

    #------------------------------------------------------
    # Send a delete request
    #------------------------------------------------------
    def delete(self, flask_request: flask.Request, item_id: UUID) -> requests.Response:
        url = f'{self.URL}/{item_id}'
        parms = self._generateRequestParms(url, flask_request)

        return self._delete(parms)


class ApiWrapperItemComplete(ApiWrapperBase):
    URL = f'{ApiUrls.ITEMS}/{{}}/complete'      # items/:item_id/complete

    #------------------------------------------------------
    # Mark an item complete
    #------------------------------------------------------
    def put(self, item_id: UUID) -> requests.Response:
        return self._response(item_id, self._put)


    #------------------------------------------------------
    # Mark an item incomplete
    #------------------------------------------------------
    def delete(self, item_id: UUID) -> requests.Response:
        return self._response(item_id, self._delete)

    
    def _response(self, item_id: UUID, response_fn) -> requests.Response:
        url = self.URL.format(str(item_id))
        request_parms = RequestParms(url)

        return response_fn(request_parms)
