let restify = require('restify');
let bunyan = require('bunyan');
let _ = require('lodash');

let server = restify.createServer();
server.use(restify.plugins.gzipResponse());
server.use(restify.plugins.requestLogger());

server.use((req, res, next) => {
  res.charSet('utf-8');
  next();
})

let log = bunyan.createLogger({
  name: 'sinluz'
});

server.on('after', restify.plugins.auditLogger({
  log: log,
  event: 'after'
}));

let models = require('../models');

server.get('/cortes/activos', (req, res, next) => {

  models.Corte.findAll({
    include: [{
      model: models.Estado
    }],
    where: {
      finishedAt: null
    },
    group: [models.Corte.rawAttributes.id],
    having: models.sequelize.fn('max', models.sequelize.col('Estados.updatedAt'))
  })
    .then((r) => { res.send(r) })
    .catch((r) => { res.send(r) })
    .finally(() => { next() });

});

server.get('/ciudades', (req, res, next) => {

  models.Ciudad.findAll()
    .then((r) => { res.send(r) })
    .catch((r) => { res.send(r) })
    .finally(() => { next() });

});

server.listen(process.env.PORT || 3000, function () {
  console.log('%s listening at %s', server.name, server.url);
});