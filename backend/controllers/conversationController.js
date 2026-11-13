const { Op, fn, col } = require("sequelize");
const sequelize = require("../config/db");
const { Adv } = require("../models/adv");
const { User } = require("../models/user");
const { Conversation } = require("../models/conversation");
const { Message } = require("../models/message");
const { sanitizeText } = require("../utils/sanitize");
const { isAdPublic } = require("../utils/publicAd");
const { notifyNewMessage } = require("../services/notificationService");
const { sendNewChatMessageEmail } = require("../services/chatEmailService");

const MAX_LEN = 2000;
const PAGE_SIZE = 50;
const EMAIL_INTERVAL_MS = 60 * 60 * 1000;
const AD_ATTRS = [
  "id",
  "title",
  "userId",
  "status",
  "isArchived",
  "moderationStatus",
  "contactByChat",
];

const parseId = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

const cleanBody = (value) => {
  if (typeof value !== "string") return null;
  const text = sanitizeText(value);
  return text.length >= 1 && text.length <= MAX_LEN ? text : null;
};

const isParticipant = (conv, userId) =>
  conv.buyerId === userId || conv.sellerId === userId;
const recipientOf = (conv, userId) =>
  conv.buyerId === userId ? conv.sellerId : conv.buyerId;

// Не більше одного email на годину на розмову. Збій пошти не ламає запит.
async function maybeEmailRecipient(conv, recipientId, adTitle) {
  if (
    conv.lastNotifiedAt &&
    Date.now() - new Date(conv.lastNotifiedAt).getTime() < EMAIL_INTERVAL_MS
  ) {
    return;
  }
  const recipient = await User.findByPk(recipientId, {
    attributes: ["email", "firstName"],
  });
  if (!recipient) return;

  const sent = await sendNewChatMessageEmail({
    to: recipient.email,
    name: recipient.firstName,
    adTitle,
  });
  if (sent) await conv.update({ lastNotifiedAt: new Date() });
}

