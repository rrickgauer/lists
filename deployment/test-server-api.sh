mod_wsgi-express start-server \
--user www-data  \
--group www-data  \
--server-name api.lists.ryanrickgauer.com  \
--port 3000   \
--access-log  \
--log-level info   \
--compress-responses \
--server-root /etc/api.lists.ryanrickgauer.com \
--host 104.225.208.116 \
--log-to-terminal \
/var/www/lists/api/api_lists.wsgi 

