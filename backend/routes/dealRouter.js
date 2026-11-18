const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { getDeal, createOrUpdateDeal } = require("../controllers/dealController");

router.use(authMiddleware);
router.get("/:conversationId", getDeal);
router.put("/:conversationId", createOrUpdateDeal);

module.exports = router;
