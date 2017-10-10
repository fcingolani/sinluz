const path = require('path');

var db_file = process.env.DB_FILE || path.resolve(__dirname, '../db.sqlite');

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: db_file
  },
  test: {
    dialect: 'sqlite',
    storage: db_file
  },
  production: {
    dialect: 'sqlite',
    storage: db_file
  }
};