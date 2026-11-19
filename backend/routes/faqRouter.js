// backend/routes/faqRouter.js
const express = require("express");
const router = express.Router();
const faq = require("../controllers/faqController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authMiddleware");

const staffOnly = [authMiddleware, roleMiddleware(["admin", "moderator"])];

// Публічний
router.get("/", faq.getPublishedFaq);

// Для admin і moderator
router.get("/admin", ...staffOnly, faq.getAllFaqAdmin);
router.post("/", ...staffOnly, faq.createFaqItem);
router.put("/:id", ...staffOnly, faq.updateFaqItem);
router.delete("/:id", ...staffOnly, faq.deleteFaqItem);

module.exports = router;
