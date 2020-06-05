module.exports = function (sequelize, DataTypes) {
  const Trip = sequelize.define("Trip", {
    trip_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 40],
        is: /^[a-zA-Z0-9._ ]+$/i,
      },
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
  });

  Trip.associate = function (models) {
    Trip.hasMany(models.City, {
      onDelete: "cascade",
    });
    Trip.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
  };
  return Trip;
};
