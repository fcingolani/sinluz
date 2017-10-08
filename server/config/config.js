const path = require('path');
console.log();
module.exports = {
  development: {
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '../local/db.sqlite')
  },
  test: {
    dialect: 'sqlite',
    storage: process.env.DB_FILE
  },
  production: {
    dialect: 'sqlite',
    storage: process.env.DB_FILE
  }
};