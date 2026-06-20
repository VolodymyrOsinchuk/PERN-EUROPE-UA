const {
  getSettings,
  updateSettings,
  processExpiredAds,
} = require("../services/adExpirationSettingsService");

exports.getAdExpirationSettings = async (req, res) => {
  try {
    const settings = await getSettings();
    res.status(200).json(settings);
  } catch (error) {
    console.error("Помилка getAdExpirationSettings:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateAdExpirationSettings = async (req, res) => {
  try {
    const { enabled, durationPreset, durationDays, action } = req.body;

    if (
      durationPreset &&
      !["1_week", "1_month", "custom"].includes(durationPreset)
    ) {
      return res.status(400).json({ message: "Невірний пресет тривалості" });
    }
    if (action && !["archive", "delete", "hide"].includes(action)) {
      return res.status(400).json({ message: "Невірна дія" });
    }
    if (
      durationPreset === "custom" &&
      (durationDays === undefined || durationDays < 1 || durationDays > 365)
    ) {
      return res
        .status(400)
        .json({ message: "Кількість днів має бути від 1 до 365" });
    }

    const settings = await updateSettings(
      { enabled, durationPreset, durationDays, action },
      req.user.userId,
    );

    res.status(200).json(settings);
  } catch (error) {
    console.error("Помилка updateAdExpirationSettings:", error);
    res.status(500).json({ error: error.message });
  }
};

// Endpoint manuel — utile pour tester en environnement de recette sans
// attendre le prochain déclenchement horaire du cron.
exports.runExpirationNow = async (req, res) => {
  try {
    const result = await processExpiredAds();
    res.status(200).json(result);
  } catch (error) {
    console.error("Помилка runExpirationNow:", error);
    res.status(500).json({ error: error.message });
  }
};
