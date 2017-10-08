'use strict';

const _ = require('lodash');
const generateCiudadId = require('../lib/generate-ciudad-id');

module.exports = {
  up: (queryInterface, Sequelize) => {


    let barrios = _.chain(require('../var/barrios-caba.json').features)
      .map((barrio) => {

        let geoJSON = JSON.stringify(barrio.geometry);
        let ciudadNombre = barrio.properties.name;
        let partidoNombre = 'Capital Federal';

        return {
          id: generateCiudadId(partidoNombre, ciudadNombre),
          nombre: ciudadNombre,
          partidoNombre: partidoNombre,
          geoJSON: geoJSON,
          source: 2,
        };

      })
      .value();

    return queryInterface.bulkInsert('ciudades', barrios, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ciudades', {
      source: 2
    });
  }
};
