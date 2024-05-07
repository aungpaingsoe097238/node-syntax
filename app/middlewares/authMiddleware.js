const jwt = require("../helpers/jwt");
const User = require("../models").User;
const response = require("../helpers/response");

const authMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    return response.error(res, "Unauthorized", { token: "Invalid token" }, 401);
  }

  const token = req.headers.authorization.split(" ")[1];
  const email = jwt.verify(token);

  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    return response.error(res, "Unauthorized", { token: "Invalid token" }, 401);
  }

  req.user = user;
  next();
};

module.exports = authMiddleware;
