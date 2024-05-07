const router = require("express").Router();
// Contorllers
const profileController = require("../app/controllers/profile.controller");
// Middlewares
const authMiddleware = require("../app/middlewares/authMiddleware");
// Schemas
const profileSchema = require("../app/schemas/profile.schema");
// Validators
const validateBody = require("../app/validators/validateBody");

router.get("/me", authMiddleware, profileController.me);
router.put(
  "/update",
  authMiddleware,
  validateBody(profileSchema.updateSchema),
  profileController.update
);

module.exports = router;
