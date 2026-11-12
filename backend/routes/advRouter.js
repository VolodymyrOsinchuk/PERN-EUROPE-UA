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

router.get("/:id/logs", authMiddleware, checkOwnership, getOwnAdLogs);

module.exports = router;
