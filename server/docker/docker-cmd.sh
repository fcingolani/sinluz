#!/bin/sh

env > /etc/environment

cd /usr/src/sinluz
npm run db:migrate

if [ -z "$CRON_SCRAPE_SCHEDULE" ]
then

echo "" > /var/spool/cron/crontabs/root

else

cat << EOF > /var/spool/cron/crontabs/root
# :)
#
#
$CRON_SCRAPE_SCHEDULE cd /usr/src/sinluz && npm run scrape #>>
EOF

fi

supervisord