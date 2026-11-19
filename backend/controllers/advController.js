const { Adv, PUBLIC_WHERE } = require("../models/adv");
const { Category, SubCategory } = require("../models/category");
const { User } = require("../models/user");
const { Notification } = require("../models/notification");
const { deleteCloudinaryFile } = require("../config/cloudinary");
const { normalizePhone } = require("../utils/normalizePhone");
const {
  readContactSettings,
  DEFAULT_CONTACT,
} = require("../utils/contactSettings");
const { toPublicAd, isAdPublic } = require("../utils/publicAd");
const { notifyAdOwner } = require("../services/notificationService");
const sequelize = require("../config/db");
const { Op } = require("sequelize");

exports.createAnnonce = async (req, res) => {
  try {
    const {
      amenities,
      categoryId,
      city,
      country,
      description,
      email,
      latitude,
      location,
      longitude,
      phone,
      price,
      state,
      subcategoryId,
      title,
    } = req.body;

    const photoPaths = req.cloudinaryUrls || [];

    const newAd = await Adv.create({
      title,
      description,
      price: price ? parseFloat(price) : null,
      categoryId: parseInt(categoryId),
      subcategoryId: subcategoryId ? parseInt(subcategoryId) : null,
      country,
      state,
      city,
      location: location || null,
      latitude: latitude != null ? parseFloat(latitude) : null,
      longitude: longitude != null ? parseFloat(longitude) : null,
      phone: normalizePhone(phone),
      email,
      amenities: amenities || [],
      photos: photoPaths,
      status: "Active",
      moderationStatus: req.body.draft === "true" ? "draft" : "pending",
      moderationReason: null,
      moderatedBy: null,
      moderatedAt: null,
      publishedAt: null,
      userId: req.user.userId,
      datePosted: new Date(),
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      views: 0,
      isPromoted: false,
      ...(readContactSettings(req.body) || DEFAULT_CONTACT),
    });

    if (newAd.moderationStatus === "pending") {
      await notifyAdOwner({
        userId: req.user.userId,
        advId: newAd.id,
        title: newAd.title,
        type: "ad_pending",
      });

      // Notify all admins and moderators about a new ad awaiting moderation
      const staff = await User.findAll({
        where: { role: ["admin", "moderator"] },
        attributes: ["id"],
      });
      await Promise.all(
        staff.map((u) =>
          Notification.create({
            userId: u.id,
            advId: newAd.id,
            type: "ad_pending",
            message: `Нове оголошення «${newAd.title}» на чекає модерації.`,
          })
        )
      );
    }

    return res.status(201).json({
      message: "Оголошення успішно створено",
      advert: newAd,
    });
  } catch (error) {
    console.error("Помилка createAnnonce:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Помилка валідації",
        details: error.errors.map((e) => e.message),
      });
    }
    res
      .status(500)
      .json({ error: "Внутрішня помилка сервера", message: "Внутрішня помилка сервера" });
  }
};

