#************************************************************************************
# Name:     CustomJSONEncoder
#
# Purpose:  This class is used to encode date's in the correct format: YYYY-MM-DD. 
#
#           Before creating this, Flask was encoding all dates/datetimes/times as 'Mon, 15 Mar 2021 18:30:42 GMT'.
#           This was done to fields that were only dates.
#
#           The solution was found: https://www.javaer101.com/en/article/1732830.html
#************************************************************************************
from flask.json import JSONEncoder
from datetime import date
from decimal import Decimal

class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        try:
            if isinstance(obj, date):
                return obj.isoformat()
            elif isinstance(obj, Decimal):
                return float(obj)
            iterable = iter(obj)
        except TypeError:
            pass
        else:
            return list(iterable)

        return JSONEncoder.default(self, obj)