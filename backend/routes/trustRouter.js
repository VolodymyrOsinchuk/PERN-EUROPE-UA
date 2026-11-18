const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  getDraft,
  saveDraft,
  deleteDraft,
  trackViewedAd,
  getViewedAds,
} = require("../controllers/trustController");

router.use(authMiddleware);
router.get("/draft", getDraft);
router.put("/draft", saveDraft);
router.delete("/draft", deleteDraft);
router.get("/view-history", getViewedAds);
router.put("/view-history/:advId", trackViewedAd);

module.exports = router;
