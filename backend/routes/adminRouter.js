const express = require("express");
const router = express.Router();
const {
  getAdmins,
  createAdmin,
  updateAdmin,
  updateAdminRole,
  deleteAdmin,
  getSystemInfo,
} = require("../controllers/adminController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authMiddleware");

router.use(authMiddleware, roleMiddleware(["admin"]));

router.get("/admins", getAdmins);
router.post("/admins", createAdmin);
router.put("/admins/:id", updateAdmin);
router.put("/admins/:id/role", updateAdminRole);
router.delete("/admins/:id", deleteAdmin);
router.get("/system-info", getSystemInfo);

module.exports = router;
