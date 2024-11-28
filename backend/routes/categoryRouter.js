const express = require("express");
const router = express.Router();
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

router.route("/").post(createCategory).get(getAllCategories);
router
  .route("/:id")
  .get(getCategoryById)
  .put(updateCategory)
  .delete(deleteCategory);

// Nouvelles routes pour les sous-catégories
router
  .route("/:categoryId/sub-categories")
  .post(addSubCategory)
  .get(getSubCategories);
router
  .route("/:categoryId/sub-categories/:id")
  .get(getSubCategoryById)
  .put(updateSubCategory)
  .delete(deleteSubCategory);

// router.post("/", categoryController.createCategory);
// router.get("/", categoryController.getAllCategories);
// router.get("/:id", categoryController.getCategoryById);
// router.put("/:id", categoryController.updateCategory);
// router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
