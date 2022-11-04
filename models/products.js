"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.products.hasMany(models.reviews);
    }
  }
  products.init(
    {
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      image: DataTypes.STRING,
      discounted_price: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      seller: DataTypes.STRING,
      brand: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "products",
    }
  );
  return products;
};
