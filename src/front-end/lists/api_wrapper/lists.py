import requests
from .base_wrapper import ApiWrapperBase, ApiUrls, RequestParms


class ApiWrapperLists(ApiWrapperBase):
    URL = ApiUrls.LISTS

    #------------------------------------------------------
    # Get the client's information
    #------------------------------------------------------
    def get(self) -> requests.Response:
        parms = RequestParms(url=self.URL)
        return self._get(parms)

