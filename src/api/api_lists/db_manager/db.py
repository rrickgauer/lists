import mysql.connector
from mysql.connector.cursor import MySQLCursor
from . import credentials as db_credentials


class DB:

    #----------------------------------------------------------
    # Constructor
    #----------------------------------------------------------
    def __init__(self):
        self.connection = mysql.connector.MySQLConnection()
    
    #----------------------------------------------------------
    # Connect to the database
    #----------------------------------------------------------
    def connect(self):

        self.connection = mysql.connector.connect(
            user     = db_credentials.USER,
            host     = db_credentials.HOST,
            database = db_credentials.DATABASE,
            password = db_credentials.PASSWORD
        )
    
    #----------------------------------------------------------
    # Close the database connection
    #----------------------------------------------------------
    def close(self):
        self.connection.close()

    #----------------------------------------------------------
    # Commit the current transaction
    #----------------------------------------------------------
    def commit(self):
        self.connection.commit()
        
    #----------------------------------------------------------
    # Get a cursor from the database connection.
    #
    # Args:
    #     a_dbCursorType (DbCursorTypes): Cursor type
    #
    # Returns:
    #     MySQLCursor: The connected mysql cursor.
    #----------------------------------------------------------
    def getCursor(self, asDict: bool=True) -> MySQLCursor:
        cursor = None

        if asDict:
            cursor = self.connection.cursor(dictionary=True)
        else:
            cursor = self.connection.cursor(prepared=True)
        
        return cursor