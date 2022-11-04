"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //models.reviews.belongsTo(models.users);
      models.users.hasMany(models.reviews);
    }
  }
  users.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      passwordHash: DataTypes.STRING,
      phoneNumber: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};
