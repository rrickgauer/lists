from __future__ import annotations
from functools import wraps
import flask
import json

#------------------------------------------------------
# Decorator function that dumps the specified values of
# the current request attributes. Or all of them if no 
# attributes are given
#------------------------------------------------------
def dump_flask_request(*request_attributes: tuple):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs: dict):
            dump_object(flask.request, request_attributes)
            
            return f(*args, **kwargs)
        return wrapper
    return decorator


#------------------------------------------------------
# Output the specified values of the given object to the console
#------------------------------------------------------
def dump_object(obj, attributes=None):
    # if caller does not provide any specific attributes, dump them all
    if not attributes or len(attributes) == 0:
        attrs = dir(obj) # dump all the attributes
    else:
        attrs = attributes

    out_dir = dict()

    for a in attrs:
        val = getattr(obj, a)

        try:
            json.dumps(val)
            out_dir[a] = val
        except:
            out_dir[a] = str(val)


    print(json.dumps(out_dir, indent=4))