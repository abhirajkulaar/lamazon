const express = require("express");

const initUsers = require("./users/index");
const initProducts = require("./products/index");
const initOrders = require("./orders/index");
const app = express();
var cors = require("cors");

app.use(cors());
app.use(express.json());

app.use(express.static("build"));

initUsers(app);
initProducts(app);
initOrders(app);
app.use((err, req, res, next) => {
  res.status(500).send(err.toString());
});
const path = require("path");
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.listen(process.env.PORT || 8080);
console.log("Lisening!!");
