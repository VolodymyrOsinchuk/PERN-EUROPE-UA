const express = require("express");
const router = express.Router();
const { createMessage, getConversations, getMessages, markRead } = require("../controllers/messageController");

router.post("/", createMessage);
router.get("/conversations", getConversations);
router.get("/:conversationId", getMessages);
router.patch("/:conversationId/read", markRead);

module.exports = router;
