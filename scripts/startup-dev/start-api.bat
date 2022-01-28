:: Start up the API dev server

cd C:\xampp\htdocs\files\lists\src\api

set FLASK_ENV=development
set FLASK_APP=api_lists

flask run --with-threads --host 0.0.0.0 --port 6000
