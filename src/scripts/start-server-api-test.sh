
IP_ADDRESS='104.225.208.163'

echo 'Starting up API TESTING server...'

cd /var/www/lists/api

mod_wsgi-express start-server \
--user www-data  \
--group www-data  \
--server-name api.lists.ryanrickgauer.com  \
--port 3000   \
--access-log  \
--log-level info   \
--host $IP_ADDRESS \
--log-to-terminal \
api_lists.wsgi
