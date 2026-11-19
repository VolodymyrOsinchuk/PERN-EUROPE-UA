// backend/controllers/faqController.js
const { FaqItem } = require("../models/faqItem");
const { pick } = require("../utils/pick");
const { sanitizeText } = require("../utils/sanitize");

const FIELDS = ["question", "answer", "category", "sortOrder", "isPublished"];
const TEXT_FIELDS = ["question", "answer", "category"];

const parseId = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

// Текст очищаємо від HTML, булеві та числа приводимо до правильного типу
const cleanData = (data) => {
  for (const key of TEXT_FIELDS) {
    if (typeof data[key] === "string") data[key] = sanitizeText(data[key]);
  }
  if (data.category === "") data.category = null;
  if (data.sortOrder !== undefined) {
    data.sortOrder = Number(data.sortOrder) || 0;
  }
  if (data.isPublished !== undefined) {
    data.isPublished = data.isPublished === true || data.isPublished === "true";
  }
  return data;
};

const handleError = (res, error, label) => {
  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({
      message: "Помилка валідації",
      details: error.errors.map((e) => e.message),
    });
  }
  console.error(`Помилка ${label}:`, error);
  return res.status(500).json({ message: "Внутрішня помилка сервера" });
};

// GET /faq — лише опубліковані, для всіх
exports.getPublishedFaq = async (req, res) => {
  try {
    const items = await FaqItem.findAll({
      where: { isPublished: true },
      attributes: ["id", "question", "answer", "category"],
      order: [
        ["sortOrder", "ASC"],
        ["id", "ASC"],
      ],
    });
    res.status(200).json(items);
  } catch (error) {
    handleError(res, error, "getPublishedFaq");
  }
};

// GET /faq/admin — усі питання, включно з прихованими
exports.getAllFaqAdmin = async (req, res) => {
  try {
    const items = await FaqItem.findAll({
      order: [
        ["sortOrder", "ASC"],
        ["id", "ASC"],
      ],
    });
    res.status(200).json(items);
  } catch (error) {
    handleError(res, error, "getAllFaqAdmin");
  }
};

// POST /faq
exports.createFaqItem = async (req, res) => {
  try {
    const data = cleanData(pick(req.body, FIELDS));
    const item = await FaqItem.create({
      ...data,
      updatedBy: req.user.userId,
    });
    res.status(201).json(item);
  } catch (error) {
    handleError(res, error, "createFaqItem");
  }
};

// PUT /faq/:id
exports.updateFaqItem = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Некоректний ідентифікатор" });
    }
    const item = await FaqItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: "Питання не знайдено" });
    }
    const data = cleanData(pick(req.body, FIELDS));
    await item.update({ ...data, updatedBy: req.user.userId });
    res.status(200).json(item);
  } catch (error) {
    handleError(res, error, "updateFaqItem");
  }
};

// DELETE /faq/:id
exports.deleteFaqItem = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Некоректний ідентифікатор" });
    }
    const item = await FaqItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: "Питання не знайдено" });
    }
    await item.destroy();
    res.status(204).send();
  } catch (error) {
    handleError(res, error, "deleteFaqItem");
  }
};
