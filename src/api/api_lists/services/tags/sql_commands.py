

from uuid import UUID
import flask
import pymysql.commands
from pymysql.structs import DbOperationResult
from ...models import Tag
from . import sql_statements

#------------------------------------------------------
# Get all the user's tags from the database
#------------------------------------------------------
def selectAll() -> DbOperationResult:
    sql = sql_statements.SELECT_ALL
    parms = (str(flask.g.client_id), )

    return pymysql.commands.selectAll(sql, parms)



#------------------------------------------------------
# Sql command to create a new tag or update an existing one
#------------------------------------------------------
def modify(tag: Tag) -> DbOperationResult:
    parms = _getModifyParmsTuple(tag)
    return pymysql.commands.modify(sql_statements.INSERT_UPDATE, parms)

#------------------------------------------------------
# Transform the given Tag object into the required tuple for inserting/updating sql command
#------------------------------------------------------
def _getModifyParmsTuple(tag: Tag) -> tuple:
    return (
        str(tag.id),
        tag.name,
        tag.color,
        tag.created_on,
        str(tag.user_id)
    )


#------------------------------------------------------
# Fetch the tag record that has the given tag_id
#------------------------------------------------------
def cmdSelectSingle(tag_id: UUID) -> DbOperationResult:
    sql = sql_statements.SELECT_SINGLE
    parms = (
        str(flask.g.client_id),
        str(tag_id),
    )

    return pymysql.commands.select(sql, parms)




#------------------------------------------------------
# Delete the tag record with the matching tag_id
#------------------------------------------------------
def cmdDeleteSingle(tag_id: UUID) -> DbOperationResult:
    sql = sql_statements.DELETE_SINGLE

    parms = (
        str(tag_id),
        str(flask.g.client_id)
    )

    return pymysql.commands.modify(sql, parms)