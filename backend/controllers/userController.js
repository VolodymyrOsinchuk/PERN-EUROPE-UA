const { User } = require("../models/user");
const { Adv } = require("../models/adv");
const { Category } = require("../models/category");
const { deleteCloudinaryFile } = require("../config/cloudinary");
const path = require("path");
const fs = require("fs");
const { pick } = require("../utils/pick");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
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
    if (!user)
      return res.status(404).json({ message: "Користувача не знайдено" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Помилка getUserById:", error);
    res.status(500).json({ error: error.message });
  }
};

// exports.createUser = async (req, res) => {
//   try {
//     const newUser = await User.create(req.body);
//     const userWithoutPassword = newUser.toJSON();
//     delete userWithoutPassword.password;
//     res.status(201).json(userWithoutPassword);
//   } catch (error) {
//     console.error("Помилка createUser:", error);
//     if (error.name === "SequelizeValidationError") {
//       return res.status(400).json({
//         error: "Помилка валідації",
//         details: error.errors.map((e) => e.message),
//       });
//     }
//     if (error.name === "SequelizeUniqueConstraintError") {
//       return res.status(409).json({ error: "Email вже використовується" });
//     }
//     res.status(500).json({ error: error.message });
//   }
// };

exports.createUser = async (req, res) => {
  try {
    // FIX P1-1: liste blanche — empêche l'injection de role, isVerified, id...
    const allowed = pick(req.body, [
      "firstName",
      "lastName",
      "email",
      "password",
      "phoneNumber",
      "country",
      "state",
      "city",
      "location",
    ]);

    // Seul un admin authentifié (déjà garanti par le router) peut définir
    // explicitement le rôle d'un compte créé via cette route admin.
    if (req.body.role && req.user?.role === "admin") {
      allowed.role = req.body.role;
    }

    const newUser = await User.create(allowed);
    const userWithoutPassword = newUser.toJSON();
    delete userWithoutPassword.password;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Помилка createUser:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Помилка валідації",
        details: error.errors.map((e) => e.message),
      });
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Email вже використовується" });
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
      city,
      location,
      about,
      role, // FIX P0-5: extrait mais volontairement ignoré sauf si admin
    } = req.body;

    const user = await User.findByPk(id);
    if (!user)
      return res.status(404).json({ message: "Користувача не знайдено" });

    const updateData = {
      firstName: firstName ?? user.firstName,
      lastName: lastName ?? user.lastName,
      email: email ?? user.email,
      phoneNumber: phoneNumber ?? user.phoneNumber,
      country: country ?? user.country,
      state: state ?? user.state,
      city: city ?? user.city,
      location: location ?? user.location,
      about: about ?? user.about,
    };

    // FIX P0-5: seul un admin peut changer le rôle d'un compte
    if (role !== undefined && req.user.role === "admin") {
      updateData.role = role;
    }

    await user.update(updateData);

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
    console.log("uploadProfilePicture controller reached");
    if (!req.cloudinaryUrl) {
      console.log("req.cloudinaryUrl is missing");
      return res.status(400).json({ message: "Файл не завантажено" });
    }

    console.log("User ID from token:", req.user.userId);
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      console.log("User not found in DB");
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    // Supprimer l'ancienne photo : Cloudinary si http, fichier legacy sinon
    if (
      user.profilePicture &&
      user.profilePicture !== "/uploads/profile/default.png"
    ) {
      console.log("Old profile picture exists:", user.profilePicture);
      if (user.profilePicture.startsWith("http")) {
        console.log("Deleting old photo from Cloudinary...");
        await deleteCloudinaryFile(user.profilePicture);
      } else {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "public",
          user.profilePicture,
        );
        console.log("Deleting old local photo:", oldImagePath);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Помилка видалення старого фото:", err);
        });
      }
    }

    console.log("Updating user profile picture to:", req.cloudinaryUrl);
    await user.update({ profilePicture: req.cloudinaryUrl });
    console.log("User updated successfully");
    res.status(200).json({ profilePicture: req.cloudinaryUrl });
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
  if (newPassword.length < 8) {
    return res
      .status(400)
      .json({ message: "Новий пароль має містити мінімум 8 символів" });
  }

  try {
    const user = await User.findByPk(req.user.userId);
    if (!user)
      return res.status(404).json({ message: "Користувача не знайдено" });

    const isPasswordCorrect = await user.validatePassword(oldPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Невірний поточний пароль" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Пароль успішно оновлено" });
  } catch (error) {
    console.error("Помилка updatePassword:", error);
    res.status(500).json({ error: error.message });
  }
};

// backend/controllers/userController.js
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Користувача не знайдено" });

    // if (
    //   user.profilePicture &&
    //   user.profilePicture !== "/uploads/profile/default.png"
    // ) {
    //   if (user.profilePicture.startsWith("http")) {
    //     await deleteCloudinaryFile(user.profilePicture);
    //   } else {
    //     const abs = path.join(
    //       __dirname,
    //       "..",
    //       "public",
    //       user.profilePicture.replace(/^\//, ""),
    //     );
    //     fs.unlink(abs, (err) => {
    //       if (err) console.error("Erreur suppression avatar:", err.message);
    //     });
    //   }
    // }

    // FIX P1-6: purge Cloudinary de l'avatar (était filtré sur !startsWith("http"),
    // ce qui ratait systématiquement les avatars Cloudinary qui SONT des URLs http)
    if (user.profilePicture) {
      await deleteCloudinaryFile(user.profilePicture);
    }

    // FIX P1-6 + D5: purge les annonces de l'utilisateur et leurs photos
    // Cloudinary AVANT de supprimer le compte, en forçant individualHooks
    // pour déclencher le hook beforeDestroy de chaque Adv.
    await Adv.destroy({
      where: { userId: user.id },
      individualHooks: true,
    });

    await user.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Помилка deleteUser:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const [userCount, adCount, categoryCount] = await Promise.all([
      User.count(),
      Adv.count(),
      Category.count(),
    ]);
    res
      .status(200)
      .json({ users: userCount, ads: adCount, categories: categoryCount });
  } catch (error) {
    console.error("Помилка getDashboardStats:", error);
    res.status(500).json({ error: error.message });
  }
};
