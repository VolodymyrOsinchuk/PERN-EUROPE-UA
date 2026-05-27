const { Category, SubCategory } = require("../models/category");

const validateUpdateFields = async (req, res, next) => {
  try {
    const { title, description, price, categoryId, subcategoryId, status } =
      req.body;

    if (title !== undefined && title.length < 3) {
      return res
        .status(400)
        .json({ error: "Le titre doit contenir au moins 3 caractères" });
    }

    if (description !== undefined && description.length < 10) {
      return res
        .status(400)
        .json({ error: "La description doit contenir au moins 10 caractères" });
    }

    if (
      price !== undefined &&
      price !== "" &&
      (isNaN(price) || parseFloat(price) < 0)
    ) {
      return res
        .status(400)
        .json({ error: "Le prix doit être un nombre positif" });
    }

    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(400).json({ error: "Catégorie invalide" });
      }
    }

    if (subcategoryId) {
      const subcategory = await SubCategory.findByPk(subcategoryId);
      if (
        !subcategory ||
        (categoryId && subcategory.categoryId !== parseInt(categoryId))
      ) {
        return res.status(400).json({
          error: "Sous-catégorie invalide ou ne correspond pas à la catégorie",
        });
      }
    }

    // FIX: accept both English and French status values
    const validStatus = [
      "Active",
      "Inactive",
      "Sold",
      "Actif",
      "Inactif",
      "Vendu",
    ];
    if (status !== undefined && !validStatus.includes(status)) {
      return res.status(400).json({ error: "Statut invalide" });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validateUpdateFields;
