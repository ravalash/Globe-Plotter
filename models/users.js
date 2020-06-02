module.exports = function(sequelize, DataTypes) {
    const User = sequelize.define("User", {
      user_email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 20],
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8, 16]
        }
      }
    });

    User.associate = function(models) {
        User.hasMany(models.Trip, {
          onDelete: "cascade"
        });
      };
    return User;
  };
  