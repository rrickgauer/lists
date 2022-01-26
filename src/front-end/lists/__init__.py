import flask
from . import routes
from lists_common import config


# Set the custom config object
def setConfigObject(flask_app: flask.Flask):
    if flask_app.env == "development":
        flask_app.config.from_object(config.Base)
    else:
        flask_app.config.from_object(config.Production)

#------------------------------------------------------
# Sets up and initializes the flask application
#
# Args:
#   flaskApp (obj): the flask application
#------------------------------------------------------
def initApp(flask_app: flask.Flask):    
    flask_app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
    flask_app.config['JSON_SORT_KEYS'] = False               # don't sort the json keys
    flask_app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False  # print the json pretty

#------------------------------------------------------
# Register all of the Flask blueprints
#------------------------------------------------------
def registerBlueprints(flask_app: flask.Flask):
    flask_app.register_blueprint(routes.home.bp_home, url_prefix='/')
    flask_app.register_blueprint(routes.login.bp_login, url_prefix='/login')
    flask_app.register_blueprint(routes.api.bp_api, url_prefix='/api')

app = flask.Flask(__name__)

setConfigObject(app)
initApp(app)
registerBlueprints(app)