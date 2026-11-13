const { Adv, PUBLIC_WHERE } = require("../models/adv");
const { Category, SubCategory } = require("../models/category");
const { User } = require("../models/user");
const { deleteCloudinaryFile } = require("../config/cloudinary");
const { normalizePhone } = require("../utils/normalizePhone");
const {
  readContactSettings,
  DEFAULT_CONTACT,
} = require("../utils/contactSettings");
const { toPublicAd, isAdPublic } = require("../utils/publicAd");
const { notifyAdOwner } = require("../services/notificationService");

exports.createAnnonce = async (req, res) => {
  try {
    const {
      amenities,
      categoryId,
      city,
      country,
      description,
      email,
      location,
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
      .json({ error: "Внутрішня помилка сервера", message: error.message });
  }
};

exports.getAllAnnonces = async (req, res) => {
  try {
    const annonces = await Adv.findAll({
      where: PUBLIC_WHERE,
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        // Раніше тут був email продавця — прибрано.
        { model: User, as: "user", attributes: ["id", "firstName"] },
      ],
      order: [["datePosted", "DESC"]],
    });
    res.status(200).json(annonces.map((a) => toPublicAd(a)));
  } catch (error) {
    console.error("Помилка getAllAnnonces:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAnnonceById = async (req, res) => {
  try {
    const annonce = await Adv.findByPk(req.params.id);
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
    res.status(500).json({ error: error.message });
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
        { model: User, as: "user", attributes: ["id", "email"] },
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
      .json({ error: "Помилка оновлення", details: error.message });
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
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
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
