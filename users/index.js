const {
  insertUser,
  getUserDetailsByEmail,
  addItemToCart,
  getCartItems,
  removeCartItems,
  createAddress,
  getUserAddress,
  getUserDetails,
  getCartCount,
} = require("./dataStore");
const {
  encryptPassword,
  verifyPassword,
  generateUserToken,
} = require("../services/encrypt");

const authMiddleware = require("../middlewares/auth");
function initUsers(app) {
  app.post("/api/users/register", async (req, res, next) => {
    try {
      const {
        firstName,
        lastName,
        password,
        phoneNumber,
        email,
        line1,
        city,
        state,
        pinCode,
      } = req.body;

      if (
        !firstName ||
        !lastName ||
        !password ||
        !phoneNumber ||
        !email ||
        !line1 ||
        !city ||
        !state ||
        !pinCode
      ) {
        res.status(403).json({
          message:
            "firstName,lastName ,password, phoneNumber, line1, city, state, pinCode are mandatory!",
        });
        return;
      }
      const encPassword = await encryptPassword(password);

      const newUserDetails = await insertUser({
        firstName,
        lastName,
        phoneNumber,
        passwordHash: encPassword,
        email,
      });

      await createAddress({
        userId: newUserDetails.id,
        line1,
        city,
        state,
        pinCode,
      });

      const token = generateUserToken(newUserDetails.id);

      res.status(201).json({ token });
    } catch (e) {
      res.status(500).json({ message: "Unable to register!" });
      console.log(e);
    }
  });

  app.post("/api/users/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(403).json({ message: "email, password are mandatory!" });
      }

      const userDetails = await getUserDetailsByEmail(email);

      if (!userDetails) {
        res.status(404).json({ message: "User not found!" });
      }

      const passwordHash = userDetails.passwordHash;

      const isPasswordValid = await verifyPassword(password, passwordHash);

      const token = generateUserToken(userDetails.id);

      if (isPasswordValid) {
        res.status(200).json({ token });
      } else {
        res.status(403).json({ message: "Password is incorrect" });
      }
    } catch (e) {
      console.log(e);
    }
  });

  app.post("/api/users/cart", authMiddleware, async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      await addItemToCart(res.locals.userId, productId, quantity);
      res.status(201).json({ message: "success" });
    } catch (e) {
      console.log(e);
    }
  });

  app.get("/api/users/cart", authMiddleware, async (req, res) => {
    try {
      const cartItems = await getCartItems(res.locals.userId);
      res.status(200).json(cartItems.map((item) => item.dataValues));
    } catch (e) {
      console.log(e);
    }
  });

  app.delete("/api/users/cart", authMiddleware, async (req, res) => {
    try {
      const { itemId } = req.query;
      await removeCartItems(res.locals.userId, itemId);
      res.status(200).json({ message: "success" });
    } catch (e) {
      console.log(e);
    }
  });

  app.get("/api/users/address", authMiddleware, async (req, res) => {
    try {
      const toReturn = await getUserAddress(res.locals.userId);
      res.status(200).json(toReturn);
    } catch (e) {
      console.log(e);
    }
  });

  app.get("/api/user", authMiddleware, async (req, res) => {
    try {
      const toReturn = await getUserDetails(res.locals.userId);
      res.status(200).json(toReturn);
    } catch (e) {
      console.log(e);
    }
  });

  app.get("/api/users/cart/count", authMiddleware, async (req, res) => {
    try {
      const toReturn = await getCartCount(res.locals.userId);
      res.status(200).json(toReturn);
    } catch (e) {
      console.log(e);
    }
  });
}

module.exports = initUsers;
