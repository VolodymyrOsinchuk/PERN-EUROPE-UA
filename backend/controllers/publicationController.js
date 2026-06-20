const { Publication } = require("../models/publication");
const { User } = require("../models/user");
const { sanitizeText, sanitizeRichText } = require("../utils/sanitize");

exports.getAllPublications = async (req, res) => {
  try {
    const publications = await Publication.findAll({
      order: [["date", "DESC"]],
    });
    res.status(200).json(publications);
  } catch (error) {
    console.error("Помилка getAllPublications:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUserPublications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const publications = await Publication.findAll({
      where: { userId },
      order: [["date", "DESC"]],
    });
    res.status(200).json(publications);
  } catch (error) {
    console.error("Помилка getUserPublications:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getPublicationById = async (req, res) => {
  try {
    const publication = await Publication.findByPk(req.params.id);
    if (publication) {
      res.status(200).json(publication);
    } else {
      res.status(404).json({ message: "Публікацію не знайдено" });
    }
  } catch (error) {
    console.error("Помилка getPublicationById:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createPublication = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: ["firstName", "lastName"],
    });

    // FIX P1-8: sanitisation avant stockage
    const newPublication = await Publication.create({
      ...req.body,
      title: sanitizeText(req.body.title),
      content: sanitizeRichText(req.body.content),
      userId: req.user.userId,
      author: user
        ? `${user.firstName} ${user.lastName}`.trim()
        : req.body.author || null,
    });
    res.status(201).json(newPublication);
  } catch (error) {
    console.error("Помилка createPublication:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updatePublication = async (req, res) => {
  try {
    const publication = await Publication.findByPk(req.params.id);
    if (!publication) {
      return res.status(404).json({ message: "Публікацію не знайдено" });
    }
    if (publication.userId !== req.user.userId && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Не дозволено змінювати цю публікацію" });
    }

    const updateData = { ...req.body };
    if (updateData.title) updateData.title = sanitizeText(updateData.title);
    if (updateData.content)
      updateData.content = sanitizeRichText(updateData.content);

    await publication.update(updateData);
    res.status(200).json(publication);
  } catch (error) {
    console.error("Помилка updatePublication:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deletePublication = async (req, res) => {
  try {
    const publication = await Publication.findByPk(req.params.id);
    if (!publication) {
      return res.status(404).json({ message: "Публікацію не знайдено" });
    }
    if (publication.userId !== req.user.userId && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Не дозволено видаляти цю публікацію" });
    }
    await publication.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Помилка deletePublication:", error);
    res.status(500).json({ error: error.message });
  }
};
