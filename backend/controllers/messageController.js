const { Op } = require("sequelize");
const { Conversation, Message } = require("../models/conversation");
const { User } = require("../models/user");
const { Adv } = require("../models/adv");
const { sendAdContactEmail } = require("../utils/emailService");

// Une personne fait partie d'une conversation si elle l'a créée
// ou si elle a envoyé/reçu au moins un message dedans.
async function isParticipant(conversation, userId) {
  if (conversation.createdBy === userId) return true;
  const count = await Message.count({
    where: {
      conversationId: conversation.id,
      [Op.or]: [{ senderId: userId }, { recipientId: userId }],
    },
  });
  return count > 0;
}

exports.createMessage = async (req, res, next) => {
  try {
    const senderId = req.user.userId;
    const { adId, message } = req.body;
    const text = typeof message === "string" ? message.trim() : "";

    const adIdNum = Number(adId);
    if (!Number.isInteger(adIdNum) || adIdNum <= 0 || !text) {
      return res
        .status(400)
        .json({ message: "Вкажіть оголошення та текст повідомлення" });
    }
    if (text.length > 2000) {
      return res.status(400).json({
        message: "Повідомлення занадто довге (максимум 2000 символів)",
      });
    }

    // Le destinataire vient de l'annonce (pas du navigateur)
    const ad = await Adv.findByPk(adId, {
      attributes: ["id", "title", "email", "userId", "status", "isArchived"],
    });
    if (!ad || ad.isArchived === true || ad.status !== "Active") {
      return res.status(404).json({ message: "Оголошення не знайдено" });
    }
    if (ad.userId === senderId) {
      return res
        .status(400)
        .json({ message: "Ви не можете написати власному оголошенню" });
    }

    // L'adresse de réponse est celle du compte vérifié de l'acheteur
    const sender = await User.findByPk(senderId, {
      attributes: ["firstName", "lastName", "email"],
    });
    if (!sender) {
      return res.status(401).json({ message: "Потрібна автентифікація" });
    }

    const sent = await sendAdContactEmail({
      to: ad.email,
      adId: ad.id,
      adTitle: ad.title,
      senderName: `${sender.firstName} ${sender.lastName}`.trim(),
      senderEmail: sender.email,
      message: text,
    });

    if (!sent) {
      return res
        .status(502)
        .json({ message: "Не вдалося надіслати лист. Спробуйте пізніше" });
    }

    return res.status(200).json({ message: "Повідомлення надіслано" });
  } catch (err) {
    console.error("Помилка createMessage:", err);
    next(err);
  }
};

exports.getConversations = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Find all conversation IDs where user has sent or received messages
    const userMessages = await Message.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { recipientId: userId }],
      },
      attributes: ["conversationId"],
      group: ["conversationId"],
    });

    const convIds = userMessages.map((m) => m.conversationId);

    const whereClause = convIds.length
      ? { [Op.or]: [{ id: convIds }, { createdBy: userId }] }
      : { createdBy: userId };

    const convs = await Conversation.findAll({
      where: whereClause,
      include: [
        {
          model: Message,
          as: "messages",
          limit: 1,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: User,
              as: "sender",
              attributes: ["id", "firstName", "lastName"],
            },
            {
              model: User,
              as: "recipient",
              attributes: ["id", "firstName", "lastName"],
            },
          ],
        },
        {
          model: Adv,
          as: "ad",
          attributes: ["id", "title", "photos"],
          required: false,
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
      order: [["lastMessageAt", "DESC"]],
    });

    res.status(200).json(convs);
  } catch (err) {
    console.error("Помилка getConversations:", err);
    next(err);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const conversationId = Number(req.params.conversationId);

    if (!Number.isInteger(conversationId) || conversationId <= 0) {
      return res
        .status(400)
        .json({ error: "Некоректний ідентифікатор розмови" });
    }

    const conv = await Conversation.findByPk(conversationId);
    if (!conv || !(await isParticipant(conv, userId))) {
      return res.status(404).json({ error: "Розмову не знайдено" });
    }

    const messages = await Message.findAll({
      where: { conversationId },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "firstName", "lastName", "profilePicture"],
        },
        {
          model: User,
          as: "recipient",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    // Mark messages as read where current user is recipient
    await Message.update(
      { isRead: true },
      { where: { conversationId, recipientId: userId, isRead: false } },
    );

    res.status(200).json(messages);
  } catch (err) {
    console.error("Помилка getMessages:", err);
    next(err);
  }
};

exports.markRead = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const conversationId = parseInt(req.params.conversationId, 10);

    await Message.update(
      { isRead: true },
      { where: { conversationId, recipientId: userId, isRead: false } },
    );

    res.status(204).send();
  } catch (err) {
    console.error("Помилка markRead:", err);
    next(err);
  }
};

exports.getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const count = await Message.count({
      where: { recipientId: userId, isRead: false },
    });

    res.status(200).json({ unread: count });
  } catch (err) {
    console.error("Помилка getUnreadCount:", err);
    next(err);
  }
};
