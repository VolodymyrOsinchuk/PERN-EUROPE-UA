const express = require("express");
const router = express.Router();
const forumController = require("../controllers/forumController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authMiddleware");

// ─── Stats publiques ──────────────────────────────────────
router.get("/stats", forumController.getForumStats);

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
  roleMiddleware(["admin", "moderator"]),
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
  roleMiddleware(["admin", "moderator"]),
  forumController.deleteForumCategory,
);

// ─── Topics ───────────────────────────────────────────────
router.get("/", forumController.getAllTopics);
router.get("/:id", forumController.getTopicById);
router.get("/:id/replies", forumController.getReplies);
router.post("/:id/replies", authMiddleware, forumController.createReply);
router.post("/", authMiddleware, forumController.createTopic);
router.put("/:id", authMiddleware, forumController.updateTopic);
router.delete("/:id", authMiddleware, forumController.deleteTopic);

module.exports = router;
