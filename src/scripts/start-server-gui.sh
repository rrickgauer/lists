echo 'Starting up front-end server...'

cd /var/www/lists/front-end

mod_wsgi-express setup-server \
--user www-data  \
--group www-data  \
--server-name lists.ryanrickgauer.com  \
--port 3001   \
--access-log  \
--log-level info   \
--server-root /etc/lists.ryanrickgauer.com \
--host 104.225.208.116 \
--setup-only \
--document-root /var/www/lists/front-end/lists/static \
lists.wsgi

# restart the server
/etc/lists.ryanrickgauer.com/apachectl restart
