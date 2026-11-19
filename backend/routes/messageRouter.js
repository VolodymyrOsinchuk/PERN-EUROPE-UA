const express = require("express");
const router = express.Router();
const { reportMessage, getUnreadMessageCount } = require("../controllers/messageController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { reportLimiter } = require("../middleware/rateLimiters");

router.get("/unread-count", authMiddleware, getUnreadMessageCount);
router.post("/:id/report", authMiddleware, reportLimiter, reportMessage);

module.exports = router;
