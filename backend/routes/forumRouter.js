const express = require("express");
const router = express.Router();
const forumController = require("../controllers/forumController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", forumController.getAllTopics);
router.get("/:id", forumController.getTopicById);
router.get("/:id/replies", forumController.getReplies);
router.post("/:id/replies", authMiddleware, forumController.createReply);
router.post("/", authMiddleware, forumController.createTopic);
router.put("/:id", authMiddleware, forumController.updateTopic);
router.delete("/:id", authMiddleware, forumController.deleteTopic);

module.exports = router;
