const express = require("express");
const router = express.Router();
const { reportMessage, getUnreadMessageCount } = require("../controllers/messageController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/unread-count", authMiddleware, getUnreadMessageCount);
router.post("/:id/report", authMiddleware, reportMessage);

module.exports = router;
