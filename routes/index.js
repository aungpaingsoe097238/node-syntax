const router = require("express").Router();
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const profileRoutes = require("./profile.routes");
const blogRoutes = require("./blog.routes");
const tagRoutes = require("./tag.routes");
const commentRoutes = require("./comment.routes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/profile", profileRoutes);
router.use("/blogs", blogRoutes);
router.use("/tags", tagRoutes);
router.use("/comments", commentRoutes);

module.exports = router;
