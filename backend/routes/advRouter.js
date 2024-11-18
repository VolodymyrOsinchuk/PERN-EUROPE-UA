const express = require("express");
const router = express.Router();
const {
  createAnnonce,
  getAllAnnonces,
  getAnnonceById,
  deleteAnnonce,
  updateAnnonce,
} = require("../controllers/advController");

router.route("/").post(createAnnonce).get(getAllAnnonces);
router
  .route("/:id")
  .get(getAnnonceById)
  .put(updateAnnonce)
  .delete(deleteAnnonce);

module.exports = router;
