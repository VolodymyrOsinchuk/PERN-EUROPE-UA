const { Adv } = require("../models/adv");

const checkOwnership = async (req, res, next) => {
  try {
    const adv = await Adv.findByPk(req.params.id);

    if (!adv) {
      return res.status(404).json({ message: "Оголошення не знайдено" });
    }

    // FIX: autoriser les admins/modérateurs en plus du propriétaire
    const isOwner = adv.userId === req.user.userId;
    const isPrivileged = ["admin", "moderator"].includes(req.user.role);

    if (!isOwner && !isPrivileged) {
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
