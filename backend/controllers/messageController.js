const { Op } = require("sequelize");
const { Conversation, Message } = require("../models/conversation");
const { User } = require("../models/user");
const { Adv } = require("../models/adv");

exports.createMessage = async (req, res, next) => {
  try {
    const senderId = req.user.userId;
    const { conversationId, recipientId, adId, message } = req.body;

    if (!message || (!recipientId && !conversationId)) {
      return res.status(400).json({ error: "Відсутні обов'язкові поля" });
    }

    if (recipientId && !Number.isInteger(Number(recipientId))) {
      return res.status(400).json({ error: "recipientId має бути числом" });
    }

    if (!recipientId && !conversationId) {
      return res
        .status(400)
        .json({ error: "recipientId або conversationId є обов'язковим" });
    }

    let conv = null;

    if (conversationId) {
      conv = await Conversation.findByPk(conversationId);
      if (!conv) return res.status(404).json({ error: "Розмову не знайдено" });
    } else {
      // Try to find existing conversation for this ad between these two users
      if (adId) {
        conv = await Conversation.findOne({
          where: {
            adId,
            [Op.or]: [{ createdBy: senderId }, { createdBy: recipientId }],
          },
          include: [
            {
              model: Message,
              as: "messages",
              where: {
                [Op.or]: [
                  { senderId, recipientId },
                  { senderId: recipientId, recipientId: senderId },
                ],
              },
              required: true,
            },
          ],
        });
      }

      // Create new conversation if none found
      if (!conv) {
        conv = await Conversation.create({
          adId: adId || null,
          createdBy: senderId,
        });
      }
    }

    const newMsg = await Message.create({
      conversationId: conv.id,
      senderId,
      recipientId: recipientId ? parseInt(recipientId, 10) : null,
      body: message,
    });

    await conv.update({ lastMessageAt: newMsg.createdAt });

    // Return message with sender info
    const created = await Message.findByPk(newMsg.id, {
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "firstName", "lastName", "profilePicture"],
        },
      ],
    });

    res.status(201).json(created);
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
    const conversationId = parseInt(req.params.conversationId, 10);

    const conv = await Conversation.findByPk(conversationId);
    if (!conv) return res.status(404).json({ error: "Розмову не знайдено" });

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
