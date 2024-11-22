const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const {
  addSubCategory,
  createCategory,
  deleteCategory,
  deleteSubCategory,
  getAllCategories,
  getCategoryById,
  getSubCategories,
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
router.post("/:parentId/sub-categories", addSubCategory);
router.get("/:parentId/sub-categories", getSubCategories);
router.put("/sub-categories/:id", updateSubCategory);
router.delete("/sub-categories/:id", deleteSubCategory);

// router.post("/", categoryController.createCategory);
// router.get("/", categoryController.getAllCategories);
// router.get("/:id", categoryController.getCategoryById);
// router.put("/:id", categoryController.updateCategory);
// router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
