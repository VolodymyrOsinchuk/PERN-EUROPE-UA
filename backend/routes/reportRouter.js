const express = require("express");
const router = express.Router();
const {
  createReport,
  getReports,
  resolveReport,
} = require("../controllers/reportController");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");

// POST /api/v1/reports — signaler une annonce (utilisateur connecté)
router.post("/", authMiddleware, createReport);

// Admin : lister les signalements + marquer comme résolu
router.get("/", authMiddleware, roleMiddleware(["admin"]), getReports);
router.patch("/:id/resolve", authMiddleware, roleMiddleware(["admin"]), resolveReport);

module.exports = router;
