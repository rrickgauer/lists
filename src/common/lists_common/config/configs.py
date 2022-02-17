

#------------------------------------------------------
# The base config class
#------------------------------------------------------
class Base:
    # built in flask keys
    JSON_SORT_KEYS              = False   # don't sort the json keys
    JSONIFY_PRETTYPRINT_REGULAR = False   # print the json pretty
    SECRET_KEY = b'_5#y2L"F4Q8z\n\xec]/'
    
    # custom keys
    URL_API = 'https://api.lists.ryanrickgauer.com/'
    URL_GUI = 'https://lists.ryanrickgauer.com/'
    DB_NAME = 'Lists'
    DB_HOST = 'localhost'
    


#------------------------------------------------------
# The production config is the default, 
# It inherits all the values from the base
#------------------------------------------------------
class Production(Base):
    pass

#------------------------------------------------------
# Provide any overrides needed for development
#------------------------------------------------------
class Dev(Base):
    URL_API = 'http://10.0.0.82:6000/'
    URL_GUI = 'http://10.0.0.82:6001/'
    DB_NAME = 'Lists_Dev'
    DB_HOST = '104.225.208.163'
 


