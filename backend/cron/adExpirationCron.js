const cron = require("node-cron");
const {
  processExpiredAds,
} = require("../services/adExpirationSettingsService");

function startAdExpirationCron() {
  // Toutes les heures, à la minute 0
  cron.schedule("0 * * * *", async () => {
    const startedAt = new Date().toISOString();
    try {
      const result = await processExpiredAds();
      if (result.skipped) {
        console.log(
          `[ad-expiration-cron] ${startedAt} — пропущено (${result.reason})`,
        );
      } else {
        console.log(
          `[ad-expiration-cron] ${startedAt} — оброблено ${result.processed}/${result.total} оголошень (дія: ${result.action})`,
        );
        if (result.errors?.length) {
          console.error(
            `[ad-expiration-cron] ${result.errors.length} помилок:`,
            result.errors,
          );
        }
      }
    } catch (error) {
      console.error(
        `[ad-expiration-cron] ${startedAt} — критична помилка:`,
        error.message,
      );
    }
  });

  console.log("[ad-expiration-cron] Заплановано — запуск щогодини");
}

module.exports = { startAdExpirationCron };
