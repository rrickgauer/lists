import requests
from .base_wrapper import ApiWrapperBase, ApiUrls, RequestParms


class ApiWrapperLists(ApiWrapperBase):
    URL = ApiUrls.LISTS     #/lists

    #------------------------------------------------------
    # Get all lists
    #------------------------------------------------------
    def get(self) -> requests.Response:
        request_parms = RequestParms(url=self.URL)
        return self._get(request_parms)

    #------------------------------------------------------
    # Send a posts for lists
    #------------------------------------------------------
    def post(self, form: dict) -> requests.Response:
        request_parms = RequestParms(
            url  = self.URL,
            data = form
        )

        return self._post(request_parms)



