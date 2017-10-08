module.exports = function (sequelize, DataTypes) {

  let Estado = sequelize.define('Estado', {

    afectados: DataTypes.INTEGER,

    updatedAt: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },

    corteId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }

  }, {
      timestamps: false,
      tableName: 'estados'
    });

  Estado.associate = function (models) {
    Estado.belongsTo(models.Corte);
  }

  return Estado;

}