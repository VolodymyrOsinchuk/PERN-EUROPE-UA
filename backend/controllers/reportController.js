const { Report } = require("../models/report");
const { Adv } = require("../models/adv");
const { User } = require("../models/user");

exports.createReport = async (req, res) => {
  try {
    const { advId, reason, details } = req.body;

    if (!advId || !reason) {
      return res
        .status(400)
        .json({ error: "advId та reason є обов'язковими" });
    }

    const adv = await Adv.findByPk(advId);
    if (!adv) {
      return res.status(404).json({ error: "Оголошення не знайдено" });
    }

    // Une seule plainte active par utilisateur/annonce
    const existing = await Report.findOne({
      where: { advId, userId: req.user.userId, status: "pending" },
    });
    if (existing) {
      return res
        .status(409)
        .json({ error: "Ви вже надіслали скаргу на це оголошення" });
    }

    const report = await Report.create({
      advId,
      userId: req.user.userId,
      reason,
      details: details || null,
    });

    res.status(201).json({
      message: "Скаргу надіслано на модерацію",
      report,
    });
  } catch (error) {
    console.error("Помилка createReport:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Помилка валідації",
        details: error.errors.map((e) => e.message),
      });
    }
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
};

exports.getReports = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;

    const reports = await Report.findAll({
      where,
      include: [
        {
          model: Adv,
          as: "ad",
          attributes: ["id", "title", "status"],
        },
        {
          model: User,
          as: "reporter",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(reports);
  } catch (error) {
    console.error("Помилка getReports:", error);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
};

exports.resolveReport = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({ error: "Скаргу не знайдено" });
    }

    await report.update({ status: "resolved" });
    res.status(200).json({ message: "Скаргу оброблено", report });
  } catch (error) {
    console.error("Помилка resolveReport:", error);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
};
