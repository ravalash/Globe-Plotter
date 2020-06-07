module.exports = function (sequelize, DataTypes) {
  const City = sequelize.define("City", {
    city_name: {
      type: DataTypes.STRING,
      allowNull: false
      // validate: {
      //   // len: [3, 40],
      //   // is: /^[a-zA-Z0-9._ ]+$/i,
      // },
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isNumeric: true,
      },
    },
    lon: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isNumeric: true,
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
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
    },
  });

  City.associate = function (models) {
    City.hasMany(models.Activity, {
      onDelete: "cascade",
    });
    City.belongsTo(models.Trip, {
      foreignKey: {
        allowNull: false,
      },
    });
    City.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
  };
  return City;
};
