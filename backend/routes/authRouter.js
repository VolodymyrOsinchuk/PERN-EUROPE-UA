const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  verifyEmail,
} = require("../controllers/authController");

router.get("/logout", logout);
router.post("/login", login);
router.post("/register", register);
router.get("/verify-email/:token", verifyEmail);

module.exports = router;