exports.getAllAnnonces = async (req, res) => {
  try {
    const pageParam = req.query.page;
    const limitParam = req.query.limit;
    const paginated = pageParam !== undefined || limitParam !== undefined;
    const page = Math.max(1, parseInt(pageParam, 10) || 1);
    const limit = Math.min(48, Math.max(1, parseInt(limitParam, 10) || 24));
    const offset = (page - 1) * limit;
    const minPrice =
      req.query.minPrice != null && String(req.query.minPrice).trim() !== ""
        ? Number(req.query.minPrice)
        : null;
    const maxPrice =
      req.query.maxPrice != null && String(req.query.maxPrice).trim() !== ""
        ? Number(req.query.maxPrice)
        : null;
    const sort = ["newest", "oldest", "priceAsc", "priceDesc", "popular"].includes(
      req.query.sort,
    )
      ? req.query.sort
      : "newest";
    const search = req.query.search ? String(req.query.search).trim() : null;
    const category = req.query.category ? String(req.query.category).trim() : null;
    const city = req.query.city ? String(req.query.city).trim() : null;
    const country = req.query.country ? String(req.query.country).trim() : null;
    const state = req.query.state ? String(req.query.state).trim() : null;
    const lat = req.query.lat ? parseFloat(req.query.lat) : null;
    const lng = req.query.lng ? parseFloat(req.query.lng) : null;
    const radius = req.query.radius ? parseFloat(req.query.radius) : null; // км

    const where = { ...PUBLIC_WHERE };
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (category) {
      const categoryId = parseInt(category, 10);
      if (!Number.isNaN(categoryId) && categoryId > 0) {
        where.categoryId = categoryId;
      }
    }
    if (city) where.city = city;
    if (country) where.country = country;
    if (state) where.state = state;

    // Фільтр за радіусом (км) нав ponto (lat, lng)
    let distanceSql = null;
    if (lat != null && lng != null && radius != null && Number.isFinite(lat) && Number.isFinite(lng) && Number.isFinite(radius)) {
      where.latitude = { [Op.not]: null };
      where.longitude = { [Op.not]: null };
      distanceSql = `
        6371 * acos(
          least(1, greatest(-1,
            cos(radians(${lat})) * cos(radians("Adv"."latitude")) * cos(radians("Adv"."longitude") - radians(${lng}))
            + sin(radians(${lat})) * sin(radians("Adv"."latitude"))
          ))
        )
      `;
    }

    if (
      Number.isFinite(minPrice) &&
      minPrice >= 0 &&
      (!Number.isFinite(maxPrice) || maxPrice < 0 || minPrice <= maxPrice)
    ) {
      where.price = {
        ...(where.price || {}),
        [Op.gte]: minPrice,
      };
    }
    if (
      Number.isFinite(maxPrice) &&
      maxPrice >= 0 &&
      (!Number.isFinite(minPrice) || minPrice < 0 || minPrice <= maxPrice)
    ) {
      where.price = {
        ...(where.price || {}),
        [Op.lte]: maxPrice,
      };
    }

    const orderBy = {
      newest: [["datePosted", "DESC"]],
      oldest: [["datePosted", "ASC"]],
      priceAsc: [["price", "ASC"]],
      priceDesc: [["price", "DESC"]],
      popular: [["views", "DESC"]],
    }[sort];

    const query = {
      where,
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        // Раніше тут був email продавця — прибрано.
        { model: User, as: "user", attributes: ["id", "firstName"] },
      ],
      order: orderBy,
    };

    if (distanceSql) {
      query.attributes = {
        include: [[sequelize.literal(distanceSql), "distance"]],
      };
      query.having = sequelize.where(sequelize.literal("distance"), { [Op.lte]: radius });
      query.order = [
        [sequelize.literal("distance"), "ASC"],
        ...(orderBy || []),
      ];
    }

    if (!paginated) {
      const annonces = await Adv.findAll({ ...query, limit });
      res.set("Cache-Control", "public, max-age=30");
      return res.status(200).json(annonces.map((a) => toPublicAd(a)));
    }

    const { rows, count } = await Adv.findAndCountAll({
      ...query,
      limit,
      offset,
      distinct: true,
    });
    res.set("Cache-Control", "public, max-age=30");
    return res.status(200).json({
      ads: rows.map((a) => toPublicAd(a)),
      total: count,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(count / limit)),
    });
  } catch (error) {
    console.error("Помилка getAllAnnonces:", error);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
};

