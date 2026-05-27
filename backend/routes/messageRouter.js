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

// FIX: all routes require authentication
router.post("/", authMiddleware, createMessage);
router.get("/conversations", authMiddleware, getConversations);
router.get("/unread-count", authMiddleware, getUnreadCount);
router.get("/:conversationId", authMiddleware, getMessages);
router.patch("/:conversationId/read", authMiddleware, markRead);

module.exports = router;
