const router = require("express").Router();
// Validators
const validateBody = require("../app/validators/validateBody");
// Schema
const authSchema = require("../app/schemas/auth.schema");
// Contorllers
const authController = require("../app/controllers/auth.controller");

router.post(
  "/sign-in",
  validateBody(authSchema.signInSchema),
  authController.signIn
);
router.post(
  "/sign-up",
  validateBody(authSchema.signUpSchema),
  authController.signUp
);

module.exports = router;
