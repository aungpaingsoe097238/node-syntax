const { signIn, signUp } = require("../../../controllers/v1/admin/auth.controller");
const router = require("express").Router();

router.post("/sign-in",  signIn);
router.post("/sign-up", signUp);

module.exports = router;
