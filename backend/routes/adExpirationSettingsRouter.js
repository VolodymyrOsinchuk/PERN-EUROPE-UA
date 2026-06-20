const express = require("express");
const router = express.Router();
const {
  getAdExpirationSettings,
  updateAdExpirationSettings,
  runExpirationNow,
} = require("../controllers/adExpirationSettingsController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authMiddleware");

router.use(authMiddleware, roleMiddleware(["admin"]));

router.route("/").get(getAdExpirationSettings).put(updateAdExpirationSettings);
router.post("/run-now", runExpirationNow);

module.exports = router;
