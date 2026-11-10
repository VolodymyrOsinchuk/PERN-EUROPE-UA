const express = require("express");
const router = express.Router();
const {
  createMessage,
  getConversations,
  getMessages,
  markRead,
  getUnreadCount,
} = require("../controllers/messageController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { contactLimiter } = require("../middleware/rateLimiters");

// FIX: all routes require authentication
router.post("/", authMiddleware, contactLimiter, createMessage);
router.get("/conversations", authMiddleware, getConversations);
router.get("/unread-count", authMiddleware, getUnreadCount);
router.get("/:conversationId", authMiddleware, getMessages);
router.patch("/:conversationId/read", authMiddleware, markRead);

module.exports = router;
