
from dataclasses import dataclass
import requests
from enum import Enum

#------------------------------------------------------
# Prefix for the api url
#------------------------------------------------------
# URL_BASE = config_pairs.ApiUrls.PRODUCTION
URL_BASE = 'http://10.0.0.82:6000/'


#------------------------------------------------------
# All the suffixes for the api urls
#------------------------------------------------------
class ApiUrls(str, Enum):
    USERS = 'users'
    LISTS = 'lists'
    ITEMS = 'items'

    

#------------------------------------------------------
# The custom header we are going to send to the api.
# 
# We do this so that the api knows this request is coming 
# from the front-end, and not a third party.
#------------------------------------------------------
CUSTOM_HEADER = {
    'x-client-key': 'd6a81405-5eb9-11ec-83e4-36b9fdc8f368'
}


#------------------------------------------------------
# Class to hold the parms for api requests
#------------------------------------------------------
@dataclass
class RequestParms:
    url         : str  = None
    query_parms: dict  = None
    data        : dict = None
    files       : dict = None

#------------------------------------------------------
# Abstract ApiWrapper class
#
# Abstract class defining ApiWrapper with required methods.
#------------------------------------------------------
class IApiWrapper:
    def get(self) -> requests.Response:
        raise NotImplementedError
    
    def post(self) -> requests.Response:
        raise NotImplementedError
    
    def put(self) -> requests.Response:
        raise NotImplementedError
    
    def delete(self) -> requests.Response:
        raise NotImplementedError


#------------------------------------------------------
# Base ApiWrapper class
#
# ALl ApiWrapperXXX classes need to inherit from this
# base class.
#------------------------------------------------------
class ApiWrapperBase(IApiWrapper):

    #------------------------------------------------------
    # Constructor
    #
    # Args:
    #   flask_g: the global flask object (g)
    #------------------------------------------------------
    def __init__(self, flask_g=None, user_id: int=None, email: str=None, password: str=None):
        self.user_id  = getattr(flask_g, 'user_id', user_id)
        self.email    = getattr(flask_g, 'email', email)
        self.password = getattr(flask_g, 'password', password)

    #------------------------------------------------------
    # Send a GET request
    #------------------------------------------------------
    def _get(self, request_parms: RequestParms) -> requests.Response:
        return self._baseRequest(requests.get, request_parms)
    
    #------------------------------------------------------
    # Send a POST request
    #------------------------------------------------------
    def _post(self, request_parms: RequestParms) -> requests.Response:
        return self._baseRequest(requests.post, request_parms)

    #------------------------------------------------------
    # Send a PUT request
    #------------------------------------------------------
    def _put(self, request_parms: RequestParms) -> requests.Response:
        return self._baseRequest(requests.put, request_parms)

    #------------------------------------------------------
    # Send a DELETE request
    #------------------------------------------------------
    def _delete(self, request_parms: RequestParms) -> requests.Response:
        return self._baseRequest(requests.delete, request_parms)
    
    #------------------------------------------------------
    # Base request method for all others to use.
    #------------------------------------------------------
    def _baseRequest(self, request_method, request_parms: RequestParms) -> requests.Response:
        api_url = f'{URL_BASE}{request_parms.url}'

        return request_method(
            url     = api_url,
            auth    = (self.email, self.password),
            headers = CUSTOM_HEADER,
            data    = request_parms.data,
            params  = request_parms.query_parms,
            files   = request_parms.files
        )



#------------------------------------------------------
# Create a new client account
#------------------------------------------------------
def createAccount(new_user_form_data: dict) -> requests.Response:
    return requests.post(
        url     = f'{URL_BASE}{ApiUrls.USERS}',
        data    = new_user_form_data,
        headers = CUSTOM_HEADER
    )