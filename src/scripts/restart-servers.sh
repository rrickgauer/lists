#!/bin/bash

IP_ADDRESS='104.225.208.163'

#---------------------------------------
# Start up the API
#---------------------------------------
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
--host $IP_ADDRESS \
--setup-only \
api_lists.wsgi

# restart the server
/etc/api.lists.ryanrickgauer.com/apachectl restart


echo ''


#---------------------------------------
# Start up the gui
#---------------------------------------

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
--host $IP_ADDRESS \
--setup-only \
--document-root /var/www/lists/front-end/lists/static \
lists.wsgi

# restart the server
/etc/lists.ryanrickgauer.com/apachectl restart


