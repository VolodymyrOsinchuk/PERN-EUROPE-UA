const express = require("express");
const router = express.Router();
const {
  createContactMessage,
  getContactMessages,
} = require("../controllers/contactController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authMiddleware");
const { contactLimiter } = require("../middleware/rateLimiters");

// POST /api/v1/contact — formulaire de contact public
router.post("/", contactLimiter, createContactMessage);

// Admin : lire les messages de contact
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  getContactMessages,
);

module.exports = router;
