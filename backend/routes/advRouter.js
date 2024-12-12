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

router
  .route("/")
  .post(upload.array("photos", 5), authMiddleware, createAnnonce)
  .get(getAllAnnonces);
router
  .route("/:id")
  .get(getAnnonceById)
  .put(updateAnnonce)
  .delete(deleteAnnonce);

module.exports = router;
