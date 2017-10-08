'use strict';

const _ = require('lodash');
const generateCiudadId = require('../lib/generate-ciudad-id');

module.exports = {
  up: (queryInterface, Sequelize) => {

    let lugares = require('../var/lugares-bsas.json');
    let partidoNombreRX = /Partido del? /;
    let ids = {}

    let ciudades = _.chain(lugares)
      .filter((lugar) => {
        return lugar['Admin Level'] === '8';
      })
      .map((ciudad) => {

        let partido = _.find(lugares, {
          OSM: ciudad.Parent
        });

        let geoJSON = _.trim(ciudad.geoJSON);
        let ciudadNombre = ciudad.Name.name;
        let partidoNombre = partido.Name.name.replace(partidoNombreRX, '');
        let id = generateCiudadId(partidoNombre, ciudadNombre);

        if (ids[id]) {
          return null
        } else {
          ids[id] = true;
        }

        return {
          id: id,
          nombre: ciudadNombre,
          partidoNombre: partidoNombre,
          geoJSON: geoJSON != 'None' ? geoJSON : null,
          geoLocation: ciudad['Centre Point'],
          source: 1
        };

      })
      .compact()
      .value();

    return queryInterface.bulkInsert('ciudades', ciudades, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ciudades', {
      source: 1
    });
  }
};
