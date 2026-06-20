const { AdvExpirationSetting } = require("../models/advExpirationSetting");
const { Adv } = require("../models/adv");
const { deleteCloudinaryFile } = require("../config/cloudinary");
const { Op } = require("sequelize");

const PRESET_DAYS = {
  "1_week": 7,
  "1_month": 30,
  // "custom" utilise directement durationDays tel quel
};

/**
 * Récupère le réglage unique (singleton). Le crée avec des valeurs par
 * défaut désactivées s'il n'existe pas encore.
 */
async function getSettings() {
  let settings = await AdvExpirationSetting.findOne({ order: [["id", "ASC"]] });
  if (!settings) {
    settings = await AdvExpirationSetting.create({});
  }
  return settings;
}

/**
 * Met à jour le réglage unique. Crée la ligne si elle n'existe pas encore.
 */
async function updateSettings(payload, userId) {
  const settings = await getSettings();

  const durationDays =
    payload.durationPreset && payload.durationPreset !== "custom"
      ? PRESET_DAYS[payload.durationPreset]
      : payload.durationDays;

  await settings.update({
    enabled: payload.enabled ?? settings.enabled,
    durationPreset: payload.durationPreset ?? settings.durationPreset,
    durationDays: durationDays ?? settings.durationDays,
    action: payload.action ?? settings.action,
    updatedBy: userId,
  });

  return settings;
}

/**
 * Traite les annonces actives dont la date d'expiration est dépassée,
 * selon l'action configurée (archive / delete / hide).
 * Retourne un résumé pour la journalisation du cron.
 */
async function processExpiredAds() {
  const settings = await getSettings();

  if (!settings.enabled) {
    return { skipped: true, reason: "disabled", processed: 0 };
  }

  const expiredAds = await Adv.findAll({
    where: {
      status: "Active",
      isArchived: false,
      expirationDate: { [Op.lt]: new Date() },
    },
  });

  if (expiredAds.length === 0) {
    return { skipped: false, processed: 0 };
  }

  let processed = 0;
  const errors = [];

  for (const ad of expiredAds) {
    try {
      switch (settings.action) {
        case "delete":
          if (ad.photos?.length) {
            await Promise.all(
              ad.photos.map((url) => deleteCloudinaryFile(url)),
            );
          }
          await ad.destroy();
          break;

        case "hide":
          await ad.update({ status: "Inactive" });
          break;

        case "archive":
        default:
          await ad.update({ isArchived: true, archivedAt: new Date() });
          break;
      }
      processed += 1;
    } catch (err) {
      errors.push({ adId: ad.id, error: err.message });
    }
  }

  return {
    skipped: false,
    processed,
    total: expiredAds.length,
    errors,
    action: settings.action,
  };
}

module.exports = {
  getSettings,
  updateSettings,
  processExpiredAds,
  PRESET_DAYS,
};
