const cron = require("node-cron");
const { sendExpiringSoonReminders } = require("../services/adExpirationReminderService");

function startAdExpirationReminderCron() {
  // Щодня о 09:00
  cron.schedule("0 9 * * *", async () => {
    const startedAt = new Date().toISOString();
    try {
      const result = await sendExpiringSoonReminders();
      console.log(
        `[ad-expiration-reminder-cron] ${startedAt} — надіслано ${result.sent}/${result.total} нагадувань`,
      );
      if (result.errors?.length) {
        console.error(
          `[ad-expiration-reminder-cron] ${result.errors.length} помилок:`,
          result.errors,
        );
      }
    } catch (error) {
      console.error(
        `[ad-expiration-reminder-cron] ${startedAt} — критична помилка:`,
        error.message,
      );
    }
  });

  console.log("[ad-expiration-reminder-cron] Заплановано — щодня о 09:00");
}

module.exports = { startAdExpirationReminderCron };
