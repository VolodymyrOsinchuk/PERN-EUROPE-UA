const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  verifyEmail,
} = require("../controllers/authController");
const {
  loginLimiter,
  registerLimiter,
  verifyEmailLimiter,
} = require("../middleware/rateLimiters");

router.get("/logout", logout);
// FIX P1-2: rate limiting sur les routes sensibles à l'abus
router.post("/login", loginLimiter, login);
router.post("/register", registerLimiter, register);
router.get(
  "/verify-email/:token",
  verifyEmailLimiter,
  verifyEmail,
  verifyEmail,
);

module.exports = router;