// POST /conversations  { adId, body }
exports.createConversation = async (req, res) => {
  try {
    const me = req.user.userId;
    const adId = parseId(req.body?.adId);
    const body = cleanBody(req.body?.body);

    if (!adId || !body) {
      return res
        .status(400)
        .json({ message: "Вкажіть оголошення та текст повідомлення" });
    }

    const ad = await Adv.findByPk(adId, { attributes: AD_ATTRS });
    if (!ad || !isAdPublic(ad)) {
      return res.status(404).json({ message: "Оголошення не знайдено" });
    }
    if (!ad.contactByChat) {
      return res
        .status(403)
        .json({ message: "Внутрішній чат для цього оголошення вимкнено" });
    }
    if (ad.userId === me) {
      return res
        .status(400)
        .json({ message: "Ви не можете написати власному оголошенню" });
    }

    const sender = await User.findByPk(me, { attributes: ["firstName"] });

    const conv = await sequelize.transaction(async (t) => {
      const [c] = await Conversation.findOrCreate({
        where: { adId: ad.id, buyerId: me },
        defaults: { adId: ad.id, buyerId: me, sellerId: ad.userId },
        transaction: t,
      });

      const msg = await Message.create(
        { conversationId: c.id, senderId: me, body },
        { transaction: t },
      );
      await c.update({ lastMessageAt: msg.createdAt }, { transaction: t });

      await notifyNewMessage({
        userId: ad.userId,
        conversationId: c.id,
        senderName: sender.firstName,
        adTitle: ad.title,
        transaction: t,
      });
      return c;
    });

    maybeEmailRecipient(conv, ad.userId, ad.title).catch((err) =>
      console.error("Помилка email про повідомлення:", err),
    );

    res.status(201).json(conv);
  } catch (error) {
    console.error("Помилка createConversation:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

// GET /conversations — мої розмови з лічильником непрочитаних
exports.listConversations = async (req, res) => {
  try {
    const me = req.user.userId;

    const convs = await Conversation.findAll({
      where: { [Op.or]: [{ buyerId: me }, { sellerId: me }] },
      include: [
        { model: Adv, as: "ad", attributes: ["id", "title"] },
        { model: User, as: "buyer", attributes: ["id", "firstName"] },
        { model: User, as: "seller", attributes: ["id", "firstName"] },
      ],
      order: [["lastMessageAt", "DESC"]],
    });

    const ids = convs.map((c) => c.id);
    const counts = ids.length
      ? await Message.findAll({
          attributes: ["conversationId", [fn("COUNT", col("id")), "count"]],
          where: {
            conversationId: { [Op.in]: ids },
            senderId: { [Op.ne]: me },
            readAt: null,
          },
          group: ["conversationId"],
          raw: true,
        })
      : [];

    const unreadMap = Object.fromEntries(
      counts.map((r) => [r.conversationId, Number(r.count)]),
    );

    res.status(200).json(
      convs.map((c) => ({
        ...c.get({ plain: true }),
        unread: unreadMap[c.id] || 0,
      })),
    );
  } catch (error) {
    console.error("Помилка listConversations:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

// GET /conversations/:id/messages?before=ID — 50 останніх, пагінація назад
exports.getMessages = async (req, res) => {
  try {
    const me = req.user.userId;
    const id = parseId(req.params.id);
    if (!id)
      return res.status(400).json({ message: "Некоректний ідентифікатор" });

    const conv = await Conversation.findByPk(id);
    if (!conv || !isParticipant(conv, me)) {
      return res.status(404).json({ message: "Розмову не знайдено" });
    }

    const before = req.query.before ? parseId(req.query.before) : null;
    const where = { conversationId: id };
    if (before) where.id = { [Op.lt]: before };

    const rows = await Message.findAll({
      where,
      include: [{ model: User, as: "sender", attributes: ["id", "firstName"] }],
      order: [["id", "DESC"]],
      limit: PAGE_SIZE,
    });

    res.status(200).json(rows.reverse());
  } catch (error) {
    console.error("Помилка getMessages:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

// POST /conversations/:id/messages  { body }
exports.postMessage = async (req, res) => {
  try {
    const me = req.user.userId;
    const id = parseId(req.params.id);
    const body = cleanBody(req.body?.body);

    if (!id)
      return res.status(400).json({ message: "Некоректний ідентифікатор" });
    if (!body)
      return res
        .status(400)
        .json({ message: "Текст повідомлення від 1 до 2000 символів" });

    const conv = await Conversation.findByPk(id);
    if (!conv || !isParticipant(conv, me)) {
      return res.status(404).json({ message: "Розмову не знайдено" });
    }

    const ad = conv.adId
      ? await Adv.findByPk(conv.adId, { attributes: AD_ATTRS })
      : null;
    if (!ad || !ad.contactByChat) {
      return res
        .status(403)
        .json({ message: "Чат із цим оголошенням закрито" });
    }

    const sender = await User.findByPk(me, { attributes: ["firstName"] });
    const recipientId = recipientOf(conv, me);

    const message = await sequelize.transaction(async (t) => {
      const msg = await Message.create(
        { conversationId: conv.id, senderId: me, body },
        { transaction: t },
      );
      await conv.update({ lastMessageAt: msg.createdAt }, { transaction: t });
      await notifyNewMessage({
        userId: recipientId,
        conversationId: conv.id,
        senderName: sender.firstName,
        adTitle: ad.title,
        transaction: t,
      });
      return msg;
    });

    maybeEmailRecipient(conv, recipientId, ad.title).catch((err) =>
      console.error("Помилка email про повідомлення:", err),
    );

    res.status(201).json(message);
  } catch (error) {
    console.error("Помилка postMessage:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

// PATCH /conversations/:id/read — позначити повідомлення співрозмовника прочитаними
exports.markRead = async (req, res) => {
  try {
    const me = req.user.userId;
    const id = parseId(req.params.id);
    if (!id)
      return res.status(400).json({ message: "Некоректний ідентифікатор" });

    const conv = await Conversation.findByPk(id);
    if (!conv || !isParticipant(conv, me)) {
      return res.status(404).json({ message: "Розмову не знайдено" });
    }

    await Message.update(
      { readAt: new Date() },
      {
        where: { conversationId: id, senderId: { [Op.ne]: me }, readAt: null },
      },
    );
    res.status(204).send();
  } catch (error) {
    console.error("Помилка markRead:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};
