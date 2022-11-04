const { users, carts, products, addresses } = require("../models/index");
const { uuid } = require("uuidv4");

async function insertUser(details) {
  return await users.create({ ...details, id: uuid() });
}

async function getUserDetailsByEmail(email) {
  return await users.findOne({ where: { email } });
}

async function addItemToCart(userId, productId, quantity) {
  return await carts.create({ userId, productId, quantity });
}

async function getCartItems(userId) {
  return await carts.findAll({
    where: { userId },
    include: { model: products },
  });
}
async function removeCartItems(userId, cartItemId) {
  return await carts.destroy({ where: { userId, id: cartItemId } });
}

async function createAddress(details) {
  return await addresses.create(details);
}

async function getUserAddress(userId) {
  return await addresses.findOne({ where: { userId } });
}

async function getUserDetails(userId) {
  return await users.findOne({ where: { id: userId } });
}

async function getCartCount(userId) {
  return await carts.count({
    where: { userId },
    include: { model: products },
  });
}

async function deleteCart(userId) {
  return await carts.destroy({ where: { userId } });
}

module.exports = {
  insertUser,
  getUserDetailsByEmail,
  addItemToCart,
  getCartItems,
  removeCartItems,
  createAddress,
  getUserAddress,
  getUserDetails,
  getCartCount,
  deleteCart,
};
