const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  verifyEmail,
  googleLogin,
  googleCallback,
  facebookLogin,
  facebookCallback,
} = require("../controllers/authController");
const {
  loginLimiter,
  registerLimiter,
  verifyEmailLimiter,
} = require("../middleware/rateLimiters");

router.post("/logout", logout);
// FIX P1-2: rate limiting sur les routes sensibles à l'abus
router.post("/login", loginLimiter, login);
router.post("/register", registerLimiter, register);
router.get(
  "/verify-email/:token",
  verifyEmailLimiter,
  verifyEmail,
);

// OAuth social — Google
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);

// OAuth social — Facebook
router.get("/facebook", facebookLogin);
router.get("/facebook/callback", facebookCallback);

module.exports = router;
