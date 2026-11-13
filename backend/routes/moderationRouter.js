const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authMiddleware");
const moderation = require("../controllers/moderationController");
const messages = require("../controllers/messageController");

const staffOnly = [authMiddleware, roleMiddleware(["admin", "moderator"])];

router.get("/ads", ...staffOnly, moderation.getModerationAds);
router.get("/pending-count", ...staffOnly, moderation.getPendingCount);
router.patch("/ads/:id/approve", ...staffOnly, moderation.approveAd);
router.patch("/ads/:id/reject", ...staffOnly, moderation.rejectAd);
router.patch("/ads/:id/needs-changes", ...staffOnly, moderation.requestChanges);
router.get("/ads/:id/logs", ...staffOnly, moderation.getAdLogs);
router.get("/message-reports", ...staffOnly, messages.listMessageReports);
router.patch(
  "/message-reports/:id",
  ...staffOnly,
  messages.decideMessageReport,
);

module.exports = router;
