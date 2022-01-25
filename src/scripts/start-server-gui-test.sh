echo 'Starting up front-end TESTING server...'

cd /var/www/lists/front-end

mod_wsgi-express start-server \
--user www-data  \
--group www-data  \
--server-name lists.ryanrickgauer.com  \
--port 3001   \
--access-log  \
--log-level info   \
--compress-responses \
--host 104.225.208.116 \
--log-to-terminal \
lists.wsgi
