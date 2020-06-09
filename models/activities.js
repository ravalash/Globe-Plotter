module.exports = function (sequelize, DataTypes) {
  const Activity = sequelize.define("Activity", {
    activity_name: {
      type: DataTypes.STRING,
      allowNull: false,
      // validate: {
      //   len: [3, 40],
      //   is: /^[a-zA-Z0-9._ ]+$/i,
      // },
    },
    activity_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 40],
        is: /^[a-zA-Z0-9._ ]+$/i,
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    yelp: {
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

  Activity.associate = function (models) {
    Activity.belongsTo(models.City, {
      foreignKey: {
        allowNull: false,
      },
    });
    Activity.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Activity;
};
