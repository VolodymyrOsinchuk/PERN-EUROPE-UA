const express = require("express");
const router = express.Router();
const { authMiddleware, optionalAuth } = require("../middleware/authMiddleware");
const {
  getSellerReviews,
  upsertSellerReview,
} = require("../controllers/sellerReviewController");

router.get("/:sellerId", getSellerReviews);
router.put("/:sellerId", authMiddleware, upsertSellerReview);

module.exports = router;
