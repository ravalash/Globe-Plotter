module.exports = function (sequelize, DataTypes) {
  const Trip = sequelize.define("Trip", {
    trip_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: true,
      },
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: true,
      },
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 2,
        isNumeric: true,
      },
    }
  });

  Trip.associate = function (models) {
    Trip.hasMany(models.City, {
      onDelete: "cascade",
    });
    Trip.belongsTo(models.User, {
      foreignKey: {
        allowNull: false, 
      }, onDelete: 'cascade'
    });
  };
  return Trip;
};
