const { Settings } = require("../models/settings");

exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ order: [["id", "ASC"]] });
    if (!settings) {
      settings = await Settings.create({});
    }
    res.status(200).json(settings);
  } catch (error) {
    console.error("Помилка getSettings:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { siteTitle, supportEmail } = req.body;
    let settings = await Settings.findOne({ order: [["id", "ASC"]] });
    if (!settings) {
      settings = await Settings.create({
        siteTitle: siteTitle || "PERN EUROPE UA",
        supportEmail: supportEmail || "support@example.com",
        updatedBy: req.user?.userId,
      });
    } else {
      await settings.update({
        siteTitle: siteTitle ?? settings.siteTitle,
        supportEmail: supportEmail ?? settings.supportEmail,
        updatedBy: req.user?.userId,
      });
    }
    res.status(200).json(settings);
  } catch (error) {
    console.error("Помилка updateSettings:", error);
    res.status(500).json({ error: error.message });
  }
};
