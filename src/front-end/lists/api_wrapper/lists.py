from uuid import UUID
import requests
import flask
from .base_wrapper import ApiWrapperBase, ApiUrls, RequestParms

#------------------------------------------------------
# Helper function to call the api to get all list types owned by the user
#------------------------------------------------------
def getAllTypeLists(flask_g) -> requests.Response:
    api = ApiWrapperLists(flask_g)

    list_type = dict(
        type = 'list'
    )

    response = api.get(list_type=list_type)

    return response



class ApiWrapperLists(ApiWrapperBase):
    URL = ApiUrls.LISTS     #/lists

    #------------------------------------------------------
    # Get all lists
    #------------------------------------------------------
    def get(self, list_id: UUID=None, list_type: dict=None) -> requests.Response:
        request_parms = RequestParms(
            url         = self._getUrlGET(list_id),
            query_parms = list_type
        )
        
        return self._get(request_parms)

    #------------------------------------------------------
    # Generate the url for the api
    #------------------------------------------------------
    def _getUrlGET(self, list_id: UUID=None) -> str:
        if not list_id:
            url = self.URL
        else:
            url = f'{self.URL}/{str(list_id)}'

        return url
    

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



