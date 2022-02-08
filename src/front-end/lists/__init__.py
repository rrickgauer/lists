import flask
from lists_common import config
from . import routes
from . import api_wrapper


#------------------------------------------------------
# Sets up and initializes the flask application configuration
#
# Args:
#   flaskApp (obj): the flask application
#------------------------------------------------------
def configureApplication(flask_app: flask.Flask):
    if flask_app.env == "production":
        flask_app.config.from_object(config.Production)
    else:
        flask_app.config.from_object(config.Dev)


    api_wrapper.base_wrapper.URL_BASE = flask_app.config.get('URL_API')


#------------------------------------------------------
# Register all of the Flask blueprints
#------------------------------------------------------
def registerBlueprints(flask_app: flask.Flask):
    flask_app.register_blueprint(routes.home.bp_home, url_prefix='/')
    flask_app.register_blueprint(routes.login.bp_login, url_prefix='/login')
    flask_app.register_blueprint(routes.api.bp_api, url_prefix='/api')
    flask_app.register_blueprint(routes.tags.bp_tags, url_prefix='/tags')



app = flask.Flask(__name__)

configureApplication(app)
registerBlueprints(app)