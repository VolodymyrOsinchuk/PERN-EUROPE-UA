const express = require("express");
const router = express.Router();
const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", getMyNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);

module.exports = router;
