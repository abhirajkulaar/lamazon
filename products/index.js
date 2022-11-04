const {
  getProducts,
  getProductByProductId,
  postReview,
  getReviewsByProduct,
} = require("./productDataStore");

const authMiddleware = require("../middlewares/auth");

function initProducts(app) {
  app.get("/api/products", async (req, res) => {
    try {
      let { pageNumber, pageSize, searchText, brand, minPrice, maxPrice } =
        req.query;

      if (!pageNumber) {
        pageNumber = 1;
      }
      let productsList = await getProducts({
        pageNumber: parseInt(pageNumber) || 1,
        pageSize: parseInt(pageSize) || 20,
        searchText,
        brand,
        minPrice,
        maxPrice,
      });
      const data = productsList.rows.map((item) => item.dataValues);
      const totalItems = productsList.count;
      const currentPage = pageNumber;
      res.status(200).json({ data, totalItems });
    } catch (e) {
      let a = 34;
    }
  });

  app.get("/api/products/:productId", async (req, res) => {
    let productInfo = await getProductByProductId(req.params.productId);
    if (productInfo) {
      res.status(200).json(productInfo.dataValues);
    } else {
      res.status(404).json({ message: "Item not found!" });
    }
  });

  app.post("/api/review", authMiddleware, async (req, res) => {
    const { productId } = req.query;
    const { rating, reviewText } = req.body;
    await postReview({
      productId,
      rating,
      text: reviewText,
      userId: res.locals.userId,
    });
    res.status(201).json({ message: "success" });
  });

  app.get("/api/reviews", async (req, res) => {
    const { productId } = req.query;
    const reviews = await getReviewsByProduct(productId);
    res.status(200).json(reviews);
  });
}

module.exports = initProducts;
