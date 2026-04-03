const { Adv } = require("../models/adv");

const checkOwnership = async (req, res, next) => {
  try {
    const adv = await Adv.findByPk(req.params.id);

    if (!adv) {
      return res.status(404).json({ message: "Оголошення не знайдено" });
    }

    if (adv.userId !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Не дозволено змінювати це оголошення" });
    }

    req.adv = adv;
    next();
  } catch (error) {
    console.error("Помилка checkOwnership:", error);
    next(error);
  }
};

module.exports = checkOwnership;
