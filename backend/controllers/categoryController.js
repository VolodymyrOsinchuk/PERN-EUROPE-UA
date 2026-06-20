const { Category, SubCategory } = require("../models/category");
const { pick } = require("../utils/pick");

exports.createCategory = async (req, res) => {
  try {
    const allowed = pick(req.body, ["name"]);
    const category = await Category.create(allowed);
    res.status(201).json(category);
  } catch (error) {
    console.error("Помилка createCategory:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Помилка валідації",
        details: error.errors.map((e) => e.message),
      });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ include: SubCategory });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Помилка getAllCategories:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id, {
      include: SubCategory,
    });
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: "Категорію не знайдено" });
    }
  } catch (error) {
    console.error("Помилка getCategoryById:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const [updated] = await Category.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedCategorie = await Category.findByPk(req.params.id);
      res.status(200).json(updatedCategorie);
    } else {
      res.status(404).json({ message: "Категорію не знайдено" });
    }
  } catch (error) {
    console.error("Помилка updateCategory:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Категорію не знайдено" });
    }
  } catch (error) {
    console.error("Помилка deleteCategory:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.addSubCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;

    const parentCategory = await Category.findByPk(categoryId);

    if (!parentCategory) {
      return res
        .status(404)
        .json({ message: "Батьківську категорію не знайдено" });
    }

    const newCategory = await SubCategory.create({
      name,
      categoryId,
    });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Помилка addSubCategory:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getSubCategories = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const sousCategories = await SubCategory.findAll({
      where: { categoryId },
    });
    res.status(200).json(sousCategories);
  } catch (error) {
    console.error("Помилка getSubCategories:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getSubCategoryById = async (req, res) => {
  try {
    const { categoryId, id } = req.params;
    const parentCategory = await Category.findByPk(categoryId);

    if (!parentCategory) {
      return res
        .status(404)
        .json({ message: "Батьківську категорію не знайдено" });
    }
    const sousCategories = await SubCategory.findByPk(id);
    res.status(200).json(sousCategories);
  } catch (error) {
    console.error("Помилка getSubCategoryById:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, categoryId } = req.body;

    // FIX P1-3: interroger SubCategory, pas Category — l'ancien code
    // appelait Category.findByPk(id) sur un id de sous-catégorie, ce qui
    // ne pouvait jamais fonctionner correctement.
    const sousCategorie = await SubCategory.findByPk(id);
    if (!sousCategorie) {
      return res.status(404).json({ message: "Підкатегорію не знайдено" });
    }

    // Si categoryId est fourni, vérifier qu'elle existe
    if (categoryId !== undefined) {
      const parentCategory = await Category.findByPk(categoryId);
      if (!parentCategory) {
        return res
          .status(400)
          .json({ message: "Батьківську категорію не знайдено" });
      }
    }

    await sousCategorie.update({
      name: name ?? sousCategorie.name,
      categoryId: categoryId ?? sousCategorie.categoryId,
    });
    res.status(200).json(sousCategorie);
  } catch (error) {
    console.error("Помилка updateSubCategory:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // FIX P1-3: interroger SubCategory, pas Category
    const sousCategorie = await SubCategory.findByPk(id);

    if (!sousCategorie) {
      return res.status(404).json({ message: "Підкатегорію не знайдено" });
    }

    await sousCategorie.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Помилка deleteSubCategory:", error);
    res.status(500).json({ error: error.message });
  }
};
