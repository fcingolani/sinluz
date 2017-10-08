var restify = require('restify');
var _ = require('lodash');

var server = restify.createServer();
server.use(restify.plugins.gzipResponse());

server.use((req, res, next) => {
  res.charSet('utf-8');
  next();
})

let models = require('../models');

server.get('/cortes/activos', (req, res, next) => {

  models.Corte.findAll({
    include: [{
      model: models.Estado
    }]
  })
    .then(res.send)
    .catch(res.send)
    .finally(next);

});

server.get('/ciudades', (req, res, next) => {

  models.Ciudad.findAll()
    .then(res.send)
    .catch(res.send)
    .finally(next);

});

server.listen(process.env.PORT || 3000, function () {
  console.log('%s listening at %s', server.name, server.url);
});