const authMiddleware = require("../middlewares/auth");
const products = require("../models/products");
const { getProductByProductId } = require("../products/productDataStore");
const {
  createOrder,
  addOrderProduct,
  getOrderDetails,
} = require("./orderDataStore");
const { deleteCart } = require("../users/dataStore");

function initOrders(app) {
  app.post("/api/orders", authMiddleware, async (req, res) => {
    try {
      const orderProducts = req.body;

      let price = 0;

      for (let i = 0; i < orderProducts.length; i++) {
        price +=
          (await getProductByProductId(orderProducts[i].productId))
            .discounted_price * orderProducts[i].quantity;
      }

      const orderDetails = await createOrder({
        amount_paid: price,
        status: "Not Dispatched",
        delivery_date: new Date().setDate(new Date().getDate() + 7),
        userId: res.locals.userId,
      });

      for (let i = 0; i < orderProducts.length; i++) {
        await addOrderProduct({
          productId: orderProducts[i].productId,
          orderId: orderDetails.id,
          quantity: orderProducts[i].quantity,
        });
      }
      await deleteCart(res.locals.userId);
      //clear the cart
      res.json({ message: "test" });
    } catch (e) {
      res.json({ message: e.toString() }).status(500);
    }
  });

  app.get("/api/orders", authMiddleware, async (req, res) => {
    const toReturn = await getOrderDetails(res.locals.userId);
    res.json(toReturn);
  });
}

module.exports = initOrders;
