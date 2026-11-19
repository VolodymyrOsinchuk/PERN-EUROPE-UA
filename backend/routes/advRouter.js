// backend/routes/advRouter.js
const express = require("express");
const {
  authMiddleware,
  optionalAuth,
} = require("../middleware/authMiddleware");
const router = express.Router();
const {
  createAnnonce,
  getAllAnnonces,
  getAnnonceById,
  deleteAnnonce,
  updateAnnonce,
  getUserAnnonces,
  submitForModeration,
  getSellerProfile,
  refreshAnnonce,
  markAnnonceSold,
  reorderPhotos,
  contactClick,
  getAdAnalytics,
  suggestions,
  bulk,
  completeness,
} = require("../controllers/advController");
const { upload, uploadToCloudinary } = require("../middleware/multer");
const checkOwnership = require("../middleware/checkOwnership");
const { getOwnAdLogs } = require("../controllers/moderationController");
const validateUpdateFields = require("../middleware/validateUpdateFields");

router
  .route("/")
  .post(
    authMiddleware,
    upload.array("photos", 5),
    uploadToCloudinary("advs"),
    createAnnonce,
  )
  .get(getAllAnnonces);

router.route("/user-ads").get(authMiddleware, getUserAnnonces);
router.get("/seller/:id", getSellerProfile);

router
  .route("/:id")
  .get(optionalAuth, getAnnonceById)
  .put(
    authMiddleware,
    checkOwnership,
    upload.array("photos", 5),
    uploadToCloudinary("advs"),
    validateUpdateFields,
    updateAnnonce,
  )
  .delete(authMiddleware, checkOwnership, deleteAnnonce);

router.patch(
  "/:id/submit",
  authMiddleware,
  checkOwnership,
  submitForModeration,
);

router.patch("/:id/refresh", authMiddleware, checkOwnership, refreshAnnonce);
router.patch("/:id/sold", authMiddleware, checkOwnership, markAnnonceSold);

router.get("/:id/logs", authMiddleware, checkOwnership, getOwnAdLogs);
router.patch("/:id/photos/reorder", authMiddleware, checkOwnership, reorderPhotos);
router.patch("/:id/contact-click", optionalAuth, contactClick);
router.get("/:id/analytics", authMiddleware, checkOwnership, getAdAnalytics);
router.get("/:id/completeness", authMiddleware, checkOwnership, completeness);
router.get("/suggestions", optionalAuth, suggestions);
router.get("/bulk", optionalAuth, bulk);

module.exports = router;
