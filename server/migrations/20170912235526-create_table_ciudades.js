'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ciudades', {
      id: {
        type: Sequelize.STRING(96),
        primaryKey: true,
      },
      nombre: Sequelize.STRING(32),
      partidoNombre: Sequelize.STRING(64),
      geoJSON: Sequelize.TEXT,
      geoLocation: Sequelize.TEXT,
      source: Sequelize.INTEGER,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ciudades');
  }
};
