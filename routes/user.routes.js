const router = require("express").Router();
// Contorllers
const userController = require("../app/controllers/user.controller");

router.route("/").get(userController.index);
router.route("/:id").get(userController.show);

module.exports = router;
