const router = require("express").Router();
// Contorllers
const tagController = require("../app/controllers/tab.controller");
const authMiddleware = require("../app/middlewares/authMiddleware");

router.get("/", authMiddleware, tagController.index);
router.get("/:id", authMiddleware, tagController.show);

module.exports = router;
