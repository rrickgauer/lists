from __future__ import annotations
from uuid import UUID
import requests
import flask
from .base_wrapper import ApiWrapperBase, ApiUrls


class ApiWrapperItems(ApiWrapperBase):
    URL = ApiUrls.ITEMS     # /items

    #------------------------------------------------------
    # Get items
    #------------------------------------------------------
    def get(self, flask_request: flask.Request) -> requests.Response:
        request_parms = self._generateRequestParms(self.URL, flask_request)
        return self._get(request_parms)


    #------------------------------------------------------
    # Get items
    #------------------------------------------------------
    def put(self, flask_request: flask.Request, item_id: UUID) -> requests.Response:
        url           = f'{self.URL}/{item_id}'
        request_parms = self._generateRequestParms(url, flask_request)

        return self._put(request_parms)




