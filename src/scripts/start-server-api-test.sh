echo 'Starting up API TESTING server...'

cd /var/www/lists/api

mod_wsgi-express start-server \
--user www-data  \
--group www-data  \
--server-name api.lists.ryanrickgauer.com  \
--port 3000   \
--access-log  \
--log-level info   \
--host 104.225.208.116 \
--log-to-terminal \
api_lists.wsgi
