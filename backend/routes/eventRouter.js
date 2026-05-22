const express = require("express");
const router = express.Router();
const publicationController = require("../controllers/publicationController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Routes publiques
router.get("/", publicationController.getAllPublications);

// Route authentifiée — IMPORTANT: "user-publications" AVANT "/:id"
router.get(
  "/user-publications",
  authMiddleware,
  publicationController.getUserPublications,
);

// CRUD avec auth
router.get("/:id", publicationController.getPublicationById);
router.post("/", authMiddleware, publicationController.createPublication);
router.put("/:id", authMiddleware, publicationController.updatePublication);
router.delete("/:id", authMiddleware, publicationController.deletePublication);

module.exports = router;
