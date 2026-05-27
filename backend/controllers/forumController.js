const { ForumTopic } = require("../models/forumTopic");
const { ForumReply } = require("../models/forumReply");

exports.getAllTopics = async (req, res) => {
  try {
    const topics = await ForumTopic.findAll({
      order: [["lastUpdate", "DESC"]],
    });
    res.status(200).json(topics);
  } catch (error) {
    console.error("Помилка getAllTopics:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getTopicById = async (req, res) => {
  try {
    const topic = await ForumTopic.findByPk(req.params.id);
    if (!topic) return res.status(404).json({ message: "Тему не знайдено" });

    // Increment views on each read
    await topic.increment("views");
    res.status(200).json(topic);
  } catch (error) {
    console.error("Помилка getTopicById:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getReplies = async (req, res) => {
  try {
    const replies = await ForumReply.findAll({
      where: { topicId: req.params.id },
      order: [["createdAt", "ASC"]],
    });
    res.status(200).json(replies);
  } catch (error) {
    console.error("Помилка getReplies:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createReply = async (req, res) => {
  try {
    const topicId = req.params.id;
    const { content } = req.body;

    // FIX: already correct — uses req.user name
    const author = req.user?.firstName
      ? `${req.user.firstName} ${req.user.lastName || ""}`.trim()
      : req.body.author || "Анонім";

    const newReply = await ForumReply.create({ topicId, content, author });

    await ForumTopic.increment("replies", { by: 1, where: { id: topicId } });
    await ForumTopic.update(
      { lastUpdate: new Date() },
      { where: { id: topicId } },
    );

    res.status(201).json(newReply);
  } catch (error) {
    console.error("Помилка createReply:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createTopic = async (req, res) => {
  try {
    // FIX: auto-fill "author" from authenticated user — Forum.jsx never sends it
    const author = req.user?.firstName
      ? `${req.user.firstName} ${req.user.lastName || ""}`.trim()
      : req.body.author || "Анонім";

    const newTopic = await ForumTopic.create({
      ...req.body,
      author,
    });
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
    const deleted = await ForumTopic.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Тему не знайдено" });
    }
  } catch (error) {
    console.error("Помилка deleteTopic:", error);
    res.status(500).json({ error: error.message });
  }
};