exports.getSellerProfile = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ message: "Некоректний ідентифікатор" });
    }

    const seller = await User.findByPk(userId, {
      attributes: [
        "id",
        "firstName",
        "lastName",
        "profilePicture",
        "country",
        "city",
        "createdAt",
        "lastSeen",
      ],
    });
    if (!seller) {
      return res.status(404).json({ message: "Продавця не знайдено" });
    }

    const ads = await Adv.findAll({
      where: { ...PUBLIC_WHERE, userId },
      include: [{ model: Category, as: "category", attributes: ["id", "name"] }],
      order: [["datePosted", "DESC"]],
      limit: 24,
    });

    res.status(200).json({
      seller: seller.toJSON(),
      ads: ads.map((ad) => toPublicAd(ad)),
    });
  } catch (error) {
    console.error("Помилка getSellerProfile:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

exports.getAnnonceById = async (req, res) => {
  try {
    const annonce = await Adv.findByPk(req.params.id, {
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: User, as: "user", attributes: ["id", "firstName", "lastName"] },
      ],
    });
    if (!annonce) {
      return res.status(404).json({ message: "Оголошення не знайдено" });
    }

    const viewer = { userId: req.user?.userId, role: req.user?.role };
    const isOwner = viewer.userId != null && annonce.userId === viewer.userId;
    const isStaff = ["admin", "moderator"].includes(viewer.role);
    const isPublic = isAdPublic(annonce);

    if (!isPublic && !isOwner && !isStaff) {
      return res.status(404).json({ message: "Оголошення не знайдено" });
    }

    if (isPublic) {
      await annonce.increment("views");
    }
    res.status(200).json(toPublicAd(annonce, viewer));
  } catch (error) {
    console.error("Помилка getAnnonceById:", error);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
};

exports.updateAnnonce = async (req, res) => {
  try {
    const adv = req.adv;

    if (adv.userId !== req.user.userId) {
      return res.status(403).json({ message: "Не дозволено" });
    }

    const {
      title,
      description,
      price,
      categoryId,
      country,
      state,
      city,
      location,
      email,
      phone,
      amenities,
    } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined && price !== "")
      updateData.price = parseFloat(price);
    if (categoryId !== undefined) updateData.categoryId = parseInt(categoryId);
    if (country !== undefined) updateData.country = country;
    if (state !== undefined) updateData.state = state;
    if (city !== undefined) updateData.city = city;
    if (location !== undefined) updateData.location = location;
    if (latitude !== undefined) updateData.latitude = latitude != null ? parseFloat(latitude) : null;
    if (longitude !== undefined) updateData.longitude = longitude != null ? parseFloat(longitude) : null;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = normalizePhone(phone);
    if (amenities !== undefined) updateData.amenities = amenities;

    // Налаштування зв'язку: лише якщо форма їх передала.
    const contact = readContactSettings(req.body);
    if (contact) Object.assign(updateData, contact);

    if (req.cloudinaryUrls && req.cloudinaryUrls.length > 0) {
      updateData.photos = [...(adv.photos || []), ...req.cloudinaryUrls];
    }

    if (req.body.existingPhotos) {
      try {
        const kept = JSON.parse(req.body.existingPhotos);
        const removed = (adv.photos || []).filter((p) => !kept.includes(p));
        await Promise.all(removed.map((url) => deleteCloudinaryFile(url)));
        updateData.photos = [...kept, ...(req.cloudinaryUrls || [])];
      } catch (parseError) {
        console.error(
          "updateAnnonce: existingPhotos mal formé —",
          parseError.message,
        );
        return res
          .status(400)
          .json({ error: "existingPhotos doit être un tableau JSON valide" });
      }
    }

    // Модерація: звичайний користувач не може обійти її.
    // Чернетка лишається чернеткою до явного надсилання.
    const isStaff = ["admin", "moderator"].includes(req.user.role);
    if (!isStaff && adv.moderationStatus !== "draft") {
      updateData.moderationStatus = "pending";
      updateData.moderationReason = null;
    }

    await adv.update(updateData);

    const updatedAdv = await Adv.findByPk(adv.id, {
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: User, as: "user", attributes: ["id", "firstName"] },
      ],
    });

    res
      .status(200)
      .json({ message: "Оголошення успішно оновлено", data: updatedAdv });
  } catch (error) {
    console.error("Помилка updateAnnonce:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Помилка валідації",
        details: error.errors.map((e) => e.message),
      });
    }
    res
      .status(500)
      .json({ error: "Помилка оновлення", details: "Внутрішня помилка сервера" });
  }
};

