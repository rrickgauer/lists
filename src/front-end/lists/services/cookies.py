from __future__ import annotations
from datetime import datetime, timedelta
import flask

#------------------------------------------------------
# Get the datetime that occurs the given number of days in the future (or past if num_days is negative)
#------------------------------------------------------
def getFutureDate(num_days: int=1, start_date: datetime=datetime.now()) -> datetime:
    return start_date + timedelta(days=num_days)


class ResponseCookie:

    #------------------------------------------------------
    # Constructor
    #------------------------------------------------------
    def __init__(self, response: flask.Response, key: str, value: str=None):
        self.response = response
        self.key      = key
        self.value    = value
    #------------------------------------------------------
    # Save the cookie for the specified number of days
    #------------------------------------------------------
    def save(self, num_days: int) -> datetime:
        expiration_date = getFutureDate(num_days, datetime.now())
        self._setResponseCookie(expiration_date)
        
        return expiration_date
    #------------------------------------------------------
    # Remove the cookie
    #------------------------------------------------------
    def remove(self) -> datetime:
        self.value = ''
        expiration_date = getFutureDate(-1, datetime.now())
        self._setResponseCookie(expiration_date)

        return expiration_date
    
    #------------------------------------------------------
    # Save the cookie and its expiration date to the datetime provided
    #------------------------------------------------------
    def _setResponseCookie(self, expires: datetime):
        self.response.set_cookie(
            key     = self.key,
            value   = self.value,
            expires = expires
        )

        return expires







