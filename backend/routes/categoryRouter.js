const express = require("express");
const router = express.Router();
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");
const {
  addSubCategory,
  createCategory,
  deleteCategory,
  deleteSubCategory,
  getAllCategories,
  getCategoryById,
  getSubCategories,
  getSubCategoryById,
  updateCategory,
  updateSubCategory,
} = require("../controllers/categoryController");

router.route("/").post(authMiddleware, roleMiddleware(["admin"]), createCategory).get(getAllCategories);
router
  .route("/:id")
  .get(getCategoryById)
  .put(authMiddleware, roleMiddleware(["admin"]), updateCategory)
  .delete(authMiddleware, roleMiddleware(["admin"]), deleteCategory);

router
  .route("/:categoryId/sub-categories")
  .post(authMiddleware, roleMiddleware(["admin"]), addSubCategory)
  .get(getSubCategories);
router
  .route("/:categoryId/sub-categories/:id")
  .get(getSubCategoryById)
  .put(authMiddleware, roleMiddleware(["admin"]), updateSubCategory)
  .delete(authMiddleware, roleMiddleware(["admin"]), deleteSubCategory);

// router.post("/", categoryController.createCategory);
// router.get("/", categoryController.getAllCategories);
// router.get("/:id", categoryController.getCategoryById);
// router.put("/:id", categoryController.updateCategory);
// router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
