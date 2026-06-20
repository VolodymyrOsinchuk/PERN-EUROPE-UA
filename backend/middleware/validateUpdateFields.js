const { Category, SubCategory } = require("../models/category");

const validateUpdateFields = async (req, res, next) => {
  try {
    const { title, description, price, categoryId, subcategoryId, status } =
      req.body;

    if (title !== undefined && title.length < 3) {
      return res
        .status(400)
        .json({ error: "Заголовок має містити щонайменше 3 символи" });
    }

    if (description !== undefined && description.length < 10) {
      return res
        .status(400)
        .json({ error: "Опис має містити щонайменше 10 символів" });
    }

    if (
      price !== undefined &&
      price !== "" &&
      (isNaN(price) || parseFloat(price) < 0)
    ) {
      return res
        .status(400)
        .json({ error: "Ціна має бути додатним числом" });
    }

    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(400).json({ error: "Невірна категорія" });
      }
    }

    if (subcategoryId) {
      const subcategory = await SubCategory.findByPk(subcategoryId);
      if (
        !subcategory ||
        (categoryId && subcategory.categoryId !== parseInt(categoryId))
      ) {
        return res.status(400).json({
          error: "Невірна підкатегорія або вона не відповідає категорії",
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
      return res.status(400).json({ error: "Невірний статус" });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validateUpdateFields;
