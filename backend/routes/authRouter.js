const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
router.get("/verify-email/:token", verifyEmail);

module.exports = router;
