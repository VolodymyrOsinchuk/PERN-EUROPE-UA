const { Adv } = require("../models/adv");
const { Notification } = require("../models/notification");
const { Op } = require("sequelize");

const DAYS_BEFORE = 3;

/**
 * Находит активні оголошення, у яких термін дії закінчується через
 * DAYS_BEFORE дні, і створює сповіщення ad_expiring_soon для їх власників.
 * Не надсилає нагадку двічі за 7 днів на одне оголошення.
 */
async function sendExpiringSoonReminders() {
  const now = new Date();
  const targetDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + DAYS_BEFORE,
  );
  const startOfDay = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
  );
  const endOfDay = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
    23,
    59,
    59,
  );

  const ads = await Adv.findAll({
    where: {
      status: "Active",
      isArchived: false,
      moderationStatus: "approved",
      expirationDate: { [Op.gte]: startOfDay, [Op.lte]: endOfDay },
    },
    attributes: ["id", "title", "userId", "expirationDate"],
  });

  let sent = 0;
  const errors = [];

  for (const ad of ads) {
    try {
      const alreadyNotified = await Notification.findOne({
        where: {
          userId: ad.userId,
          advId: ad.id,
          type: "ad_expiring_soon",
          createdAt: {
            [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      });
      if (alreadyNotified) continue;

      await Notification.create({
        userId: ad.userId,
        advId: ad.id,
        type: "ad_expiring_soon",
        message: `Термін дії оголошення «${ad.title}» закінчується через ${DAYS_BEFORE} дні. Оновити його, щоб не зникло з пошуку.`,
      });
      sent += 1;
    } catch (err) {
      errors.push({ adId: ad.id, error: err.message });
    }
  }

  return { sent, total: ads.length, errors };
}

module.exports = { sendExpiringSoonReminders, DAYS_BEFORE };
