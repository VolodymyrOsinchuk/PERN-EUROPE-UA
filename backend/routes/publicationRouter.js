const express = require("express");
const router = express.Router();
const publicationController = require("../controllers/publicationController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authMiddleware");
const PUBLICATION_CATEGORIES = require("../config/publicationCategories");
const staffOnly = [authMiddleware, roleMiddleware(["admin", "moderator"])];
const { optionalAuth } = require("../middleware/authMiddleware");

router.get("/categories", (req, res) => res.json(PUBLICATION_CATEGORIES));

router.get("/", publicationController.getAllPublications);
router.get(
  "/user-publications",
  authMiddleware,
  publicationController.getUserPublications,
);
router.get("/:id", optionalAuth, publicationController.getPublicationById);
router.post("/", authMiddleware, publicationController.createPublication);
router.put("/:id", authMiddleware, publicationController.updatePublication);
router.delete("/:id", authMiddleware, publicationController.deletePublication);

// Маршрути модерації — до "/:id", щоб "moderation" не сприймався як id
router.get(
  "/moderation/queue",
  ...staffOnly,
  publicationController.getModerationQueue,
);
router.get(
  "/moderation/counts",
  ...staffOnly,
  publicationController.getModerationCounts,
);
router.patch(
  "/moderation/:id/publish",
  ...staffOnly,
  publicationController.publishPublication,
);
router.patch(
  "/moderation/:id/needs-changes",
  ...staffOnly,
  publicationController.requestPublicationChanges,
);
router.patch(
  "/moderation/:id/archive",
  ...staffOnly,
  publicationController.archivePublication,
);

module.exports = router;
