// backend/controllers/publicationCategoryController.js
const { Op, fn, col } = require("sequelize");
const sequelize = require("../config/db");
const { PublicationCategory } = require("../models/publicationCategory");
const { Publication } = require("../models/publication");
const { sanitizeText } = require("../utils/sanitize");

const NAME_MIN = 2;
const NAME_MAX = 100;

const parseId = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

const cleanName = (value) => {
  if (typeof value !== "string") return null;
  const name = sanitizeText(value).replace(/\s+/g, " ").trim();
  return name.length >= NAME_MIN && name.length <= NAME_MAX ? name : null;
};

const ORDER = [
  ["sortOrder", "ASC"],
  ["id", "ASC"],
];

const handleError = (res, error, label) => {
  if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({ message: "Така категорія вже існує" });
  }
  console.error(`Помилка ${label}:`, error);
  return res.status(500).json({ message: "Внутрішня помилка сервера" });
};

// Використовується в publicationController для перевірки категорії
exports.getActiveCategoryNames = async () => {
  const rows = await PublicationCategory.findAll({
    where: { isActive: true },
    attributes: ["name"],
    order: ORDER,
    raw: true,
  });
  return rows.map((r) => r.name);
};

// GET /publications/categories — публічний список, масив назв (як раніше)
exports.getPublicCategories = async (req, res) => {
  try {
    res.status(200).json(await exports.getActiveCategoryNames());
  } catch (error) {
    handleError(res, error, "getPublicCategories");
  }
};

// GET /publications/categories/admin — усі категорії з кількістю публікацій
exports.getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await PublicationCategory.findAll({ order: ORDER });
    const counts = await Publication.findAll({
      attributes: ["category", [fn("COUNT", col("id")), "count"]],
      group: ["category"],
      raw: true,
    });
    const countMap = Object.fromEntries(
      counts.map((r) => [r.category, Number(r.count)]),
    );
    res.status(200).json(
      categories.map((c) => ({
        ...c.get({ plain: true }),
        publicationsCount: countMap[c.name] || 0,
      })),
    );
  } catch (error) {
    handleError(res, error, "getAllCategoriesAdmin");
  }
};

// POST /publications/categories  { name, sortOrder }
exports.createCategory = async (req, res) => {
  try {
    const name = cleanName(req.body?.name);
    if (!name) {
      return res
        .status(400)
        .json({ message: "Назва має містити від 2 до 100 символів" });
    }
    const category = await PublicationCategory.create({
      name,
      sortOrder: Number(req.body?.sortOrder) || 0,
      isActive: true,
    });
    res.status(201).json(category);
  } catch (error) {
    handleError(res, error, "createCategory");
  }
};

// PUT /publications/categories/:id  { name, sortOrder, isActive }
// Перейменування оновлює і вже опубліковані статті з цією категорією.
exports.updateCategory = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Некоректний ідентифікатор" });
    }
    const category = await PublicationCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Категорію не знайдено" });
    }

    const data = {};
    if (req.body?.name !== undefined) {
      const name = cleanName(req.body.name);
      if (!name) {
        return res
          .status(400)
          .json({ message: "Назва має містити від 2 до 100 символів" });
      }
      data.name = name;
    }
    if (req.body?.sortOrder !== undefined) {
      data.sortOrder = Number(req.body.sortOrder) || 0;
    }
    if (req.body?.isActive !== undefined) {
      data.isActive =
        req.body.isActive === true || req.body.isActive === "true";
    }

    const oldName = category.name;
    const renamed = data.name !== undefined && data.name !== oldName;

    if (renamed) {
      const taken = await PublicationCategory.findOne({
        where: { name: data.name, id: { [Op.ne]: category.id } },
        attributes: ["id"],
      });
      if (taken) {
        return res.status(409).json({ message: "Така категорія вже існує" });
      }
    }

    await sequelize.transaction(async (t) => {
      await category.update(data, { transaction: t });
      if (renamed) {
        await Publication.update(
          { category: data.name },
          { where: { category: oldName }, transaction: t },
        );
      }
    });

    res.status(200).json(category);
  } catch (error) {
    handleError(res, error, "updateCategory");
  }
};

// DELETE /publications/categories/:id
// Категорію, яку використовують публікації, не видаляємо — її можна лише вимкнути.
exports.deleteCategory = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Некоректний ідентифікатор" });
    }
    const category = await PublicationCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Категорію не знайдено" });
    }

    const used = await Publication.count({
      where: { category: category.name },
    });
    if (used > 0) {
      return res.status(409).json({
        message: `Категорію використовують ${used} публікацій. Вимкніть її замість видалення.`,
        publicationsCount: used,
      });
    }

    await category.destroy();
    res.status(204).send();
  } catch (error) {
    handleError(res, error, "deleteCategory");
  }
};
