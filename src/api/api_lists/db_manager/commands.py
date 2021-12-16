from .structs import DbOperationResult as DbOperationResult
from .db import DB
import json

#------------------------------------------------------
# Execute a select statement for a single record
#
# Args:
#   sql_stmt: sql statement to execute
#   parms: sql parms to pass to the engine
#------------------------------------------------------
def selectSingle(sql_stmt: str, parms: tuple=None) -> DbOperationResult:
    return _selectAny(True, sql_stmt, parms)


#------------------------------------------------------
# Execute a select statement for mulitple records
#
# Args:
#   sql_stmt: sql statement to execute
#   parms: sql parms to pass to the engine
#------------------------------------------------------
def selectMultiple(sql_stmt: str, parms: tuple=None) -> DbOperationResult:
    return _selectAny(False, sql_stmt, parms)

#------------------------------------------------------
# Execute a select statement for mulitple records
#
# Args:
#   sql_stmt: sql statement to execute
#   parms: sql parms to pass to the engine
#------------------------------------------------------
def _selectAny(fetch_one: bool, sql_stmt: str, parms: tuple=None) -> DbOperationResult:
    db_result = DbOperationResult(successful=False)
    db = DB()

    try:
        db.connect()
        cursor = db.getCursor(True)
        cursor.execute(sql_stmt, parms)

        if fetch_one:
            db_result.data = cursor.fetchone()
        else:
            db_result.data = cursor.fetchall()

        db_result.successful = True

    except Exception as e:
        db_result.error = str(e)
    finally:
        db.close()
    
    return db_result


#------------------------------------------------------
# Execute an insert, update, or delete sql command
#
# Args:
#   sql_stmt: sql statement to execute
#   parms: sql parms to pass to the engine
#
# Returns a DbOperationResult:
#   sets the data field to the row count
#------------------------------------------------------
def modifyCmd(sql_stmt: str, parms: tuple=None) -> DbOperationResult:
    db_result = DbOperationResult(successful=False)
    db = DB()

    try:
        db.connect()
        cursor = db.getCursor(False)
        
        cursor.execute(sql_stmt, parms)
        db.commit()
        
        db_result.successful = True
        db_result.data = cursor.rowcount
    except Exception as e:

        
        print(json.dumps((e.msg, e.errno, e.sqlstate), indent=4))

        db_result.error = str(e)
    finally:
        db.close()
    
    return db_result