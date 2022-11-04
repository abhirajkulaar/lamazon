const { decodeUserToken } = require("../services/encrypt");

module.exports = (req, res, next) => {
  if (req.headers.token) {
    const decodedToken = decodeUserToken(req.headers.token);
    if (decodedToken) {
      res.locals.userId = decodedToken.userId;
      return next();
    } else {
      res.status(401).json({ message: "Unauthorized!" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized!" });
  }
};
