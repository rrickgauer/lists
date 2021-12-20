from __future__ import annotations
from uuid import UUID
import requests
import flask
from .base_wrapper import ApiWrapperBase, ApiUrls, RequestParms


class ApiWrapperItems(ApiWrapperBase):
    URL = ApiUrls.ITEMS     #/lists

    #------------------------------------------------------
    # Get items
    #------------------------------------------------------
    def get(self, query_parms=None) -> requests.Response:
        request_parms = RequestParms(url=self.URL, query_parms=query_parms)
        return self._get(request_parms)





