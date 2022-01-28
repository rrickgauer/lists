:: Start up the GUI dev server

cd C:\xampp\htdocs\files\lists\src\front-end

set FLASK_ENV=development
set FLASK_APP=lists

flask run --with-threads --host 0.0.0.0 --port 6001
