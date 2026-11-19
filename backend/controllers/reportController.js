const { Report } = require("../models/report");
const { Adv } = require("../models/adv");
const { User } = require("../models/user");

exports.createReport = async (req, res) => {
  try {
    const { advId, reportedUserId, reason, details } = req.body;

    if (!reason) {
      return res.status(400).json({ error: "Причина скарги обов'язкова" });
    }
    if (!advId && !reportedUserId) {
      return res.status(400).json({
        error: "Вкажіть оголошення (advId) або користувача (reportedUserId)",
      });
    }

    if (advId) {
      const adv = await Adv.findByPk(advId);
      if (!adv) {
        return res.status(404).json({ error: "Оголошення не знайдено" });
      }
    }

    if (reportedUserId) {
      const reportedUser = await User.findByPk(reportedUserId);
      if (!reportedUser) {
        return res.status(404).json({ error: "Користувача не знайдено" });
      }
      if (reportedUser.id === req.user.userId) {
        return res.status(400).json({ error: "Не можна скаржитися на себе" });
      }
    }

    const existing = await Report.findOne({
      where: {
        advId: advId || null,
        reportedUserId: reportedUserId || null,
        userId: req.user.userId,
        status: "pending",
      },
    });
    if (existing) {
      return res
        .status(409)
        .json({ error: "Ви вже надіслали скаргу на це" });
    }

    const report = await Report.create({
      advId: advId || null,
      reportedUserId: reportedUserId || null,
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
    const report = await Report.findByPk(req.params.id, {
      include: [{ model: Adv, as: "ad" }, { model: User, as: "reportedUser" }],
    });
    if (!report) {
      return res.status(404).json({ error: "Скаргу не знайдено" });
    }

    const { action } = req.body;
    const allowedActions = [
      "no_action",
      "hide_ad",
      "reject_ad",
      "warn_user",
      "ban_user",
    ];
    if (action && !allowedActions.includes(action)) {
      return res.status(400).json({ error: "Недійсна дія" });
    }

    const performed = [];

    if (report.ad && (action === "hide_ad" || action === "reject_ad")) {
      if (action === "hide_ad") {
        await report.ad.update({ status: "Inactive" });
        performed.push(`оголошення #${report.ad.id} приховано`);
      } else {
        await report.ad.update({ status: "Sold" });
        performed.push(`оголошення #${report.ad.id} позначено як продане`);
      }
    }

    if (report.reportedUser && (action === "warn_user" || action === "ban_user")) {
      performed.push(
        action === "warn_user"
          ? `користувача #${report.reportedUserId} попереджено`
          : `користувача #${report.reportedUserId} заблоковано`,
      );
    }

    await report.update({
      status: "resolved",
      action: action || "no_action",
    });

    res.status(200).json({
      message: "Скаргу оброблено",
      report,
      performed,
    });
  } catch (error) {
    console.error("Помилка resolveReport:", error);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
};
