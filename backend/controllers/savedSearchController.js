const { SavedSearch } = require("../models/savedSearch");
const { Adv } = require("../models/adv");
const { Op } = require("sequelize");

const buildWhere = (payload) => {
  const where = {};
  if (payload.query) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${payload.query}%` } },
      { description: { [Op.iLike]: `%${payload.query}%` } },
    ];
  }
  if (payload.categoryId) where.categoryId = payload.categoryId;
  if (Number.isFinite(payload.minPrice)) {
    where.price = { ...(where.price || {}), [Op.gte]: payload.minPrice };
  }
  if (Number.isFinite(payload.maxPrice)) {
    where.price = { ...(where.price || {}), [Op.lte]: payload.maxPrice };
  }
  if (payload.country) where.country = payload.country;
  if (payload.state) where.state = payload.state;
  if (payload.city) where.city = payload.city;
  return where;
};

const listSavedSearches = async (req, res) => {
  try {
    const searches = await SavedSearch.findAll({
      where: { userId: req.user.userId },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(searches);
  } catch (error) {
    console.error("Помилка listSavedSearches:", error);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
};

const createSavedSearch = async (req, res) => {
  try {
    const {
      name,
      query,
      categoryId,
      minPrice,
      maxPrice,
      country,
      state,
      city,
    } = req.body;

    const search = await SavedSearch.create({
      userId: req.user.userId,
      name: name || null,
      query: query || null,
      categoryId: categoryId ? parseInt(categoryId, 10) : null,
      minPrice:
        minPrice !== undefined && minPrice !== "" ? parseFloat(minPrice) : null,
      maxPrice:
        maxPrice !== undefined && maxPrice !== "" ? parseFloat(maxPrice) : null,
      country: country || null,
      state: state || null,
      city: city || null,
      isActive: true,
    });

    res.status(201).json({ message: "Пошук збережено", search });
  } catch (error) {
    console.error("Помилка createSavedSearch:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Помилка валідації",
        details: error.errors.map((e) => e.message),
      });
    }
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
};

const toggleSavedSearch = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const search = await SavedSearch.findOne({
      where: { id, userId: req.user.userId },
    });
    if (!search) {
      return res.status(404).json({ error: "Збережений пошук не знайдено" });
    }

    await search.update({ isActive: !search.isActive });
    res.status(200).json({ message: "Оновлено", search });
  } catch (error) {
    console.error("Помилка toggleSavedSearch:", error);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
};

const deleteSavedSearch = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await SavedSearch.destroy({
      where: { id, userId: req.user.userId },
    });
    if (!deleted) {
      return res.status(404).json({ error: "Збережений пошук не знайдено" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Помилка deleteSavedSearch:", error);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
};

/**
 * Повертає оголошення, що відповідають збереженим пошукам користувача
 * (для використання в сповіщеннях).
 */
const findMatchingAds = async (userId, since) => {
  const searches = await SavedSearch.findAll({
    where: { userId, isActive: true },
  });
  if (!searches.length) return [];

  const matched = [];
  for (const search of searches) {
    const raw = search.toJSON ? search.toJSON() : search;
    const where = { ...buildWhere(raw) };
    where.moderationStatus = "approved";
    where.isArchived = false;
    where.status = "Active";
    if (since) where.datePosted = { [Op.gte]: since };

    const ads = await Adv.findAll({ where, limit: 10 });
    for (const ad of ads) {
      matched.push({ searchId: search.id, ad });
    }
  }
  return matched;
};

module.exports = {
  listSavedSearches,
  createSavedSearch,
  toggleSavedSearch,
  deleteSavedSearch,
  findMatchingAds,
  buildWhere,
};
