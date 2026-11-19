const { Notification } = require("../models/notification");
const { SavedSearch } = require("../models/savedSearch");
const { Adv } = require("../models/adv");
const { Op } = require("sequelize");

const buildWhere = (search) => {
  const where = {};
  if (search.query) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search.query}%` } },
      { description: { [Op.iLike]: `%${search.query}%` } },
    ];
  }
  if (search.categoryId) where.categoryId = search.categoryId;
  if (Number.isFinite(search.minPrice)) {
    where.price = { ...(where.price || {}), [Op.gte]: search.minPrice };
  }
  if (Number.isFinite(search.maxPrice)) {
    where.price = { ...(where.price || {}), [Op.lte]: search.maxPrice };
  }
  if (search.country) where.country = search.country;
  if (search.state) where.state = search.state;
  if (search.city) where.city = search.city;
  return where;
};

/**
 * Після схвалення оголошення знаходить активні збережені пошуки, що їм
 * відповідають, і створює сповіщення "new_ad_match" для їх власників.
 * Очікується, що викликається всередині транзакції зміни статусу.
 */
async function notifyNewAdMatches({ advId, transaction }) {
  const ad = await Adv.findByPk(advId);
  if (!ad) return;

  const searches = await SavedSearch.findAll({ where: { isActive: true } });
  if (!searches.length) return;

  const notifications = [];
  for (const search of searches) {
    const where = { ...buildWhere(search) };
    where.moderationStatus = "approved";
    where.isArchived = false;
    where.status = "Active";
    where.id = ad.id; // перевіряємо, чи підходить це саме оголошення

    const match = await Adv.findOne({ where });
    if (!match) continue;

    notifications.push({
      userId: search.userId,
      advId: ad.id,
      type: "new_ad_match",
      message: `Нове оголошення «${ad.title}» відповідає одному із ваших збережених пошуків.`,
    });
  }

  if (notifications.length) {
    await Notification.bulkCreate(notifications, { transaction });
  }
}

module.exports = { notifyNewAdMatches };
