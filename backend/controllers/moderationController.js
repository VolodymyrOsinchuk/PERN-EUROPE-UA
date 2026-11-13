const sequelize = require("../config/db");
const { Adv } = require("../models/adv");
const { Category } = require("../models/category");
const { User } = require("../models/user");
const { notifyAdOwner } = require("../services/notificationService");
const { ModerationLog } = require("../models/moderationLog");

const LIST_STATUSES = ["pending", "needs_changes", "rejected", "approved"];

// Seules les transitions listées ici sont autorisées.
const TRANSITIONS = {
  pending: ["approved", "rejected", "needs_changes"],
};

// ── Utilitaires ──────────────────────────────────────────

const httpError = (status, message) =>
  Object.assign(new Error(message), { status });

const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const cleanReason = (value) => {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text.length >= 5 && text.length <= 1000 ? text : null;
};

const sendError = (res, error, label) => {
  if (error.status) {
    return res.status(error.status).json({ message: error.message });
  }
  console.error(`Помилка ${label}:`, error);
  return res.status(500).json({ message: "Внутрішня помилка сервера" });
};

const wrap = (fn, label) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    sendError(res, error, label);
  }
};

// ── Cœur de la logique ───────────────────────────────────

async function changeModerationStatus(adv, newStatus, { moderatorId, reason }) {
  const previousStatus = adv.moderationStatus;

  if (!(TRANSITIONS[previousStatus] || []).includes(newStatus)) {
    throw httpError(
      409,
      `Недопустима зміна статусу: ${previousStatus} → ${newStatus}`,
    );
  }

  const now = new Date();
  const changes = {
    moderationStatus: newStatus,
    moderatedBy: moderatorId,
    moderatedAt: now,
    moderationReason: reason,
  };
  if (newStatus === "approved") {
    changes.publishedAt = adv.publishedAt || now;
  }

  const NOTIFY_TYPE = {
    approved: "ad_approved",
    rejected: "ad_rejected",
    needs_changes: "ad_needs_changes",
  };

  return sequelize.transaction(async (t) => {
    // Condition sur l'ancien statut : protège contre deux modérations simultanées.
    const [updated] = await Adv.update(changes, {
      where: { id: adv.id, moderationStatus: previousStatus },
      transaction: t,
    });
    if (updated === 0) {
      throw httpError(409, "Статус уже змінено іншим модератором");
    }

    await ModerationLog.create(
      {
        advId: adv.id,
        ownerId: adv.userId,
        moderatorId,
        previousStatus,
        newStatus,
        reason,
      },
      { transaction: t },
    );

    await notifyAdOwner({
      userId: adv.userId,
      advId: adv.id,
      title: adv.title,
      type: NOTIFY_TYPE[newStatus],
      reason,
      transaction: t,
    });

    return adv.reload({ transaction: t });
  });
}

async function moderate(req, res, { newStatus, needsReason }) {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "Некоректний ідентифікатор" });
  }

  const reason = needsReason ? cleanReason(req.body?.reason) : null;
  if (needsReason && !reason) {
    return res
      .status(400)
      .json({ message: "Вкажіть причину (від 5 до 1000 символів)" });
  }

  const adv = await Adv.findByPk(id);
  if (!adv) {
    return res.status(404).json({ message: "Оголошення не знайдено" });
  }

  if (adv.userId === req.user.userId) {
    return res
      .status(403)
      .json({ message: "Не можна модерувати власне оголошення" });
  }

  const updated = await changeModerationStatus(adv, newStatus, {
    moderatorId: req.user.userId,
    reason,
  });
  return res.status(200).json(updated);
}

// ── Routes ───────────────────────────────────────────────

exports.getModerationAds = wrap(async (req, res) => {
  const status = LIST_STATUSES.includes(req.query.status)
    ? req.query.status
    : "pending";

  const ads = await Adv.findAll({
    where: { moderationStatus: status },
    include: [
      { model: Category, as: "category", attributes: ["id", "name"] },
      {
        model: User,
        as: "user",
        attributes: ["id", "firstName", "lastName", "email"],
      },
    ],
    order: [["datePosted", "ASC"]],
  });

  res.status(200).json(ads);
}, "getModerationAds");

exports.getPendingCount = wrap(async (req, res) => {
  const count = await Adv.count({
    where: { moderationStatus: "pending" },
  });
  res.status(200).json({ count });
}, "getPendingCount");

exports.approveAd = wrap(
  (req, res) =>
    moderate(req, res, { newStatus: "approved", needsReason: false }),
  "approveAd",
);

exports.rejectAd = wrap(
  (req, res) =>
    moderate(req, res, { newStatus: "rejected", needsReason: true }),
  "rejectAd",
);

exports.requestChanges = wrap(
  (req, res) =>
    moderate(req, res, { newStatus: "needs_changes", needsReason: true }),
  "requestChanges",
);

exports.getAdLogs = wrap(async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "Некоректний ідентифікатор" });
  }

  const logs = await ModerationLog.findAll({
    where: { advId: id },
    include: [
      {
        model: User,
        as: "moderator",
        attributes: ["id", "firstName", "lastName"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json(logs);
}, "getAdLogs");

exports.getOwnAdLogs = wrap(async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "Некоректний ідентифікатор" });
  }

  const adv = await Adv.findByPk(id, { attributes: ["id", "userId"] });
  if (!adv || adv.userId !== req.user.userId) {
    return res.status(404).json({ message: "Оголошення не знайдено" });
  }

  const logs = await ModerationLog.findAll({
    where: { advId: id },
    attributes: ["id", "previousStatus", "newStatus", "reason", "createdAt"],
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json(logs);
}, "getOwnAdLogs");
