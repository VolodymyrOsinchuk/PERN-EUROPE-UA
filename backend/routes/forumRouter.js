const express = require("express");
const router = express.Router();
const forumController = require("../controllers/forumController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authMiddleware");

// ─── Stats publiques ──────────────────────────────────────
router.get("/stats", forumController.getForumStats);

// ─── Category Suggestions (Must be declared before /:id) ──
router.post(
  "/category-suggestions",
  authMiddleware,
  forumController.suggestCategory,
);
router.get(
  "/category-suggestions",
  authMiddleware,
  roleMiddleware(["admin", "moderator"]),
  forumController.getAllCategorySuggestions,
);
router.patch(
  "/category-suggestions/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  forumController.updateCategorySuggestion,
);

// ─── Forum Reports / Complaints ───────────────────────────
router.post("/reports", authMiddleware, forumController.createForumReport);
router.get(
  "/reports",
  authMiddleware,
  roleMiddleware(["admin", "moderator"]),
  forumController.getAllForumReports,
);
router.patch(
  "/reports/:id",
  authMiddleware,
  roleMiddleware(["admin", "moderator"]),
  forumController.updateForumReport,
);

// ─── Forum Categories (public) ────────────────────────────
router.get("/categories", forumController.getAllForumCategories);

// ─── Forum Categories (admin) ─────────────────────────────
router.get(
  "/categories/admin",
  authMiddleware,
  roleMiddleware(["admin", "moderator"]),
  forumController.getAllForumCategoriesAdmin,
);
router.post(
  "/categories",
  authMiddleware,
  roleMiddleware(["admin"]),
  forumController.createForumCategory,
);
router.put(
  "/categories/:id",
  authMiddleware,
  roleMiddleware(["admin", "moderator"]),
  forumController.updateForumCategory,
);
router.patch(
  "/categories/:id/toggle",
  authMiddleware,
  roleMiddleware(["admin", "moderator"]),
  forumController.toggleForumCategory,
);
router.delete(
  "/categories/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  forumController.deleteForumCategory,
);

// ─── Replies standalone actions ───────────────────────────
router.put("/replies/:id", authMiddleware, forumController.updateReply);
router.delete("/replies/:id", authMiddleware, forumController.deleteReply);

// ─── Topics ───────────────────────────────────────────────
router.get("/", forumController.getAllTopics);
router.post("/", authMiddleware, forumController.createTopic);
router.get("/:id", forumController.getTopicById);
router.put("/:id", authMiddleware, forumController.updateTopic);
router.delete("/:id", authMiddleware, forumController.deleteTopic);

// Topic moderation actions
router.patch(
  "/:id/pin",
  authMiddleware,
  roleMiddleware(["admin", "moderator"]),
  forumController.togglePinTopic,
);
router.patch(
  "/:id/close",
  authMiddleware,
  roleMiddleware(["admin", "moderator"]),
  forumController.toggleCloseTopic,
);
router.patch(
  "/:id/move",
  authMiddleware,
  roleMiddleware(["admin", "moderator"]),
  forumController.moveTopic,
);

// Topic replies
router.get("/:id/replies", forumController.getReplies);
router.post("/:id/replies", authMiddleware, forumController.createReply);

module.exports = router;
