const router = require("express").Router();
// Contorllers
const blogController = require("../app/controllers/blog.controller");
// Middlewares
const authMiddleware = require("../app/middlewares/authMiddleware");
// Schemas
const blogSchema = require("../app/schemas/blog.schema");
// Validators
const validateBody = require("../app/validators/validateBody");

router
  .route("/")
  .get(blogController.index)
  .post(
    authMiddleware,
    validateBody(blogSchema.createSchema),
    blogController.create
  );

router
  .route("/:id")
  .get(blogController.show)
  .put(
    authMiddleware,
    validateBody(blogSchema.updateSchema),
    blogController.update
  )
  .delete(authMiddleware, blogController.destroy);

router.post("/restore/:id", authMiddleware, blogController.restore);

module.exports = router;
