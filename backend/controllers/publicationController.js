const { Publication } = require("../models/publication");

exports.getAllPublications = async (req, res) => {
  try {
    const publications = await Publication.findAll({ order: [['date', 'DESC']] });
    res.status(200).json(publications);
  } catch (error) {
    console.error("Помилка getAllPublications:", error);
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
    const newPublication = await Publication.create(req.body);
    res.status(201).json(newPublication);
  } catch (error) {
    console.error("Помилка createPublication:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updatePublication = async (req, res) => {
  try {
    const [updated] = await Publication.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedPublication = await Publication.findByPk(req.params.id);
      res.status(200).json(updatedPublication);
    } else {
      res.status(404).json({ message: "Публікацію не знайдено" });
    }
  } catch (error) {
    console.error("Помилка updatePublication:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deletePublication = async (req, res) => {
  try {
    const deleted = await Publication.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send("Публікацію видалено");
    } else {
      res.status(404).json({ message: "Публікацію не знайдено" });
    }
  } catch (error) {
    console.error("Помилка deletePublication:", error);
    res.status(500).json({ error: error.message });
  }
};
