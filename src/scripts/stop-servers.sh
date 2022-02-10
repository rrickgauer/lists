# This script stops both list servers that are running in the background.

echo 'Stopping api...'
/etc/api.lists.ryanrickgauer.com/apachectl stop

echo 'Stopping gui...'
/etc/lists.ryanrickgauer.com/apachectl stop