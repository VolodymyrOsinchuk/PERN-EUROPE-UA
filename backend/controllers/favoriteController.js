const { Favorite } = require("../models/favorite");
const { Adv, PUBLIC_WHERE } = require("../models/adv");
const { Category } = require("../models/category");
const { toPublicAd } = require("../utils/publicAd");

exports.getFavorites = async (req, res) => {
  try {
    const rows = await Favorite.findAll({
      where: { userId: req.user.userId },
      include: [
        {
          model: Adv,
          as: "Adv",
          where: PUBLIC_WHERE,
          include: [{ model: Category, as: "category", attributes: ["id", "name"] }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(rows.map((row) => toPublicAd(row.Adv)));
  } catch (error) {
    console.error("Помилка getFavorites:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const advId = Number(req.params.advId);
    if (!Number.isInteger(advId) || advId <= 0) {
      return res.status(400).json({ message: "Некоректний ідентифікатор" });
    }
    const ad = await Adv.findOne({ where: { id: advId, ...PUBLIC_WHERE } });
    if (!ad) return res.status(404).json({ message: "Оголошення не знайдено" });

    await Favorite.findOrCreate({
      where: { userId: req.user.userId, advId },
    });
    res.status(201).json({ saved: true });
  } catch (error) {
    console.error("Помилка addFavorite:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const advId = Number(req.params.advId);
    await Favorite.destroy({ where: { userId: req.user.userId, advId } });
    res.status(204).send();
  } catch (error) {
    console.error("Помилка removeFavorite:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};
