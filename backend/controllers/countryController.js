// backend/controllers/countryController.js
const {
  CountryPage,
  CountryLink,
  COUNTRY_LINK_CATEGORIES,
} = require("../models/country");
const { pick } = require("../utils/pick");
const { sanitizeText } = require("../utils/sanitize");

const PAGE_FIELDS = ["name", "flag", "disclaimer", "isPublished"];
const LINK_FIELDS = ["category", "title", "url", "description", "sortOrder"];
const TEXT_FIELDS = ["name", "flag", "disclaimer", "title", "description"];
const LINKS_INCLUDE = {
  model: CountryLink,
  as: "links",
  separate: true,
  order: [
    ["sortOrder", "ASC"],
    ["id", "ASC"],
  ],
};

const parseCode = (value) => {
  const code = String(value || "")
    .trim()
    .toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : null;
};

const parseId = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

// Текст очищаємо від HTML, булеві та числа приводимо до правильного типу
const cleanData = (data) => {
  for (const key of TEXT_FIELDS) {
    if (typeof data[key] === "string") data[key] = sanitizeText(data[key]);
  }
  if (data.isPublished !== undefined) {
    data.isPublished = data.isPublished === true || data.isPublished === "true";
  }
  if (data.sortOrder !== undefined) {
    data.sortOrder = Number(data.sortOrder) || 0;
  }
  return data;
};

const touchCountry = (code, date, userId) =>
  CountryPage.update(
    { lastVerifiedAt: date, updatedBy: userId },
    { where: { code } },
  );

const handleError = (res, error, label) => {
  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({
      message: "Помилка валідації",
      details: error.errors.map((e) => e.message),
    });
  }
  if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({ message: "Країна з таким кодом уже існує" });
  }
  console.error(`Помилка ${label}:`, error);
  return res.status(500).json({ message: "Внутрішня помилка сервера" });
};

// ── Публічні ─────────────────────────────────────────────

// GET /countries — список опублікованих країн
exports.getPublishedCountries = async (req, res) => {
  try {
    const countries = await CountryPage.findAll({
      where: { isPublished: true },
      attributes: ["code", "name", "flag", "lastVerifiedAt"],
      order: [["name", "ASC"]],
    });
    res.status(200).json(countries);
  } catch (error) {
    handleError(res, error, "getPublishedCountries");
  }
};

// GET /countries/:code — сторінка країни з посиланнями
exports.getPublishedCountry = async (req, res) => {
  try {
    const code = parseCode(req.params.code);
    if (!code) {
      return res.status(400).json({ message: "Некоректний код країни" });
    }
    const country = await CountryPage.findOne({
      where: { code, isPublished: true },
      include: [LINKS_INCLUDE],
    });
    if (!country) {
      return res.status(404).json({ message: "Країну не знайдено" });
    }
    res.status(200).json(country);
  } catch (error) {
    handleError(res, error, "getPublishedCountry");
  }
};

// ── Для admin і moderator ────────────────────────────────

// GET /countries/admin/all — усі країни, включно з неопублікованими
exports.getAllCountriesAdmin = async (req, res) => {
  try {
    const countries = await CountryPage.findAll({
      include: [LINKS_INCLUDE],
      order: [["name", "ASC"]],
    });
    res.status(200).json({
      countries,
      categories: COUNTRY_LINK_CATEGORIES,
    });
  } catch (error) {
    handleError(res, error, "getAllCountriesAdmin");
  }
};

// POST /countries — нова сторінка країни
exports.createCountry = async (req, res) => {
  try {
    const code = parseCode(req.body?.code);
    if (!code) {
      return res
        .status(400)
        .json({ message: "Код країни має складатися з двох латинських літер" });
    }
    const data = cleanData(pick(req.body, PAGE_FIELDS));
    const country = await CountryPage.create({
      ...data,
      code,
      updatedBy: req.user.userId,
    });
    res.status(201).json(country);
  } catch (error) {
    handleError(res, error, "createCountry");
  }
};

// PUT /countries/:code — змінити назву, прапор, застереження, публікацію
exports.updateCountry = async (req, res) => {
  try {
    const code = parseCode(req.params.code);
    if (!code) {
      return res.status(400).json({ message: "Некоректний код країни" });
    }
    const country = await CountryPage.findByPk(code);
    if (!country) {
      return res.status(404).json({ message: "Країну не знайдено" });
    }
    const data = cleanData(pick(req.body, PAGE_FIELDS));
    await country.update({ ...data, updatedBy: req.user.userId });
    res.status(200).json(country);
  } catch (error) {
    handleError(res, error, "updateCountry");
  }
};

// POST /countries/:code/links — нове посилання (дата перевірки = зараз)
exports.createLink = async (req, res) => {
  try {
    const code = parseCode(req.params.code);
    if (!code) {
      return res.status(400).json({ message: "Некоректний код країни" });
    }
    const country = await CountryPage.findByPk(code);
    if (!country) {
      return res.status(404).json({ message: "Країну не знайдено" });
    }
    const now = new Date();
    const data = cleanData(pick(req.body, LINK_FIELDS));
    const link = await CountryLink.create({
      ...data,
      countryCode: code,
      lastVerifiedAt: now,
      verifiedBy: req.user.userId,
    });
    await touchCountry(code, now, req.user.userId);
    res.status(201).json(link);
  } catch (error) {
    handleError(res, error, "createLink");
  }
};

// PUT /countries/links/:id — змінити посилання
// Нова адреса (url) означає нову перевірку джерела, інші зміни — ні.
exports.updateLink = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Некоректний ідентифікатор" });
    }
    const link = await CountryLink.findByPk(id);
    if (!link) {
      return res.status(404).json({ message: "Посилання не знайдено" });
    }
    const now = new Date();
    const data = cleanData(pick(req.body, LINK_FIELDS));
    const urlChanged = data.url !== undefined && data.url !== link.url;
    if (urlChanged) {
      data.lastVerifiedAt = now;
      data.verifiedBy = req.user.userId;
    }
    await link.update(data);
    if (urlChanged) {
      await touchCountry(link.countryCode, now, req.user.userId);
    }
    res.status(200).json(link);
  } catch (error) {
    handleError(res, error, "updateLink");
  }
};

// PATCH /countries/links/:id/verify — «Перевірено сьогодні»
exports.verifyLink = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Некоректний ідентифікатор" });
    }
    const link = await CountryLink.findByPk(id);
    if (!link) {
      return res.status(404).json({ message: "Посилання не знайдено" });
    }
    const now = new Date();
    await link.update({ lastVerifiedAt: now, verifiedBy: req.user.userId });
    await touchCountry(link.countryCode, now, req.user.userId);
    res.status(200).json(link);
  } catch (error) {
    handleError(res, error, "verifyLink");
  }
};

// DELETE /countries/links/:id
exports.deleteLink = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Некоректний ідентифікатор" });
    }
    const link = await CountryLink.findByPk(id);
    if (!link) {
      return res.status(404).json({ message: "Посилання не знайдено" });
    }
    await link.destroy();
    res.status(204).send();
  } catch (error) {
    handleError(res, error, "deleteLink");
  }
};
