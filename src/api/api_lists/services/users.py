"""
**********************************************************************************

This module contains all the business logic for user services.

**********************************************************************************
"""

from uuid import UUID, uuid4
import flask
from ..models import User
import pymysql.commands
from pymysql.structs import DbOperationResult
from ..common import responses


#------------------------------------------------------
# Response to a POST request for a single user
#------------------------------------------------------
def responsePost(request_body: dict) -> flask.Response:
    # create a new object from the values provided in the request body
    new_user = _getNewUserModel(request_body)

    # verify that both the email and password fields are set
    if not _areEmailPasswordFieldsSet(new_user):
        return responses.badRequest('Missing a required field: email or password')
    
    # assign a new uuid to the user
    new_user.id = uuid4()

    # insert the user into the database
    insert_result = _insertIntoDatabase(new_user)
    
    if not insert_result.successful:
        return responses.badRequest(insert_result.error)

    # return the newly created user object
    return responses.created(queryDb(new_user.id).data)

#------------------------------------------------------
# Create a user model object from the given dictionary
#------------------------------------------------------
def _getNewUserModel(request_body: dict) -> User:
    new_user = User(
        email    = request_body.get('email') or None,
        password = request_body.get('password') or None,
    )

    return new_user

#------------------------------------------------------
# Checks if both the email and password properties have
# a value in the given user object.
#
# Returns a bool:
#   true - both fields are set and have a value
#   false - one of the fields does not have a value
#------------------------------------------------------
def _areEmailPasswordFieldsSet(new_user: User) -> bool:
    if None in [new_user.email, new_user.password]:
        return False
    else:
        return True

#------------------------------------------------------
# Inserts the given user model object into the database.
#------------------------------------------------------
def _insertIntoDatabase(new_user: User) -> DbOperationResult:
    sql = 'INSERT INTO Users (id, email, password) VALUES (%s, %s, %s)'
    parms = (str(new_user.id), new_user.email, new_user.password)

    return pymysql.commands.modify(sql, parms)


#------------------------------------------------------
# Response to a GET request for a single user
#------------------------------------------------------
def responseGet(user_id: UUID) -> flask.Response:
    user_db_result = queryDb(user_id)

    if user_db_result.successful:
        return responses.get(user_db_result.data)
    else:
        return responses.notFound()

#------------------------------------------------------
# Retrieve a single user dict from the database
#------------------------------------------------------
def queryDb(user_id: UUID) -> DbOperationResult:
    sql = 'SELECT * FROM View_Users u WHERE u.id = %s LIMIT 1'
    parms = (str(user_id),)

    return pymysql.commands.select(sql, parms)
