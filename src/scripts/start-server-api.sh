echo 'Starting up API server...'

cd /var/www/lists/api

mod_wsgi-express setup-server \
--user www-data  \
--group www-data  \
--server-name api.lists.ryanrickgauer.com  \
--port 3000   \
--access-log  \
--log-level info   \
--server-root /etc/api.lists.ryanrickgauer.com \
--host 104.225.208.116 \
--setup-only \
api_lists.wsgi

# restart the server
/etc/api.lists.ryanrickgauer.com/apachectl restart
