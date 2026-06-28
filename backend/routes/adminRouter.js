const express = require("express");
const router = express.Router();
const {
  getAdmins,
  createAdmin,
  updateAdminRole,
  deleteAdmin,
  getSystemInfo,
  toggleMaintenance,
  clearCache,
  backupDb,
} = require("../controllers/adminController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authMiddleware");

router.use(authMiddleware, roleMiddleware(["admin"]));

router.get("/admins", getAdmins);
router.post("/admins", createAdmin);
router.put("/admins/:id/role", updateAdminRole);
router.delete("/admins/:id", deleteAdmin);
router.get("/system-info", getSystemInfo);
router.post("/maintenance", toggleMaintenance);
router.post("/clear-cache", clearCache);
router.post("/backup", backupDb);

module.exports = router;
