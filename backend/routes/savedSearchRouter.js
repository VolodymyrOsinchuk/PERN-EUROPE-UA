const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  listSavedSearches,
  createSavedSearch,
  toggleSavedSearch,
  deleteSavedSearch,
} = require("../controllers/savedSearchController");

router.use(authMiddleware);

router.get("/", listSavedSearches);
router.post("/", createSavedSearch);
router.patch("/:id/toggle", toggleSavedSearch);
router.delete("/:id", deleteSavedSearch);

module.exports = router;
