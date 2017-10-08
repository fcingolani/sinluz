'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.createTable('estados', {

      afectados: Sequelize.INTEGER,

      updatedAt: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },

      corteId: {
        type: Sequelize.INTEGER,
        primaryKey: true
      }

    })

  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.dropTable('estados');

  }
};