exports.deleteAnnonce = async (req, res) => {
  try {
    // req.adv est injecté par checkOwnership — garantit que adv.userId === req.user.userId
    const adv = req.adv;

    if (adv.photos?.length) {
      await Promise.all(adv.photos.map((url) => deleteCloudinaryFile(url)));
    }

    await adv.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Помилка deleteAnnonce:", error);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
};

exports.getUserAnnonces = async (req, res) => {
  try {
    const annonces = await Adv.findAll({
      where: { userId: req.user.userId },
      attributes: {
        exclude: ["amenities"],
      },
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
      ],
      order: [["datePosted", "DESC"]],
    });
    res.status(200).json(annonces);
  } catch (error) {
    console.error("Помилка getUserAnnonces:", error);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
};

exports.submitForModeration = async (req, res) => {
  try {
    const adv = req.adv; // injecté par checkOwnership

    if (
      !["draft", "needs_changes", "rejected"].includes(adv.moderationStatus)
    ) {
      return res.status(409).json({
        message: "Цей статус не дозволяє повторну відправку",
      });
    }

    await sequelize.transaction(async (t) => {
      await adv.update(
        { moderationStatus: "pending", moderationReason: null },
        { transaction: t },
      );
      await notifyAdOwner({
        userId: adv.userId,
        advId: adv.id,
        title: adv.title,
        type: "ad_pending",
        transaction: t,
      });
    });

    res.status(200).json({
      message: "Оголошення надіслано на модерацію",
      data: adv,
    });
  } catch (error) {
    console.error("Помилка submitForModeration:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

exports.refreshAnnonce = async (req, res) => {
  try {
    const adv = req.adv;
    if (adv.status !== "Active" || adv.moderationStatus !== "approved") {
      return res.status(409).json({
        message: "Оновити можна лише активне опубліковане оголошення",
      });
    }

    await adv.update({ datePosted: new Date(), expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
    res.status(200).json({
      message: "Оголошення піднято в пошуку",
      data: adv,
    });
  } catch (error) {
    console.error("Помилка refreshAnnonce:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

exports.markAnnonceSold = async (req, res) => {
  try {
    const adv = req.adv;
    await adv.update({ status: "Sold" });
    res.status(200).json({
      message: "Оголошення позначено як продане",
      data: adv,
    });
  } catch (error) {
    console.error("Помилка markAnnonceSold:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

exports.reorderPhotos = async (req, res) => {
  try {
    const adv = req.adv;
    const { photos } = req.body;

    if (!Array.isArray(photos)) {
      return res
        .status(400)
        .json({ error: "Поле photos має бути масивом URL-адрес" });
    }

    const current = adv.photos || [];
    // Дозволяємо лише переставляння існуючих URL (нових смайликів тут немає)
    const sorted = current.filter((url) => photos.includes(url));
    if (sorted.length !== current.length) {
      return res.status(400).json({ error: "Набір фото не збігається" });
    }

    await adv.update({ photos: sorted });
    res.status(200).json({
      message: "Порядок фото оновлено",
      photos: sorted,
    });
  } catch (error) {
    console.error("Помилка reorderPhotos:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

/**
 * Інкрементує лічильник кліків по контакту (телефон/email).
 * Власники не можуть накручувати власні оголошення.
 */
exports.contactClick = async (req, res) => {
  try {
    const adv = await Adv.findByPk(req.params.id);
    if (!adv) {
      return res.status(404).json({ error: "Оголошення не знайдено" });
    }

    // Не рахуємо кліки власника оголошення
    if (req.user && adv.userId === req.user.userId) {
      return res.status(200).json({
        message: "Клік власника не рахується",
        contactClicks: adv.contactClicks,
      });
    }

    await adv.increment("contactClicks");
    await adv.reload();

    res.status(200).json({
      message: "Клік по контактів зареєстровано",
      contactClicks: adv.contactClicks,
    });
  } catch (error) {
    console.error("Помилка contactClick:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

/**
 * Аналітика оголошення для власника: перегляди та кліки по контактів.
 */
exports.getAdAnalytics = async (req, res) => {
  try {
    const adv = await Adv.findByPk(req.params.id, {
      attributes: ["id", "title", "views", "contactClicks", "datePosted"],
    });
    if (!adv) {
      return res.status(404).json({ error: "Оголошення не знайдено" });
    }

    if (adv.userId !== req.user.userId) {
      return res.status(403).json({ error: "Не дозволено" });
    }

    res.status(200).json({
      id: adv.id,
      title: adv.title,
      views: adv.views,
      contactClicks: adv.contactClicks,
      datePosted: adv.datePosted,
    });
  } catch (error) {
    console.error("Помилка getAdAnalytics:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

/**
 * Автопідказки пошуку: категорії та записи, що відповідають запиту q.
 * GET /api/v1/adv/suggestions?q=...
 */
exports.suggestions = async (req, res) => {
  try {
    const q = req.query.q ? String(req.query.q).trim() : "";
    const limit = Math.min(10, Math.max(1, parseInt(req.query.limit, 10) || 5));

    const ads = [];
    const categories = [];

    if (q) {
      const foundAds = await Adv.findAll({
        where: {
          ...PUBLIC_WHERE,
          [Op.or]: [
            { title: { [Op.iLike]: `%${q}%` } },
            { description: { [Op.iLike]: `%${q}%` } },
          ],
        },
        limit,
        attributes: ["id", "title", "city", "price", "photos"],
        include: [
          { model: Category, as: "category", attributes: ["id", "name"] },
        ],
      });

      for (const ad of foundAds) {
        ads.push({
          type: "ad",
          id: ad.id,
          title: ad.title,
          subtitle: ad.category?.name || "",
          city: ad.city,
          price: ad.price,
          photo: ad.photos && ad.photos.length > 0 ? ad.photos[0] : null,
        });
      }

      const foundCats = await Category.findAll({
        where: {
          name: { [Op.iLike]: `%${q}%` },
        },
        limit,
        attributes: ["id", "name"],
      });

      for (const cat of foundCats) {
        categories.push({
          type: "category",
          id: cat.id,
          title: cat.name,
          subtitle: "Категорія",
        });
      }
    }

    res.status(200).json({ ads, categories, query: q });
  } catch (error) {
    console.error("Помилка suggestions:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

/**
 * Масове отримання оголошень для порівняння.
 * GET /api/v1/adv/bulk?ids=1,2,3
 */
exports.bulk = async (req, res) => {
  try {
    const idsParam = req.query.ids;
    if (!idsParam) {
      return res.status(400).json({ error: "Параметр ids обов'язковий" });
    }

    const ids = idsParam
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => Number.isInteger(n) && n > 0);

    if (ids.length === 0 || ids.length > 5) {
      return res
        .status(400)
        .json({ error: "Вкажіть від 1 до 5 ідентифікаторів" });
    }

    const advs = await Adv.findAll({
      where: {
        ...PUBLIC_WHERE,
        id: { [Op.in]: ids },
      },
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: SubCategory, as: "subcategory", attributes: ["id", "name"] },
      ],
    });

    res.status(200).json(advs.map((a) => toPublicAd(a)));
  } catch (error) {
    console.error("Помилка bulk:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

/**
 * Підказки заповнення оголошення: яких деталей бракує.
 * GET /api/v1/adv/completeness/:id
 */
exports.completeness = async (req, res) => {
  try {
    const adv = await Adv.findByPk(req.params.id);
    if (!adv) {
      return res.status(404).json({ error: "Оголошення не знайдено" });
    }

    const tips = [];

    if (!adv.description || adv.description.trim().length < 30) {
      tips.push({
        field: "description",
        message: "Додайте більш детальний опис (ściше 30 символів)",
        priority: "high",
      });
    }

    if (!adv.photos || adv.photos.length === 0) {
      tips.push({
        field: "photos",
        message: "Додайте хоча б одне фото — оголошення з фото negative Negotiable",
        priority: "high",
      });
    }

    if (!adv.phone) {
      tips.push({
        field: "phone",
        message: "Вкажіть телефон для зворотного зв'язку",
        priority: "medium",
      });
    }

    if (!adv.location) {
      tips.push({
        field: "location",
        message: "Вкажіть точну адресу або квартал",
        priority: "medium",
      });
    }

    if (adv.price == null) {
      tips.push({
        field: "price",
        message: "Вкажіть ціну або позначте, що магазин",
        priority: "low",
      });
    }

    if (!adv.amenities || adv.amenities.length === 0) {
      tips.push({
        field: "amenities",
        message: "Додайте характеристики/зручності",
        priority: "low",
      });
    }

    const score = Math.max(0, 100 - tips.length * 15);

    res.status(200).json({
      adId: adv.id,
      score,
      tips,
      isComplete: tips.length === 0,
    });
  } catch (error) {
    console.error("Помилка completeness:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};
