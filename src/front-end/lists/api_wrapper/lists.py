from uuid import UUID
import requests
import flask
from .base_wrapper import ApiWrapperBase, ApiUrls, RequestParms


class ApiWrapperLists(ApiWrapperBase):
    URL = ApiUrls.LISTS     #/lists

    #------------------------------------------------------
    # Get all lists
    #------------------------------------------------------
    def get(self, list_id: UUID=None) -> requests.Response:
        url = self._getUrlGET(list_id)
        request_parms = RequestParms(url)
        
        return self._get(request_parms)


    def _getUrlGET(self, list_id: UUID=None) -> str:
        if not list_id:
            return self.URL
        else:
            return f'{self.URL}/{str(list_id)}'
    

    #------------------------------------------------------
    # Send a posts for lists
    #------------------------------------------------------
    def post(self, form: dict) -> requests.Response:
        request_parms = RequestParms(
            url  = self.URL,
            data = form
        )

        return self._post(request_parms)

    
    #------------------------------------------------------
    # Send put request
    #------------------------------------------------------
    def put(self, flask_request: flask.Request, list_id: UUID) -> requests.Response:
        url = f'{self.URL}/{str(list_id)}'
        parms = self._generateRequestParms(url, flask_request)

        return self._put(parms)

    #------------------------------------------------------
    # Send delete request
    #------------------------------------------------------
    def delete(self, flask_request: flask.Request, list_id: UUID) -> requests.Response:
        url = f'{self.URL}/{str(list_id)}'
        parms = self._generateRequestParms(url, flask_request)

        return self._delete(parms)



