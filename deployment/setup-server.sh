mod_wsgi-express setup-server \
--user www-data  \
--group www-data  \
--server-name api.wmiys.com  \
--port 81   \
--access-log  \
--log-level info   \
--compress-responses \
--server-root /etc/api.wmiys.com \
--host 104.225.208.116 \
--document-root /var/www/wmiys/api/api_wmiys/static \
--setup-only \
/var/www/wmiys/api/api_wmiys.wsgi

# restart the server
/etc/api.wmiys.com/apachectl restart
