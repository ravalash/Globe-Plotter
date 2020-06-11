module.exports = function (sequelize, DataTypes) {
  const City = sequelize.define("City", {
    city_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    lon: {
      type: DataTypes.DECIMAL,
      allowNull: false,
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
        max: 1,
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
      }, onDelete: "cascade"
    });
    City.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
        
      }, onDelete: "cascade"
    });
  };
  return City;
};
