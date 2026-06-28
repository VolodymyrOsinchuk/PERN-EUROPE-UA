const express = require("express");
const router = express.Router();
const {
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authMiddleware");

router.use(authMiddleware, roleMiddleware(["admin"]));
router.route("/").get(getSettings).put(updateSettings);

module.exports = router;
