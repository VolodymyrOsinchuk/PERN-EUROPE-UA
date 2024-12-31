const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();
const {
  createAnnonce,
  getAllAnnonces,
  getAnnonceById,
  deleteAnnonce,
  updateAnnonce,
} = require("../controllers/advController");
const upload = require("../middleware/multer");
const checkOwnership = require("../middleware/checkOwnership");
const validateUpdateFields = require("../middleware/validateUpdateFields");

router
  .route("/")
  .post(upload.array("photos", 5), authMiddleware, createAnnonce)
  .get(getAllAnnonces);
router
  .route("/:id")
  .get(getAnnonceById)
  .put(
    authMiddleware,
    checkOwnership,
    upload.array("photos", 5),
    validateUpdateFields,
    updateAnnonce
  )
  .delete(deleteAnnonce);

module.exports = router;
