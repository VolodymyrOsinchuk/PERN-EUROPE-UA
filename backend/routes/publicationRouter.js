const express = require("express");
const router = express.Router();
const publicationController = require("../controllers/publicationController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", publicationController.getAllPublications);
router.get("/:id", publicationController.getPublicationById);
router.post("/", authMiddleware, publicationController.createPublication);
router.put("/:id", authMiddleware, publicationController.updatePublication);
router.delete("/:id", authMiddleware, publicationController.deletePublication);

module.exports = router;
