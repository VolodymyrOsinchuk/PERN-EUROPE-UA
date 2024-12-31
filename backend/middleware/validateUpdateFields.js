const { Category, SubCategory } = require("../models/category");

// Middleware de validation des champs
const validateUpdateFields = async (req, res, next) => {
  try {
    const { title, description, price, categoryId, subcategoryId, status } =
      req.body;

    // Validation des champs si présents
    if (title && title.length < 3) {
      return res
        .status(400)
        .json({ error: "Le titre doit contenir au moins 3 caractères" });
    }

    if (description && description.length < 10) {
      return res
        .status(400)
        .json({ error: "La description doit contenir au moins 10 caractères" });
    }

    if (price && (isNaN(price) || price < 0)) {
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

    const validStatus = ["Actif", "Inactif", "Vendu"];
    if (status && !validStatus.includes(status)) {
      return res.status(400).json({ error: "Statut invalide" });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validateUpdateFields;
