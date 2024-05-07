const jwt = require("jsonwebtoken");

const generate = (payload) => jwt.sign(payload, process.env.TOKEN_SECRET);

const verify = (payload) =>
  jwt.verify(payload, process.env.TOKEN_SECRET, { expiresIn: "30d" });

module.exports = {
  generate,
  verify,
};
