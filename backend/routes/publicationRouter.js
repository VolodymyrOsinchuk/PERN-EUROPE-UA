const express = require("express");
const router = express.Router();
const publicationController = require("../controllers/publicationController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authMiddleware");
const staffOnly = [authMiddleware, roleMiddleware(["admin", "moderator"])];
const { optionalAuth } = require("../middleware/authMiddleware");
const categories = require("../controllers/publicationCategoryController");

router.get("/categories", categories.getPublicCategories);
router.get("/categories/admin", ...staffOnly, categories.getAllCategoriesAdmin);
router.post("/categories", ...staffOnly, categories.createCategory);
router.put("/categories/:id", ...staffOnly, categories.updateCategory);
router.delete("/categories/:id", ...staffOnly, categories.deleteCategory);

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
