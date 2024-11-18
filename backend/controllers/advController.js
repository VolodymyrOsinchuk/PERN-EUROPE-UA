const Annonce = require("../models/adv");

exports.createAnnonce = async (req, res) => {
  try {
    const annonce = await Annonce.create(req.body);
    res.status(201).json(annonce);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllAnnonces = async (req, res) => {
  try {
    const annonces = await Annonce.findAll();
    res.status(200).json(annonces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAnnonceById = async (req, res) => {
  try {
    const annonce = await Annonce.findByPk(req.params.id);
    if (annonce) {
      res.status(200).json(annonce);
    } else {
      res.status(404).json({ message: "Annonce non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAnnonce = async (req, res) => {
  try {
    const [updated] = await Annonce.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedAnnonce = await Annonce.findByPk(req.params.id);
      res.status(200).json(updatedAnnonce);
    } else {
      res.status(404).json({ message: "Annonce non trouvée" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteAnnonce = async (req, res) => {
  try {
    const deleted = await Annonce.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Annonce non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
