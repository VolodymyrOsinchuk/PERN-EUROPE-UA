const { Adv } = require("../models/adv");

// Middleware de vérification du propriétaire
const checkOwnership = async (req, res, next) => {
  console.log("req.params.id", req.params.id);
  console.log("req.user", req.user);
  try {
    const adv = await Adv.findByPk(req.params.id);

    if (!adv) {
      return res.status(404).json({ message: "Annonce non trouvée" });
    }

    if (adv.userId !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Non autorisé à modifier cette annonce" });
    }

    req.adv = adv;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkOwnership;
