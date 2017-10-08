'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.createTable('cortes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      distribuidoraNombre: Sequelize.STRING(6),
      tipo: Sequelize.STRING(32),
      etrAt: {
        type: Sequelize.INTEGER,
        defaultValue: null
      },
      startedAt: Sequelize.INTEGER,
      finishedAt: {
        type: Sequelize.INTEGER,
        defaultValue: null
      },
      subestacionId: {
        type: Sequelize.STRING(8),
        defaultValue: null
      },
      subestacionNombre: {
        type: Sequelize.STRING(32),
        defaultValue: null
      },
      alimentadorId: {
        type: Sequelize.STRING(8),
        defaultValue: null
      },
      ciudadId: Sequelize.STRING(96),
    });

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('cortes');
  }
};
