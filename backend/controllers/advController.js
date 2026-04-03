const { Adv } = require("../models/adv");
const { Category, SubCategory } = require("../models/category");
const { User } = require("../models/user");
const sharp = require("sharp"); // Для зміни розміру та оптимізації зображень
// Покращений middleware для створення оголошення

// Middleware валідації
const validateFields = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      categoryId,
      subcategoryId,
      country,
      state,
      city,
      location,
      email,
      phone,
    } = req.body;

    // Валідація обов'язкових полів
    if (!title || !description || !categoryId || !subcategoryId) {
      return res.status(400).json({
        error: "Усі обов'язкові поля мають бути заповнені",
      });
    }

    // Валідація ціни
    if (price && (isNaN(price) || price < 0)) {
      return res.status(400).json({
        error: "Ціна має бути додатним числом",
      });
    }

    // Перевірка існування категорії
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({
        error: "Недійсна категорія",
      });
    }

    // Перевірка існування підкатегорії
    const subcategory = await SubCategory.findByPk(subcategoryId);
    if (!subcategory || subcategory.categoryId !== parseInt(categoryId)) {
      return res.status(400).json({
        error: "Недійсна підкатегорія або вона не відповідає категорії",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

exports.createAnnonce = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      categoryId,
      subcategoryId,
      country,
      state,
      city,
      location,
      phone,
      email,
      amenities,
    } = req.body;

    const photoPaths = req.files ? req.files.map((file) => file.path) : [];

    const adData = {
      title,
      description,
      price: parseFloat(price) || null,
      categoryId: parseFloat(categoryId),
      subcategoryId: parseFloat(subcategoryId),
      country,
      state,
      city,
      location,
      phone,
      email,
      amenities,
      photos: photoPaths,
      status: "Active",
      userId: req.user.userId,
      datePosted: new Date(),
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      views: 0,
      isPromoted: false,
    };

    const newAd = await Adv.create(adData);

    return res.status(201).json({
      message: "Оголошення успішно створено",
      advert: newAd,
    });
  } catch (error) {
    console.error("Помилка створення оголошення:", error);

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Помилка валідації",
        details: error.errors.map((e) => e.message),
      });
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        error: "Виник конфлікт",
        details: error.errors.map((e) => e.message),
      });
    }

    res.status(500).json({
      error: "Внутрішня помилка сервера",
      message: error.message,
    });
  }
};
exports.getAllAnnonces = async (req, res) => {
  try {
    const annonces = await Adv.findAll({
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "email"],
        },
      ],
    });
    res.status(200).json(annonces);
  } catch (error) {
    console.error("Помилка getAllAnnonces:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAnnonceById = async (req, res) => {
  try {
    const annonce = await Adv.findByPk(req.params.id);
    if (annonce) {
      res.status(200).json(annonce);
    } else {
      res.status(404).json({ message: "Оголошення не знайдено" });
    }
  } catch (error) {
    console.error("Помилка getAnnonceById:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateAnnonce = async (req, res) => {
  try {
    const adv = req.adv;

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
      status,
      amenities,
    } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (categoryId) updateData.categoryId = categoryId;
    if (country) updateData.country = country;
    if (state) updateData.state = state;
    if (city) updateData.city = city;
    if (location) updateData.location = location;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (status) updateData.status = status;
    if (amenities) updateData.amenities = amenities;

    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map((file) => file.path);
      updateData.photos = [...(adv.photos || []), ...newPhotos];
    }

    await adv.update(updateData);

    const updatedAdv = await Adv.findByPk(adv.id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "email"],
        },
      ],
    });

    res.status(200).json({
      message: "Оголошення успішно оновлено",
      data: updatedAdv,
    });
  } catch (error) {
    console.error("Помилка updateAnnonce:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Помилка валідації",
        details: error.errors.map((e) => e.message),
      });
    }
    res.status(500).json({
      error: "Помилка під час оновлення оголошення",
      details: error.message,
    });
  }
};

exports.deleteAnnonce = async (req, res) => {
  try {
    const deleted = await Adv.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Оголошення не знайдено" });
    }
  } catch (error) {
    console.error("Помилка deleteAnnonce:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUserAnnonces = async (req, res) => {
  try {
    const userId = req.user.userId;
    const annonces = await Adv.findAll({
      where: { userId },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
      order: [["datePosted", "DESC"]],
    });
    res.status(200).json(annonces);
  } catch (error) {
    console.error("Помилка getUserAnnonces:", error);
    res.status(500).json({ error: error.message });
  }
};
