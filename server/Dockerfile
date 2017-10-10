FROM node:8.6-alpine

ENV NODE_ENV="production" \
  DB_FILE="/var/sinluz/db.sqlite" \
  CRON_SCRAPE_SCHEDULE=""

COPY . /usr/src/sinluz

WORKDIR /usr/src/sinluz

RUN apk add supervisor --no-cache --update \
  && cp docker/docker-cmd.sh /usr/bin/ \
  && cp docker/supervisord.conf /etc/supervisord.conf \
  && chmod +x /usr/bin/docker-cmd.sh \
  && mkdir -p /var/sinluz \
  && touch /var/log/output.log \
  && yarn install \
  && chmod +x ./node_modules/.bin/sequelize

CMD ["docker-cmd.sh"]