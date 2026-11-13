const { Op } = require("sequelize");
const { Conversation } = require("../models/conversation");
const { Message } = require("../models/message");
const { MessageReport } = require("../models/messageReport");
const { User } = require("../models/user");
const { sanitizeText } = require("../utils/sanitize");

const REPORT_REASONS = ["Спам", "Шахрайство", "Образливий зміст", "Інше"];
const STATUSES = ["pending", "resolved", "dismissed"];

const parseId = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

const isParticipant = (conv, userId) =>
  conv.buyerId === userId || conv.sellerId === userId;

// POST /messages/:id/report  { reason, details }
exports.reportMessage = async (req, res) => {
  try {
    const me = req.user.userId;
    const id = parseId(req.params.id);
    const reason = req.body?.reason;
    const details =
      typeof req.body?.details === "string"
        ? sanitizeText(req.body.details).slice(0, 1000)
        : null;

    if (!id)
      return res.status(400).json({ message: "Некоректний ідентифікатор" });
    if (!REPORT_REASONS.includes(reason)) {
      return res.status(400).json({ message: "Оберіть причину скарги" });
    }

    const msg = await Message.findByPk(id);
    if (!msg)
      return res.status(404).json({ message: "Повідомлення не знайдено" });

    const conv = await Conversation.findByPk(msg.conversationId);
    if (!conv || !isParticipant(conv, me)) {
      // 404, щоб не розкривати чужі розмови
      return res.status(404).json({ message: "Повідомлення не знайдено" });
    }
    if (msg.senderId === me) {
      return res
        .status(400)
        .json({ message: "Не можна поскаржитися на власне повідомлення" });
    }

    const report = await MessageReport.create({
      messageId: id,
      reporterId: me,
      reason,
      details,
    });

    res.status(201).json({ message: "Скаргу надіслано на розгляд", report });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({ message: "Ви вже скаржилися на це повідомлення" });
    }
    console.error("Помилка reportMessage:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

// GET /messages/unread-count
exports.getUnreadMessageCount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const unreadCount = await Message.count({
      include: [
        {
          model: Conversation,
          as: "conversation",
          attributes: [],
          where: {
            [Op.or]: [{ buyerId: userId }, { sellerId: userId }],
          },
        },
      ],
      where: {
        readAt: null,
        senderId: { [Op.ne]: userId },
      },
    });

    res.status(200).json({ unread: unreadCount });
  } catch (error) {
    console.error("Помилка getUnreadMessageCount:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

// GET /moderation/message-reports?status=pending  (admin, moderator)
exports.listMessageReports = async (req, res) => {
  try {
    const status = STATUSES.includes(req.query.status)
      ? req.query.status
      : "pending";

    const reports = await MessageReport.findAll({
      where: { status },
      include: [
        {
          model: Message,
          as: "message",
          attributes: ["id", "body", "senderId", "conversationId", "createdAt"],
        },
        {
          model: User,
          as: "reporter",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });
    res.status(200).json(reports);
  } catch (error) {
    console.error("Помилка listMessageReports:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

// PATCH /moderation/message-reports/:id  { decision: "resolved" | "dismissed" }
// Журнал рішення: decidedBy і decidedAt у самій скарзі.
exports.decideMessageReport = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    const decision = req.body?.decision;

    if (!id)
      return res.status(400).json({ message: "Некоректний ідентифікатор" });
    if (!["resolved", "dismissed"].includes(decision)) {
      return res.status(400).json({ message: "Некоректне рішення" });
    }

    // Умова status = pending: два адміністратори не перезапишуть одне одного.
    const [updated] = await MessageReport.update(
      { status: decision, decidedBy: req.user.userId, decidedAt: new Date() },
      { where: { id, status: "pending" } },
    );
    if (updated === 0) {
      const exists = await MessageReport.count({ where: { id } });
      return res.status(exists ? 409 : 404).json({
        message: exists ? "Скаргу вже розглянуто" : "Скаргу не знайдено",
      });
    }

    const report = await MessageReport.findByPk(id);
    res.status(200).json(report);
  } catch (error) {
    console.error("Помилка decideMessageReport:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};
