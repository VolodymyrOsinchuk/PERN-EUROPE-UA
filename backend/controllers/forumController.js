const { ForumTopic } = require("../models/forumTopic");

exports.getAllTopics = async (req, res) => {
  try {
    const topics = await ForumTopic.findAll({ order: [['lastUpdate', 'DESC']] });
    res.status(200).json(topics);
  } catch (error) {
    console.error("Помилка getAllTopics:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getTopicById = async (req, res) => {
  try {
    const topic = await ForumTopic.findByPk(req.params.id);
    if (topic) {
      res.status(200).json(topic);
    } else {
      res.status(404).json({ message: "Тему не знайдено" });
    }
  } catch (error) {
    console.error("Помилка getTopicById:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createTopic = async (req, res) => {
  try {
    const newTopic = await ForumTopic.create(req.body);
    res.status(201).json(newTopic);
  } catch (error) {
    console.error("Помилка createTopic:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateTopic = async (req, res) => {
  try {
    const [updated] = await ForumTopic.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedTopic = await ForumTopic.findByPk(req.params.id);
      res.status(200).json(updatedTopic);
    } else {
      res.status(404).json({ message: "Тему не знайдено" });
    }
  } catch (error) {
    console.error("Помилка updateTopic:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTopic = async (req, res) => {
  try {
    const deleted = await ForumTopic.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send("Тему видалено");
    } else {
      res.status(404).json({ message: "Тему не знайдено" });
    }
  } catch (error) {
    console.error("Помилка deleteTopic:", error);
    res.status(500).json({ error: error.message });
  }
};
