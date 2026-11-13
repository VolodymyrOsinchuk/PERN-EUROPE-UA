const express = require("express");
const router = express.Router();
const {
  createConversation,
  listConversations,
  getMessages,
  postMessage,
  markRead,
} = require("../controllers/conversationController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { contactLimiter } = require("../middleware/rateLimiters");

router.use(authMiddleware);

router.get("/", listConversations);
router.post("/", contactLimiter, createConversation);
router.get("/:id/messages", getMessages);
router.post("/:id/messages", contactLimiter, postMessage);
router.patch("/:id/read", markRead);

module.exports = router;
