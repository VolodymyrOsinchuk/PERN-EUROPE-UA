// backend/routes/advRouter.js
const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();
const {
  createAnnonce,
  getAllAnnonces,
  getAnnonceById,
  deleteAnnonce,
  updateAnnonce,
  getUserAnnonces,
} = require("../controllers/advController");
const { upload, uploadToCloudinary } = require("../middleware/multer");
const checkOwnership = require("../middleware/checkOwnership");
const validateUpdateFields = require("../middleware/validateUpdateFields");

router
  .route("/")
  .post(
    upload.array("photos", 5),
    authMiddleware,
    uploadToCloudinary("advs"),
    createAnnonce,
  )
  .get(getAllAnnonces);

router.route("/user-ads").get(authMiddleware, getUserAnnonces);

router
  .route("/:id")
  .get(getAnnonceById)
  .put(
    authMiddleware,
    checkOwnership,
    upload.array("photos", 5),
    uploadToCloudinary("advs"),
    validateUpdateFields,
    updateAnnonce,
  )
  .delete(authMiddleware, checkOwnership, deleteAnnonce);

module.exports = router;
