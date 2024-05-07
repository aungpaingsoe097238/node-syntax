const router = require("express").Router();
// Contorllers
const commentController = require("../app/controllers/comment.controller");
// Middlewares
const authMiddleware = require("../app/middlewares/authMiddleware");
// Schemas
const commentSchema = require("../app/schemas/comment.schema");
// Validators
const validateBody = require("../app/validators/validateBody");

router
  .route("/")
  .post(
    authMiddleware,
    validateBody(commentSchema.createSchema),
    commentController.create
  );

router
  .route("/:id")
  .get(commentController.show)
  .put(
    authMiddleware,
    validateBody(commentSchema.updateSchema),
    commentController.update
  )
  .delete(authMiddleware, commentController.destroy);

module.exports = router;
