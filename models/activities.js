module.exports = function (sequelize, DataTypes) {
  const Activity = sequelize.define("Activity", {
    activity_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    activity_type: {
      type: DataTypes.STRING,
      allowNull: false,
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
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

  });

  Activity.associate = function (models) {
    Activity.belongsTo(models.City, {
      foreignKey: {
        allowNull: false
      }, onDelete: 'cascade'
    });
    Activity.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }, onDelete: 'cascade'
    });
  };

  return Activity;
};
