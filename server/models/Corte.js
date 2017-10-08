module.exports = function (sequelize, DataTypes) {
  let Corte = sequelize.define('Corte', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    distribuidoraNombre: DataTypes.STRING(6),
    tipo: DataTypes.STRING(32),
    etrAt: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    startedAt: DataTypes.INTEGER,
    finishedAt: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    subestacionId: {
      type: DataTypes.STRING(8),
      defaultValue: null
    },
    subestacionNombre: {
      type: DataTypes.STRING(32),
      defaultValue: null
    },
    alimentadorId: {
      type: DataTypes.STRING(8),
      defaultValue: null
    },
    ciudadId: DataTypes.STRING(96),
  }, {
      timestamps: false,
      tableName: 'cortes'
    });

  Corte.associate = function (models) {
    Corte.hasMany(models.Estado);
    Corte.belongsTo(models.Ciudad);
  }

  return Corte;

}