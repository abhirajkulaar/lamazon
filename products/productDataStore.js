const e = require("express");
const { Op } = require("sequelize");
const { products, reviews, users, sequelize } = require("../models/index");

async function getProducts({
  pageSize,
  pageNumber,
  searchText,
  brand,
  minPrice,
  maxPrice,
}) {
  let where = {};
  if (searchText) {
    where.name = { [Op.like]: `%${searchText}%` };
  }

  if (brand) {
    where.brand = brand;
  }
  if (minPrice != null) {
    where.price = { [Op.gte]: minPrice };
  }

  if (parseInt(maxPrice) > 0) {
    if (where.price) {
      where.price = { [Op.and]: [where.price, { [Op.lte]: maxPrice }] };
    } else {
      where.price = { [Op.lte]: maxPrice };
    }
  }
  return await products.findAndCountAll({
    where,
    limit: pageSize,
    offset: pageSize * (pageNumber - 1),
  });
}

async function getProductByProductId(productId) {
  return await products.findOne({
    where: { id: productId },
    include: { model: reviews, attributes: [] },
    attributes: {
      include: [
        // this adds AVG attribute to others instead of rewriting
        [sequelize.fn("AVG", sequelize.col("reviews.rating")), "avgRating"],
      ],
    },
    group: ["products.id"],
  });
}

async function postReview(details) {
  return await reviews.create(details);
}

async function getReviewsByProduct(productId) {
  return await reviews.findAll({
    where: { productId },
    include: { model: users, attributes: ["firstName", "lastName"] },
  });
}

module.exports = {
  getProducts,
  getProductByProductId,
  postReview,
  getReviewsByProduct,
};
