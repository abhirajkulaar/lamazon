const bcrypt = require("bcrypt");
const saltRounds = 10;
var jwt = require("jsonwebtoken");
const jwtKey = "shhhhh";

async function encryptPassword(password) {
  return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password1, password2) {
  return await bcrypt.compare(password1, password2);
}

function generateUserToken(userId) {
  return jwt.sign({ userId }, jwtKey);
}

function decodeUserToken(token) {
  return jwt.verify(token, jwtKey);
}

module.exports = {
  encryptPassword,
  verifyPassword,
  generateUserToken,
  decodeUserToken,
};
