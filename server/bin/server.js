require('dotenv').config()

let restify = require('restify');
let bunyan = require('bunyan');
let moment = require('moment');
let _ = require('lodash');

let server = restify.createServer();
server.use(restify.plugins.gzipResponse());
server.use(restify.plugins.requestLogger());

server.use((req, res, next) => {
  res.charSet('utf-8');
  next();
})

const corsMiddleware = require('restify-cors-middleware')

if (process.env.CORS_ORIGINS) {
  const cors = corsMiddleware({
    preflightMaxAge: 5,
    origins: process.env.CORS_ORIGINS.split(','),
  });

  server.pre(cors.preflight);
  server.use(cors.actual);
}

let log = bunyan.createLogger({
  name: 'sinluz'
});

server.on('after', restify.plugins.auditLogger({
  log: log,
  event: 'after'
}));

let models = require('../models');

server.get('/cortes/_/activos', (req, res, next) => {

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

server.get('/cortes/_/ts/:timestamp', (req, res, next) => {

  models.Corte.findAll({
    include: [{
      model: models.Estado
    }],
    where: {
      startedAt: { $lte: req.params.timestamp },
      finishedAt: { $or: { $eq: null, $gt: req.params.timestamp } }
    },
    group: [models.Corte.rawAttributes.id],
    having: models.sequelize.fn('max', models.sequelize.col('Estados.updatedAt'))
  })
    .then((r) => { res.send(r) })
    .catch((r) => { res.send(r) })
    .finally(() => { next() });

});



/*
server.get('/ciudades', (req, res, next) => {

  models.Ciudad.findAll()
    .then((r) => { res.send(r) })
    .catch((r) => { res.send(r) })
    .finally(() => { next() });

});
*/

server.get('/ciudades/:partido/:localidad', (req, res, next) => {

  models.Ciudad.findOne({
    where: {
      id: `${req.params.partido}/${req.params.localidad}`,
    }
  })
    .then((r) => { res.send(r) })
    .catch((r) => { res.send(r) })
    .finally(() => { next() });

});

server.listen(process.env.PORT || 3000, function () {
  console.log('%s listening at %s', server.name, server.url);
});