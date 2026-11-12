const { Op } = require("sequelize");
const { ForumTopic } = require("../models/forumTopic");
const { ForumReply } = require("../models/forumReply");
const { ForumCategory } = require("../models/forumCategory");
const { ForumCategorySuggestion } = require("../models/forumCategorySuggestion");
const { ForumReport } = require("../models/forumReport");
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
    const {
      categoryId,
      subcategoryId,
      country,
      city,
      search,
      sort = "latest",
    } = req.query;

    const where = {};

    if (categoryId) {
      where.forumCategoryId = categoryId;
    }
    if (subcategoryId) {
      where.forumSubcategoryId = subcategoryId;
    }
    if (country && country.trim() !== "") {
      where.country = { [Op.iLike]: `%${country.trim()}%` };
    }
    if (city && city.trim() !== "") {
      where.city = { [Op.iLike]: `%${city.trim()}%` };
    }
    if (search && search.trim() !== "") {
      const term = `%${search.trim()}%`;
      where[Op.or] = [
        { title: { [Op.iLike]: term } },
        { content: { [Op.iLike]: term } },
      ];
    }

    // Determine sort order
    let sortOrder = [["lastUpdate", "DESC"]];
    if (sort === "popular") {
      sortOrder = [["views", "DESC"]];
    } else if (sort === "replies") {
      sortOrder = [["replies", "DESC"]];
    } else if (sort === "latest") {
      sortOrder = [["createdAt", "DESC"]];
    }

    // Pinned topics always come first
    const order = [["isPinned", "DESC"], ...sortOrder];

    const topics = await ForumTopic.findAll({
      where,
      include: [
        {
          model: ForumCategory,
          as: "forumCategory",
          attributes: ["id", "title", "icon", "color", "bgColor"],
        },
        {
          model: ForumCategory,
          as: "forumSubcategory",
          attributes: ["id", "title", "icon", "color", "bgColor"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "profilePicture", "role"],
        },
      ],
      order,
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
        {
          model: ForumCategory,
          as: "forumSubcategory",
          attributes: ["id", "title", "icon", "color", "bgColor"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "profilePicture", "role"],
        },
      ],
    });
    if (!topic) return res.status(404).json({ message: "Тему не знайдено" });

    // increment view count
    await topic.increment("views");
    res.status(200).json(topic);
  } catch (error) {
    console.error("Помилка getTopicById:", error);
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

    const {
      title,
      content,
      category,
      forumCategoryId,
      forumSubcategoryId,
      country,
      city,
      attachments,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Заголовок та текст обов'язкові" });
    }

    let resolvedCatId = forumCategoryId;
    if (!resolvedCatId && category) {
      resolvedCatId = await resolveForumCategory(category);
    }

    let resolvedSubCatId = forumSubcategoryId || null;

    const newTopic = await ForumTopic.create({
      title,
      content,
      category: category || "",
      forumCategoryId: resolvedCatId,
      forumSubcategoryId: resolvedSubCatId,
      country: country || null,
      city: city || null,
      attachments: attachments ? JSON.stringify(attachments) : null,
      author,
      userId: req.user?.userId || null,
      isPinned: false,
      isClosed: false,
    });

    res.status(201).json(newTopic);
  } catch (error) {
    console.error("Помилка createTopic:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateTopic = async (req, res) => {
  try {
    const topic = await ForumTopic.findByPk(req.params.id);
    if (!topic) return res.status(404).json({ message: "Тему не знайдено" });

    const isModeratorOrAdmin = ["admin", "moderator"].includes(req.user?.role);
    if (topic.userId !== req.user.userId && !isModeratorOrAdmin) {
      return res
        .status(403)
        .json({ message: "Не дозволено змінювати цю тему" });
    }

    const updateData = pick(req.body, [
      "title",
      "content",
      "category",
      "forumCategoryId",
      "forumSubcategoryId",
      "country",
      "city",
      "attachments",
    ]);

    if (updateData.category !== undefined && !updateData.forumCategoryId) {
      updateData.forumCategoryId = await resolveForumCategory(
        updateData.category,
      );
    }

    if (updateData.attachments && typeof updateData.attachments !== "string") {
      updateData.attachments = JSON.stringify(updateData.attachments);
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

    const isModeratorOrAdmin = ["admin", "moderator"].includes(req.user?.role);
    if (topic.userId !== req.user.userId && !isModeratorOrAdmin) {
      return res.status(403).json({ message: "Не дозволено видаляти цю тему" });
    }

    // Delete associated replies
    await ForumReply.destroy({ where: { topicId: topic.id } });
    await topic.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Помилка deleteTopic:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.togglePinTopic = async (req, res) => {
  try {
    const topic = await ForumTopic.findByPk(req.params.id);
    if (!topic) return res.status(404).json({ message: "Тему не знайдено" });

    await topic.update({ isPinned: !topic.isPinned });
    res.status(200).json(topic);
  } catch (error) {
    console.error("Помилка togglePinTopic:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.toggleCloseTopic = async (req, res) => {
  try {
    const topic = await ForumTopic.findByPk(req.params.id);
    if (!topic) return res.status(404).json({ message: "Тему не знайдено" });

    await topic.update({ isClosed: !topic.isClosed });
    res.status(200).json(topic);
  } catch (error) {
    console.error("Помилка toggleCloseTopic:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.moveTopic = async (req, res) => {
  try {
    const { targetCategoryId, targetSubcategoryId } = req.body;
    if (!targetCategoryId) {
      return res
        .status(400)
        .json({ message: "Оберіть цільову категорію для перенесення теми" });
    }

    const topic = await ForumTopic.findByPk(req.params.id);
    if (!topic) return res.status(404).json({ message: "Тему не знайдено" });

    const targetCat = await ForumCategory.findByPk(targetCategoryId);
    if (!targetCat) {
      return res.status(404).json({ message: "Цільову категорію не знайдено" });
    }

    await topic.update({
      forumCategoryId: targetCat.id,
      category: targetCat.title,
      forumSubcategoryId: targetSubcategoryId || null,
    });

    res.status(200).json(topic);
  } catch (error) {
    console.error("Помилка moveTopic:", error);
    res.status(500).json({ error: error.message });
  }
};

// ─── Replies ───────────────────────────────────────────────

exports.getReplies = async (req, res) => {
  try {
    const replies = await ForumReply.findAll({
      where: { topicId: req.params.id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "profilePicture", "role"],
        },
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

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Текст відповіді обов'язковий" });
    }

    const topic = await ForumTopic.findByPk(topicId);
    if (!topic) return res.status(404).json({ message: "Тему не знайдено" });

    const isModeratorOrAdmin = ["admin", "moderator"].includes(req.user?.role);
    if (topic.isClosed && !isModeratorOrAdmin) {
      return res
        .status(403)
        .json({ message: "Ця тема закрита для нових повідомлень" });
    }

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

    const reloaded = await ForumReply.findByPk(newReply.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "profilePicture", "role"],
        },
      ],
    });

    res.status(201).json(reloaded);
  } catch (error) {
    console.error("Помилка createReply:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateReply = async (req, res) => {
  try {
    const reply = await ForumReply.findByPk(req.params.id);
    if (!reply) return res.status(404).json({ message: "Відповідь не знайдено" });

    const isModeratorOrAdmin = ["admin", "moderator"].includes(req.user?.role);
    if (reply.userId !== req.user.userId && !isModeratorOrAdmin) {
      return res
        .status(403)
        .json({ message: "Не дозволено змінювати цю відповідь" });
    }

    await reply.update({ content: req.body.content });
    res.status(200).json(reply);
  } catch (error) {
    console.error("Помилка updateReply:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteReply = async (req, res) => {
  try {
    const reply = await ForumReply.findByPk(req.params.id);
    if (!reply) return res.status(404).json({ message: "Відповідь не знайдено" });

    const isModeratorOrAdmin = ["admin", "moderator"].includes(req.user?.role);
    if (reply.userId !== req.user.userId && !isModeratorOrAdmin) {
      return res
        .status(403)
        .json({ message: "Не дозволено видаляти цю відповідь" });
    }

    const topicId = reply.topicId;
    await reply.destroy();

    // Decrement replies count
    await ForumTopic.decrement("replies", { by: 1, where: { id: topicId } });

    res.status(204).send();
  } catch (error) {
    console.error("Помилка deleteReply:", error);
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
      where: { isActive: true, parentId: null },
      include: [
        {
          model: ForumCategory,
          as: "subcategories",
          where: { isActive: true },
          required: false,
          order: [["sortOrder", "ASC"]],
        },
      ],
      order: [
        ["sortOrder", "ASC"],
        ["id", "ASC"],
      ],
    });

    // Counts topics & replies per category
    const topicStats = await ForumTopic.findAll({
      attributes: [
        "forumCategoryId",
        [sequelize.fn("COUNT", sequelize.col("id")), "topicsCount"],
        [sequelize.fn("COALESCE", sequelize.fn("SUM", sequelize.col("replies")), 0), "postsCount"],
      ],
      group: ["forumCategoryId"],
      raw: true,
    });

    const statsMap = {};
    for (const row of topicStats) {
      if (row.forumCategoryId) {
        statsMap[row.forumCategoryId] = {
          topicsCount: Number(row.topicsCount),
          postsCount: Number(row.postsCount) || 0,
        };
      }
    }

    const enriched = categories.map((cat) => ({
      ...cat.toJSON(),
      topicsCount: statsMap[cat.id]?.topicsCount || 0,
      postsCount: statsMap[cat.id]?.postsCount || 0,
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
      where: { parentId: null },
      include: [
        {
          model: ForumCategory,
          as: "subcategories",
          required: false,
          order: [["sortOrder", "ASC"]],
        },
      ],
      order: [
        ["sortOrder", "ASC"],
        ["id", "ASC"],
      ],
    });

    const topicStats = await ForumTopic.findAll({
      attributes: [
        "forumCategoryId",
        [sequelize.fn("COUNT", sequelize.col("id")), "topicsCount"],
      ],
      group: ["forumCategoryId"],
      raw: true,
    });

    const statsMap = {};
    for (const row of topicStats) {
      if (row.forumCategoryId) {
        statsMap[row.forumCategoryId] = Number(row.topicsCount);
      }
    }

    const enriched = categories.map((cat) => ({
      ...cat.toJSON(),
      topicsCount: statsMap[cat.id] || 0,
    }));

    res.status(200).json(enriched);
  } catch (error) {
    console.error("Помилка getAllForumCategoriesAdmin:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createForumCategory = async (req, res) => {
  try {
    const { title, description, icon, color, bgColor, sortOrder, parentId } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Назва категорії обов'язкова" });
    }

    // Verify parent category if parentId given
    if (parentId) {
      const parent = await ForumCategory.findByPk(parentId);
      if (!parent) {
        return res.status(404).json({ message: "Батьківську категорію не знайдено" });
      }
    }

    const category = await ForumCategory.create({
      title: title.trim(),
      description: description || null,
      icon: icon || "forum",
      color: color || "#0057B8",
      bgColor: bgColor || "#eff6ff",
      sortOrder: sortOrder || 0,
      parentId: parentId || null,
      isActive: true,
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

    await category.update(
      pick(req.body, [
        "title",
        "description",
        "icon",
        "color",
        "bgColor",
        "sortOrder",
        "isActive",
        "parentId",
      ]),
    );

    res.status(200).json(category);
  } catch (error) {
    console.error("Помилка updateForumCategory:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteForumCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { targetCategoryId } = req.body || req.query;

    const category = await ForumCategory.findByPk(id, {
      include: [{ model: ForumCategory, as: "subcategories" }],
    });
    if (!category)
      return res.status(404).json({ message: "Категорію не знайдено" });

    // Gather IDs to check: the category itself and its subcategories
    const subCatIds = (category.subcategories || []).map((s) => s.id);
    const allCatIds = [category.id, ...subCatIds];

    // Count topics in this category or its subcategories
    const topicsCount = await ForumTopic.count({
      where: {
        [Op.or]: [
          { forumCategoryId: { [Op.in]: allCatIds } },
          { forumSubcategoryId: { [Op.in]: allCatIds } },
        ],
      },
    });

    if (topicsCount > 0) {
      if (!targetCategoryId) {
        return res.status(400).json({
          message: `Категорія містить ${topicsCount} тем. Виберіть цільову категорію для перенесення тем перед видаленням.`,
          topicsCount,
          requiresMigration: true,
        });
      }

      const targetCat = await ForumCategory.findByPk(targetCategoryId);
      if (!targetCat || allCatIds.includes(targetCat.id)) {
        return res
          .status(400)
          .json({ message: "Цільова категорія для перенесення тем недійсна" });
      }

      // Reassign all topics
      await ForumTopic.update(
        {
          forumCategoryId: targetCat.id,
          category: targetCat.title,
          forumSubcategoryId: null,
        },
        {
          where: {
            [Op.or]: [
              { forumCategoryId: { [Op.in]: allCatIds } },
              { forumSubcategoryId: { [Op.in]: allCatIds } },
            ],
          },
        },
      );
    }

    // Safely delete subcategories first, then the category
    await ForumCategory.destroy({ where: { parentId: category.id } });
    await category.destroy();

    res.status(200).json({
      message: "Категорію успішно видалено",
      reassignedTopicsCount: topicsCount,
    });
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

// ─── Category Suggestions (User form & Admin review) ────────

exports.suggestCategory = async (req, res) => {
  try {
    const { title, description, reason } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Назва категорії обов'язкова" });
    }

    const suggestion = await ForumCategorySuggestion.create({
      title: title.trim(),
      description: description || null,
      reason: reason || null,
      userId: req.user?.userId || null,
      status: "pending",
    });

    res.status(201).json(suggestion);
  } catch (error) {
    console.error("Помилка suggestCategory:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCategorySuggestions = async (req, res) => {
  try {
    const suggestions = await ForumCategorySuggestion.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(suggestions);
  } catch (error) {
    console.error("Помилка getAllCategorySuggestions:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategorySuggestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminComment, createCategoryNow, icon, color, bgColor } = req.body;

    const suggestion = await ForumCategorySuggestion.findByPk(id);
    if (!suggestion) {
      return res.status(404).json({ message: "Пропозицію не знайдено" });
    }

    if (status) suggestion.status = status;
    if (adminComment !== undefined) suggestion.adminComment = adminComment;
    await suggestion.save();

    let createdCategory = null;
    if (status === "approved" && createCategoryNow) {
      // Create the category if it doesn't already exist
      const existing = await ForumCategory.findOne({
        where: { title: suggestion.title },
      });
      if (!existing) {
        createdCategory = await ForumCategory.create({
          title: suggestion.title,
          description: suggestion.description || "",
          icon: icon || "forum",
          color: color || "#0057B8",
          bgColor: bgColor || "#eff6ff",
          isActive: true,
        });
      }
    }

    res.status(200).json({ suggestion, createdCategory });
  } catch (error) {
    console.error("Помилка updateCategorySuggestion:", error);
    res.status(500).json({ error: error.message });
  }
};

// ─── Forum Reports (Complaints) ─────────────────────────────

exports.createForumReport = async (req, res) => {
  try {
    const { topicId, replyId, reason, details } = req.body;
    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: "Вкажіть причину скарги" });
    }
    if (!topicId && !replyId) {
      return res.status(400).json({ message: "Вкажіть тему або повідомлення для скарги" });
    }

    const report = await ForumReport.create({
      topicId: topicId || null,
      replyId: replyId || null,
      reason: reason.trim(),
      details: details || null,
      userId: req.user?.userId || null,
      status: "pending",
    });

    res.status(201).json(report);
  } catch (error) {
    console.error("Помилка createForumReport:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllForumReports = async (req, res) => {
  try {
    const reports = await ForumReport.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: ForumTopic,
          as: "topic",
          attributes: ["id", "title", "author"],
        },
        {
          model: ForumReply,
          as: "reply",
          attributes: ["id", "content", "author"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(reports);
  } catch (error) {
    console.error("Помилка getAllForumReports:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateForumReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const report = await ForumReport.findByPk(id);
    if (!report) return res.status(404).json({ message: "Скаргу не знайдено" });

    if (status) report.status = status;
    await report.save();

    res.status(200).json(report);
  } catch (error) {
    console.error("Помилка updateForumReport:", error);
    res.status(500).json({ error: error.message });
  }
};
