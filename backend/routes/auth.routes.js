const router = require("express").Router();
const {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} = require("../controllers/auth.controllers");
const verifyToken = require("../middleware/verifyToken");

router.get("/check-auth", verifyToken, checkAuth);

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
