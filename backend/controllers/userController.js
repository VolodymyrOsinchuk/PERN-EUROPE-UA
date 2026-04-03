const { User } = require("../models/user");
const { Adv } = require("../models/adv");
const { Category } = require("../models/category");
const path = require("path");
const fs = require("fs");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Помилка getAllUsers:", error);
    res.status(500).json({ error: error.message });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ["password"] },
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "Користувача не знайдено" });
    }
  } catch (error) {
    console.error("Помилка getUserById:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Помилка createUser:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Помилка валідації",
        details: error.errors.map((e) => e.message),
      });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      country,
      state,
      location,
      about,
    } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.country = country || user.country;
    user.state = state || user.state;
    user.location = location || user.location;
    user.about = about || user.about;

    await user.save();

    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Помилка updateUser:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Помилка валідації",
        details: error.errors.map((e) => e.message),
      });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Файл не завантажено" });
    }

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    if (
      user.profilePicture &&
      user.profilePicture !== "/uploads/profile/default.png"
    ) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "public",
        user.profilePicture,
      );
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error("Помилка видалення старого фото:", err);
      });
    }

    const profilePictureUrl = `/uploads/profile/${req.file.filename}`;
    user.profilePicture = profilePictureUrl;
    await user.save();

    res.status(200).json({ profilePicture: profilePictureUrl });
  } catch (error) {
    console.error("Помилка uploadProfilePicture:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Будь ласка, вкажіть старий та новий паролі" });
  }

  try {
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    const isPasswordCorrect = await user.validatePassword(oldPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Невірні облікові дані" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Пароль успішно оновлено" });
  } catch (error) {
    console.error("Помилка updatePassword:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send("Користувача видалено");
    } else {
      res.status(404).json({ message: "Користувача не знайдено" });
    }
  } catch (error) {
    console.error("Помилка deleteUser:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const userCount = await User.count();
    const adCount = await Adv.count();
    const categoryCount = await Category.count();

    res.status(200).json({
      users: userCount,
      ads: adCount,
      categories: categoryCount,
    });
  } catch (error) {
    console.error("Помилка getDashboardStats:", error);
    res.status(500).json({ error: error.message });
  }
};
