:: Open tables output
start C:\xampp\htdocs\files\lists\scripts\open-tables.bat


:: Startup the dev servers
cd C:\xampp\htdocs\files\lists\scripts\startup-dev
wt -M start-api.bat ; start-gui.bat ; start-css.bat ; start-js.bat