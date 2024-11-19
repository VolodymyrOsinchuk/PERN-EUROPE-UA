const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyAccount,
  verifyEmail,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
router.get("/verify/:token", verifyEmail);

module.exports = router;
