const { Publication } = require("../models/publication");
const PUBLICATION_CATEGORIES = require("../config/publicationCategories");
const { User } = require("../models/user");
const { sanitizeText, sanitizeRichText } = require("../utils/sanitize");
const {
  normalizePublicationInput,
  toBool,
  resolveStatus,
} = require("../utils/publicationInput");
const sequelize = require("../config/db");
const {
  PUBLICATION_NOTIFICATION_TYPES: NT,
  notifyPublicationAuthor,
} = require("../services/publicationNotificationService");

const parseId = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

// GET /publications?countryCode=PL
exports.getAllPublications = async (req, res) => {
  try {
    const where = { status: "published" };
    if (req.query.countryCode && /^[A-Z]{2}$/.test(req.query.countryCode)) {
      where.countryCode = req.query.countryCode;
    }
    const publications = await Publication.findAll({
      where,
      order: [["date", "DESC"]],
    });
    res.status(200).json(publications);
  } catch (error) {
    console.error("Помилка getAllPublications:", error);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
};

// GET /publications/user-publications
exports.getUserPublications = async (req, res) => {
  try {
    const publications = await Publication.findAll({
      where: { userId: req.user.userId },
      order: [["date", "DESC"]],
    });
    res.status(200).json(publications);
  } catch (error) {
    console.error("Помилка getUserPublications:", error);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
};

exports.getPublicationById = async (req, res) => {
  try {
    const pub = await Publication.findByPk(req.params.id);
    if (!pub)
      return res.status(404).json({ message: "Публікацію не знайдено" });

    const viewer = req.user;
    const canSeeDraft =
      viewer &&
      (pub.userId === viewer.userId ||
        ["admin", "moderator"].includes(viewer.role));

    if (pub.status !== "published" && !canSeeDraft) {
      // 404, щоб не підтверджувати існування чернетки
      return res.status(404).json({ message: "Публікацію не знайдено" });
    }
    res.status(200).json(pub);
  } catch (error) {
    console.error("Помилка getPublicationById:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

exports.createPublication = async (req, res) => {
  try {
    const isStaff = ["admin", "moderator"].includes(req.user.role);
    const {
      title,
      content,
      category,
      readTime,
      countryCode,
      sourceName,
      sourceUrl,
    } = req.body;

    // Категорія: лише зі списку
    if (!PUBLICATION_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: "Невідома категорія" });
    }

    // Країна: порожньо = загальна стаття, інакше код ISO
    const code = countryCode ? String(countryCode).toUpperCase() : null;
    if (code && !/^[A-Z]{2}$/.test(code)) {
      return res.status(400).json({ message: "Некоректний код країни" });
    }

    // Джерело: лише https
    let source = null;
    if (sourceUrl) {
      try {
        const u = new URL(sourceUrl);
        if (u.protocol !== "https:") throw new Error();
        source = u.toString();
      } catch {
        return res
          .status(400)
          .json({ message: "Посилання на джерело має бути https-адресою" });
      }
    }

    const wantsPublish = toBool(req.body.publish);
    const sourceChecked = toBool(req.body.sourceChecked);

    // Звичайний користувач завжди створює чернетку.
    // Адмін може опублікувати одразу, але зі джерелом — лише після підтвердження.
    const status = resolveStatus({
      isStaff,
      currentStatus: null,
      body: req.body,
    });
    if (status === "published" && source && !sourceChecked) {
      return res
        .status(400)
        .json({ message: "Підтвердіть, що джерело перевірено" });
    }

    const user = await User.findByPk(req.user.userId, {
      attributes: ["firstName", "lastName"],
    });
    const authorName = user
      ? `${user.firstName} ${user.lastName}`.trim()
      : null;
    const verified = status === "published" && Boolean(source) && sourceChecked;

    const newPublication = await Publication.create({
      title: sanitizeText(title),
      content: sanitizeRichText(content),
      category,
      readTime: readTime ? sanitizeText(readTime) : null,
      countryCode: code,
      sourceName: sourceName ? sanitizeText(sourceName) : null,
      sourceUrl: source,
      status,
      lastVerifiedAt: verified ? new Date() : null,
      verifiedBy: verified ? authorName : null,
      userId: req.user.userId,
      author: authorName || req.body.author || null,
    });

    res.status(201).json(newPublication);
  } catch (error) {
    console.error("Помилка createPublication:", error);
    res.status(500).json({ message: "Помилка створення публікації" });
  }
};

exports.updatePublication = async (req, res) => {
  try {
    const pub = await Publication.findByPk(req.params.id);

    if (!pub) {
      return res.status(404).json({
        message: "Публікацію не знайдено",
      });
    }

    const isStaff = ["admin", "moderator"].includes(req.user.role);

    if (pub.userId !== req.user.userId && !isStaff) {
      return res.status(403).json({
        message: "Не дозволено змінювати цю публікацію",
      });
    }

    // Звичайний користувач не редагує опубліковану статтю
    if (!isStaff && pub.status === "published") {
      return res.status(403).json({
        message: "Опубліковану статтю може змінити лише адміністратор",
      });
    }

    // Перевірка та нормалізація даних
    const parsed = normalizePublicationInput(req.body);

    if (parsed.error) {
      return res.status(400).json({
        message: parsed.error,
      });
    }

    const d = parsed.data;

    if (d.category && !PUBLICATION_CATEGORIES.includes(d.category)) {
      return res.status(400).json({
        message: "Невідома категорія",
      });
    }

    if (d.title) {
      d.title = sanitizeText(d.title);
    }

    if (d.content) {
      d.content = sanitizeRichText(d.content);
    }

    const previousStatus = pub.status;
    const status = resolveStatus({
      isStaff,
      currentStatus: previousStatus,
      body: req.body,
    });
    const becomingPublished =
      status === "published" && previousStatus !== "published";
    const sourceChecked = toBool(req.body.sourceChecked);
    const sourceChanged = d.sourceUrl !== pub.sourceUrl;
    const needsCheck =
      Boolean(d.sourceUrl) && (sourceChanged || becomingPublished);

    if (status === "published" && needsCheck && !sourceChecked) {
      return res
        .status(400)
        .json({ message: "Підтвердіть, що джерело перевірено" });
    }

    const actor = await User.findByPk(req.user.userId, {
      attributes: ["firstName", "lastName"],
    });
    const actorName = actor
      ? `${actor.firstName} ${actor.lastName}`.trim()
      : null;

    let lastVerifiedAt = pub.lastVerifiedAt;
    let verifiedBy = pub.verifiedBy;
    if (!d.sourceUrl) {
      lastVerifiedAt = null;
      verifiedBy = null;
    } else if (needsCheck) {
      const verifiedNow = status === "published" && sourceChecked;
      lastVerifiedAt = verifiedNow ? new Date() : null;
      verifiedBy = verifiedNow ? actorName : null;
    }

    // Подані на перевірку та опубліковані статті не мають причини повернення.
    const moderationReason =
      status === "pending" || status === "published"
        ? null
        : pub.moderationReason;

    await sequelize.transaction(async (t) => {
      await pub.update(
        { ...d, status, lastVerifiedAt, verifiedBy, moderationReason },
        { transaction: t },
      );
      if (becomingPublished) {
        await notifyPublicationAuthor({
          pub,
          type: NT.published,
          actorId: req.user.userId,
          transaction: t,
        });
      }
    });

    res.status(200).json(pub);
  } catch (error) {
    console.error("Помилка updatePublication:", error);

    return res.status(500).json({
      error: "Внутрішня помилка сервера",
    });
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
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
};

// GET /publications/moderation/queue — лише статті на перевірці
exports.getModerationQueue = async (req, res) => {
  try {
    const items = await Publication.findAll({
      where: { status: "pending" },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });
    res.status(200).json(items);
  } catch (error) {
    console.error("Помилка getModerationQueue:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

// PATCH /publications/moderation/:id/publish
exports.publishPublication = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id)
      return res.status(400).json({ message: "Некоректний ідентифікатор" });

    const pub = await Publication.findByPk(id);
    if (!pub)
      return res.status(404).json({ message: "Публікацію не знайдено" });

    if (!["draft", "pending", "needs_changes"].includes(pub.status)) {
      return res
        .status(409)
        .json({ message: `Не можна опублікувати зі статусу «${pub.status}»` });
    }

    const sourceChecked = toBool(req.body?.sourceChecked);
    if (pub.sourceUrl && !sourceChecked) {
      return res
        .status(400)
        .json({ message: "Підтвердіть, що джерело перевірено" });
    }

    const actor = await User.findByPk(req.user.userId, {
      attributes: ["firstName", "lastName"],
    });
    const actorName = actor
      ? `${actor.firstName} ${actor.lastName}`.trim()
      : null;

    await sequelize.transaction(async (t) => {
      await pub.update(
        {
          status: "published",
          moderationReason: null,
          lastVerifiedAt: pub.sourceUrl ? new Date() : null,
          verifiedBy: pub.sourceUrl ? actorName : null,
        },
        { transaction: t },
      );
      await notifyPublicationAuthor({
        pub,
        type: NT.published,
        actorId: req.user.userId,
        transaction: t,
      });
    });

    res.status(200).json(pub);
  } catch (error) {
    console.error("Помилка publishPublication:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

// GET /publications/moderation/counts — для лічильника в меню
exports.getModerationCounts = async (req, res) => {
  try {
    const pending = await Publication.count({ where: { status: "pending" } });
    res.status(200).json({ pending });
  } catch (error) {
    console.error("Помилка getModerationCounts:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

// PATCH /publications/moderation/:id/needs-changes  { reason }
exports.requestPublicationChanges = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id)
      return res.status(400).json({ message: "Некоректний ідентифікатор" });

    const reason =
      typeof req.body?.reason === "string" ? sanitizeText(req.body.reason) : "";
    if (reason.length < 5 || reason.length > 1000) {
      return res
        .status(400)
        .json({ message: "Вкажіть причину (від 5 до 1000 символів)" });
    }

    const pub = await Publication.findByPk(id);
    if (!pub)
      return res.status(404).json({ message: "Публікацію не знайдено" });
    if (pub.status !== "pending") {
      return res
        .status(409)
        .json({ message: "Повернути можна лише статтю на перевірці" });
    }

    await sequelize.transaction(async (t) => {
      await pub.update(
        { status: "needs_changes", moderationReason: reason },
        { transaction: t },
      );
      await notifyPublicationAuthor({
        pub,
        type: NT.needsChanges,
        actorId: req.user.userId,
        reason,
        transaction: t,
      });
    });

    res.status(200).json(pub);
  } catch (error) {
    console.error("Помилка requestPublicationChanges:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

// PATCH /publications/moderation/:id/archive
exports.archivePublication = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id)
      return res.status(400).json({ message: "Некоректний ідентифікатор" });

    const pub = await Publication.findByPk(id);
    if (!pub)
      return res.status(404).json({ message: "Публікацію не знайдено" });

    await pub.update({ status: "archived" });
    res.status(200).json(pub);
  } catch (error) {
    console.error("Помилка archivePublication:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};
