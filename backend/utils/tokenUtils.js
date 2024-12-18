const jwt = require("jsonwebtoken");
const config = require("../config/config.js");
exports.createJWT = (payload) => {
  const token = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expirationTime,
  });
  return token;
};

exports.verifyJWT = (token) => {
  const decoded = jwt.verify(token, config.jwt.secret);
  return decoded;
};
