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

    const statusMap = {
      Active: "Active",
      Inactive: "Inactive",
      Sold: "Sold",
      Actif: "Active",
      Inactif: "Inactive",
      Vendu: "Sold",
    };
    if (status !== undefined) {
      if (!statusMap[status]) {
        return res.status(400).json({ error: "Невірний статус" });
      }
      req.body.status = statusMap[status];
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validateUpdateFields;
