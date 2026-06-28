const { ForumTopic } = require("../models/forumTopic");
const { ForumReply } = require("../models/forumReply");
const { ForumCategory } = require("../models/forumCategory");
const { User } = require("../models/user");
const { pick } = require("../utils/pick");
const sequelize = require("../config/db");

async function resolveForumCategory(category) {
  if (!category) return null;
  const fc = await ForumCategory.findOne({
    where: { title: category },
    attributes: ["id", "title"],
  });
  return fc?.id || null;
}

// ─── Topics ───────────────────────────────────────────────

exports.getAllTopics = async (req, res) => {
  try {
    const topics = await ForumTopic.findAll({
      include: [
        {
          model: ForumCategory,
          as: "forumCategory",
          attributes: ["id", "title", "icon", "color", "bgColor"],
        },
      ],
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
    const topic = await ForumTopic.findByPk(req.params.id, {
      include: [
        {
          model: ForumCategory,
          as: "forumCategory",
          attributes: ["id", "title", "icon", "color", "bgColor"],
        },
      ],
    });
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
      include: [
        { model: User, as: "user", attributes: ["id", "firstName", "lastName"] },
      ],
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
    let author = req.body.author || "Анонім";
    if (req.user?.userId) {
      const user = await User.findByPk(req.user.userId, {
        attributes: ["firstName", "lastName"],
      });
      if (user) {
        author = `${user.firstName} ${user.lastName}`.trim();
      }
    }

    const newReply = await ForumReply.create({
      topicId,
      content,
      author,
      userId: req.user?.userId || null,
    });
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
    let author = req.body.author || "Анонім";
    if (req.user?.userId) {
      const user = await User.findByPk(req.user.userId, {
        attributes: ["firstName", "lastName"],
      });
      if (user) {
        author = `${user.firstName} ${user.lastName}`.trim();
      }
    }

    const topicData = pick(req.body, ["title", "content", "category"]);
    const newTopic = await ForumTopic.create({
      ...topicData,
      author,
      userId: req.user?.userId || null,
      forumCategoryId: await resolveForumCategory(topicData.category),
    });
    res.status(201).json(newTopic);
  } catch (error) {
    console.error("Помилка createTopic:", error);
    res.status(500).json({ error: error.message });
  }
};

// FIX P2-2: ajout du contrôle de propriété, absent jusqu'ici — n'importe
// quel utilisateur connecté pouvait modifier/supprimer le sujet d'un autre.
exports.updateTopic = async (req, res) => {
  try {
    const topic = await ForumTopic.findByPk(req.params.id);
    if (!topic) return res.status(404).json({ message: "Тему не знайдено" });

    if (topic.userId !== req.user.userId && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Не дозволено змінювати цю тему" });
    }

    const updateData = pick(req.body, ["title", "content", "category"]);
    if (updateData.category !== undefined) {
      updateData.forumCategoryId = await resolveForumCategory(
        updateData.category,
      );
    }
    await topic.update(updateData);
    res.status(200).json(topic);
  } catch (error) {
    console.error("Помилка updateTopic:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTopic = async (req, res) => {
  try {
    const topic = await ForumTopic.findByPk(req.params.id);
    if (!topic) return res.status(404).json({ message: "Тему не знайдено" });

    if (topic.userId !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Не дозволено видаляти цю тему" });
    }

    await topic.destroy();
    res.status(204).send();
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

    const topicStats = await ForumTopic.findAll({
      attributes: [
        "category",
        [sequelize.fn("COUNT", sequelize.col("id")), "topicsCount"],
        [sequelize.fn("SUM", sequelize.col("replies")), "postsCount"],
      ],
      group: ["category"],
      raw: true,
    });
    const statsMap = {};
    for (const row of topicStats) {
      statsMap[row.category] = {
        topicsCount: Number(row.topicsCount),
        postsCount: Number(row.postsCount) || 0,
      };
    }

    const enriched = categories.map((cat) => ({
      ...cat.toJSON(),
      topicsCount: statsMap[cat.title]?.topicsCount || 0,
      postsCount: statsMap[cat.title]?.postsCount || 0,
    }));

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

    const topicStats = await ForumTopic.findAll({
      attributes: [
        "category",
        [sequelize.fn("COUNT", sequelize.col("id")), "topicsCount"],
      ],
      group: ["category"],
      raw: true,
    });
    const statsMap = {};
    for (const row of topicStats) {
      statsMap[row.category] = Number(row.topicsCount);
    }

    const enriched = categories.map((cat) => ({
      ...cat.toJSON(),
      topicsCount: statsMap[cat.title] || 0,
    }));

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

    await category.update(pick(req.body, ["title", "description", "icon", "color", "bgColor", "sortOrder", "isActive"]));
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
