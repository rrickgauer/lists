import flask
from lists_common import config
from . import routes, db_manager
from .common import CustomJSONEncoder


#------------------------------------------------------
# Sets up the custom configuration values
#
# Args:
#   flaskApp (obj): the flask application
#------------------------------------------------------
def setApplicationConfiguration(flask_app: flask.Flask):    
    if flask_app.env == "production":
        flask_app.config.from_object(config.Production)
    else:
        flask_app.config.from_object(config.Dev)

#------------------------------------------------------
# Set the values of some constants needed for the application
#------------------------------------------------------
def setConfigValues(flask_app: flask.Flask):
    db_manager.credentials.DATABASE = flask_app.config.get('DB_NAME')


#------------------------------------------------------
# Register all of the Flask blueprints
#------------------------------------------------------
def registerBlueprints(flask_app: flask.Flask):
    flask_app.register_blueprint(routes.users.bp_users, url_prefix='/users')
    flask_app.register_blueprint(routes.lists.bp_lists, url_prefix='/lists')
    flask_app.register_blueprint(routes.list_tags.bp_list_tags, url_prefix='/lists/<uuid:list_id>/tags')
    flask_app.register_blueprint(routes.items.bp_items, url_prefix='/items')
    flask_app.register_blueprint(routes.tags.bp_tags, url_prefix='/tags')


app = flask.Flask(__name__)

setApplicationConfiguration(app)
setConfigValues(app)

app.json_encoder = CustomJSONEncoder
registerBlueprints(app)


