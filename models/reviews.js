"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.reviews.belongsTo(models.users);
    }
  }
  reviews.init(
    {
      userId: DataTypes.STRING,
      rating: DataTypes.INTEGER,
      productId: DataTypes.STRING,
      text: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "reviews",
    }
  );
  return reviews;
};
