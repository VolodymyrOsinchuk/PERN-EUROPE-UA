const { Op } = require("sequelize");
const { Conversation, Message } = require("../models/conversation");
const { User } = require("../models/user");
const { Adv } = require("../models/adv");

exports.createMessage = async (req, res, next) => {
  try {
    const senderId = req.user.userId;
    const { conversationId, recipientId, adId, message } = req.body;

    if (!message || (!recipientId && !conversationId)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let conv = null;

    if (conversationId) {
      conv = await Conversation.findByPk(conversationId);
      if (!conv) return res.status(404).json({ error: "Conversation not found" });
    } else {
      // Try to find an existing conversation for this ad between these users
      if (adId) {
        conv = await Conversation.findOne({
          where: {
            adId: adId,
            [Op.or]: [{ createdBy: senderId }, { createdBy: recipientId }],
          },
        });
      }

      if (!conv) {
        conv = await Conversation.create({ adId: adId || null, createdBy: senderId });
      }
    }

    const newMsg = await Message.create({
      conversationId: conv.id,
      senderId,
      recipientId,
      body: message,
    });

    await conv.update({ lastMessageAt: newMsg.createdAt });

    const created = await Message.findByPk(newMsg.id, {
      include: [{ model: User, as: "sender", attributes: ["id", "firstName", "lastName"] }],
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

exports.getConversations = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    // find conversation ids where user has messages
    const userMessages = await Message.findAll({
      where: { [Op.or]: [{ senderId: userId }, { recipientId: userId }] },
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
        { model: Message, as: "messages", limit: 1, order: [["createdAt", "DESC"]] },
        { model: Adv, as: "ad" },
        { model: User, as: "creator", attributes: ["id", "firstName", "lastName"] },
      ],
      order: [["lastMessageAt", "DESC"]],
    });

    res.status(200).json(convs);
  } catch (err) {
    next(err);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const conversationId = parseInt(req.params.conversationId, 10);

    const conv = await Conversation.findByPk(conversationId, {
      include: [
        { model: Message, as: "messages", include: [{ model: User, as: "sender", attributes: ["id", "firstName", "lastName"] }], order: [["createdAt", "ASC"]] },
      ],
    });

    if (!conv) return res.status(404).json({ error: "Conversation not found" });

    // Optional: mark messages as read where recipient is current user
    await Message.update({ isRead: true }, { where: { conversationId, recipientId: userId } });

    res.status(200).json(conv.messages || []);
  } catch (err) {
    next(err);
  }
};

exports.markRead = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const conversationId = parseInt(req.params.conversationId, 10);

    await Message.update({ isRead: true }, { where: { conversationId, recipientId: userId } });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
