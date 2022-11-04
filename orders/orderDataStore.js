const { orders, orders_products } = require("../models/index");
const { uuid } = require("uuidv4");

async function createOrder({ amount_paid, status, delivery_date, userId }) {
  return await orders.create({
    id: uuid(),
    amount_paid,
    status,
    delivery_date,
    userId,
  });
}

async function addOrderProduct({ productId, orderId, quantity }) {
  return await orders_products.create({ productId, orderId, quantity });
}

async function getOrderDetails(userId) {
  return await orders.findAll({ where: { userId } });
}

module.exports = { createOrder, addOrderProduct, getOrderDetails };
