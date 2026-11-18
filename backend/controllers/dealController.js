const { Deal } = require("../models/deal");
const { Conversation } = require("../models/conversation");
const { Adv } = require("../models/adv");

exports.getDeal = async (req, res) => {
  const conversationId = Number(req.params.conversationId);
  const deal = await Deal.findOne({
    where: { conversationId },
  });
  if (!deal) return res.status(404).json({ message: "Угода ще не створена" });
  if (![deal.buyerId, deal.sellerId].includes(req.user.userId)) {
    return res.status(403).json({ message: "Доступ заборонено" });
  }
  res.status(200).json(deal);
};

exports.createOrUpdateDeal = async (req, res) => {
  const conversationId = Number(req.params.conversationId);
  const status = String(req.body?.status || "");
  const allowed = ["planned", "contacted", "completed", "cancelled"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Некоректний статус угоди" });
  }

  const conversation = await Conversation.findByPk(conversationId);
  if (!conversation) return res.status(404).json({ message: "Розмову не знайдено" });
  if (![conversation.buyerId, conversation.sellerId].includes(req.user.userId)) {
    return res.status(403).json({ message: "Доступ заборонено" });
  }

  await Deal.upsert({
    conversationId,
    advId: conversation.adId,
    buyerId: conversation.buyerId,
    sellerId: conversation.sellerId,
    status,
  });
  const deal = await Deal.findOne({ where: { conversationId } });
  res.status(200).json(deal);
};
