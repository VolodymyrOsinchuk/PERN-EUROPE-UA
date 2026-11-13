const express = require("express");
const router = express.Router();
const { sendAdEmail } = require("../controllers/adEmailController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { contactLimiter } = require("../middleware/rateLimiters");

router.post("/", authMiddleware, contactLimiter, sendAdEmail);

module.exports = router;
