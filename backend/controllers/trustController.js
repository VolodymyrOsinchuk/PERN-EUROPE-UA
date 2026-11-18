const { AdDraft } = require("../models/adDraft");
const { ViewedAd } = require("../models/viewedAd");
const { Deal } = require("../models/deal");
const { Conversation } = require("../models/conversation");
const { Adv, PUBLIC_WHERE } = require("../models/adv");
const { Category } = require("../models/category");
const { toPublicAd } = require("../utils/publicAd");

exports.getDraft = async (req, res) => {
  const draft = await AdDraft.findOne({ where: { userId: req.user.userId } });
  res.status(200).json(draft?.payload || null);
};

exports.saveDraft = async (req, res) => {
  await AdDraft.upsert({
    userId: req.user.userId,
    payload: req.body?.payload || {},
  });
  const draft = await AdDraft.findOne({ where: { userId: req.user.userId } });
  res.status(200).json({ message: "Чернетку збережено", draft: draft.payload });
};

exports.deleteDraft = async (req, res) => {
  await AdDraft.destroy({ where: { userId: req.user.userId } });
  res.status(204).send();
};

exports.trackViewedAd = async (req, res) => {
  const advId = Number(req.params.advId);
  if (!Number.isInteger(advId) || advId <= 0) {
    return res.status(400).json({ message: "Некоректний ідентифікатор" });
  }
  await ViewedAd.upsert({ userId: req.user.userId, advId });
  res.status(204).send();
};

exports.getViewedAds = async (req, res) => {
  const rows = await ViewedAd.findAll({
    where: { userId: req.user.userId },
    include: [
      {
        model: Adv,
        as: "Adv",
        where: PUBLIC_WHERE,
        include: [{ model: Category, as: "category", attributes: ["id", "name"] }],
      },
    ],
    order: [["updatedAt", "DESC"]],
    limit: 24,
  });
  res.status(200).json(rows.map((row) => toPublicAd(row.Adv)));
};
