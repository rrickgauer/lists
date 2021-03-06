import requests
from .base_wrapper import ApiWrapperBase, ApiUrls, RequestParms


class ApiWrapperUsers(ApiWrapperBase):
    URL = ApiUrls.USERS

    #------------------------------------------------------
    # Send POST /users request to the API
    #------------------------------------------------------
    def post(self, new_user_data: dict) -> requests.Response:
        request_parms = RequestParms(
            url = self.URL,
            data = new_user_data
        )

        return self._post(request_parms)

    #------------------------------------------------------
    # Get the client's information
    #------------------------------------------------------
    def get(self) -> requests.Response:
        parms = RequestParms(url=self.URL)
        return self._get(parms)

