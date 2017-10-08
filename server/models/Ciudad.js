module.exports = function (sequelize, DataTypes) {

  let Ciudad = sequelize.define('Ciudad', {
    id: {
      type: DataTypes.STRING(96),
      primaryKey: true,
    },
    nombre: DataTypes.STRING(32),
    partidoNombre: DataTypes.STRING(64),
    geoJSON: DataTypes.TEXT,
    geoLocation: DataTypes.TEXT,
    source: DataTypes.INTEGER,
  }, {
      timestamps: false,
      tableName: 'ciudades',
    });

  return Ciudad;

}