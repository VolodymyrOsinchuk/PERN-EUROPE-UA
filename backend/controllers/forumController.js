const { ForumTopic } = require("../models/forumTopic");
const { ForumReply } = require("../models/forumReply");
const { ForumCategory } = require("../models/forumCategory");
const { User } = require("../models/user");

// ─── Topics ───────────────────────────────────────────────

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
    const author = req.user?.firstName
      ? `${req.user.firstName} ${req.user.lastName || ""}`.trim()
      : req.body.author || "Анонім";

    const newTopic = await ForumTopic.create({ ...req.body, author });
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

// ─── Stats dynamiques ─────────────────────────────────────

exports.getForumStats = async (req, res) => {
  try {
    const [topicsCount, repliesCount, usersCount] = await Promise.all([
      ForumTopic.count(),
      ForumReply.count(),
      User.count({ where: { isVerified: true } }),
    ]);

    // Sum of all views across topics
    const viewsResult = await ForumTopic.sum("views");
    const totalViews = viewsResult || 0;

    res.status(200).json({
      topics: topicsCount,
      replies: repliesCount,
      members: usersCount,
      views: totalViews,
    });
  } catch (error) {
    console.error("Помилка getForumStats:", error);
    res.status(500).json({ error: error.message });
  }
};

// ─── Forum Categories CRUD ────────────────────────────────

exports.getAllForumCategories = async (req, res) => {
  try {
    const categories = await ForumCategory.findAll({
      where: { isActive: true },
      order: [
        ["sortOrder", "ASC"],
        ["createdAt", "ASC"],
      ],
    });

    // Enrich each category with live topic count
    const enriched = await Promise.all(
      categories.map(async (cat) => {
        const topicsCount = await ForumTopic.count({
          where: { category: cat.title },
        });
        const repliesResult = await ForumTopic.sum("replies", {
          where: { category: cat.title },
        });
        return {
          ...cat.toJSON(),
          topicsCount,
          postsCount: repliesResult || 0,
        };
      }),
    );

    res.status(200).json(enriched);
  } catch (error) {
    console.error("Помилка getAllForumCategories:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllForumCategoriesAdmin = async (req, res) => {
  try {
    const categories = await ForumCategory.findAll({
      order: [
        ["sortOrder", "ASC"],
        ["createdAt", "ASC"],
      ],
    });

    const enriched = await Promise.all(
      categories.map(async (cat) => {
        const topicsCount = await ForumTopic.count({
          where: { category: cat.title },
        });
        return { ...cat.toJSON(), topicsCount };
      }),
    );

    res.status(200).json(enriched);
  } catch (error) {
    console.error("Помилка getAllForumCategoriesAdmin:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createForumCategory = async (req, res) => {
  try {
    const { title, description, icon, color, bgColor, sortOrder } = req.body;
    const category = await ForumCategory.create({
      title,
      description,
      icon: icon || "forum",
      color: color || "#0057B8",
      bgColor: bgColor || "#eff6ff",
      sortOrder: sortOrder || 0,
    });
    res.status(201).json(category);
  } catch (error) {
    console.error("Помилка createForumCategory:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({ message: "Категорія з такою назвою вже існує" });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.updateForumCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ForumCategory.findByPk(id);
    if (!category)
      return res.status(404).json({ message: "Категорію не знайдено" });

    await category.update(req.body);
    res.status(200).json(category);
  } catch (error) {
    console.error("Помилка updateForumCategory:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteForumCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ForumCategory.findByPk(id);
    if (!category)
      return res.status(404).json({ message: "Категорію не знайдено" });

    await category.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Помилка deleteForumCategory:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.toggleForumCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ForumCategory.findByPk(id);
    if (!category)
      return res.status(404).json({ message: "Категорію не знайдено" });

    await category.update({ isActive: !category.isActive });
    res.status(200).json(category);
  } catch (error) {
    console.error("Помилка toggleForumCategory:", error);
    res.status(500).json({ error: error.message });
  }
};
