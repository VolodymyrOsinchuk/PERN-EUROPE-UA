const { News } = require("../models/news");

exports.getAllNews = async (req, res) => {
  try {
    const news = await News.findAll({ order: [['date', 'DESC']] });
    res.status(200).json(news);
  } catch (error) {
    console.error("Помилка getAllNews:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (news) {
      res.status(200).json(news);
    } else {
      res.status(404).json({ message: "Новину не знайдено" });
    }
  } catch (error) {
    console.error("Помилка getNewsById:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createNews = async (req, res) => {
  try {
    const newNews = await News.create(req.body);
    res.status(201).json(newNews);
  } catch (error) {
    console.error("Помилка createNews:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateNews = async (req, res) => {
  try {
    const [updated] = await News.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedNews = await News.findByPk(req.params.id);
      res.status(200).json(updatedNews);
    } else {
      res.status(404).json({ message: "Новину не знайдено" });
    }
  } catch (error) {
    console.error("Помилка updateNews:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const deleted = await News.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send("Новину видалено");
    } else {
      res.status(404).json({ message: "Новину не знайдено" });
    }
  } catch (error) {
    console.error("Помилка deleteNews:", error);
    res.status(500).json({ error: error.message });
  }
};
