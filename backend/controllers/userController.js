const { Op } = require("sequelize");
const crypto = require("crypto");
const { User } = require("../models/user");
const { Adv } = require("../models/adv");
const { Category } = require("../models/category");
const { Report } = require("../models/report");
const { deleteCloudinaryFile } = require("../config/cloudinary");
const path = require("path");
const fs = require("fs");
const { pick } = require("../utils/pick");
const { normalizePhone } = require("../utils/normalizePhone");
const {
  sendPasswordChangedEmail,
  sendVerificationEmail,
} = require("../services/brevo/mailService");

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 години

const PUBLIC_USER_ATTRIBUTES = [
  "id",
  "firstName",
  "lastName",
  "email",
  "phoneNumber",
  "country",
  "state",
  "city",
  "location",
  "about",
  "profilePicture",
  "role",
  "isVerified",
  "lastLogin",
  "lastSeen",
  "createdAt",
  "updatedAt",
];

const SENSITIVE_FIELDS = [
  "password",
  "emailChangeTokenHash",
  "verificationToken",
  "resetPasswordToken",
  "resetPasswordExpires",
];

exports.getAllUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit, 10) || 50));
    const { rows, count } = await User.findAndCountAll({
      attributes: { exclude: SENSITIVE_FIELDS },
      order: [["lastSeen", "DESC"], ["lastLogin", "DESC"], ["id", "DESC"]],
      limit,
      offset: (page - 1) * limit,
    });
    res.status(200).json({ users: rows, total: count, page, limit });
  } catch (error) {
    console.error("Помилка getAllUsers:", error);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id || req.user.userId;
    const user = await User.findByPk(userId, {
      attributes: { exclude: SENSITIVE_FIELDS },
    });
    if (!user)
      return res.status(404).json({ message: "Користувача не знайдено" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Помилка getUserById:", error);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
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
//     res.status(500).json({ error: "Внутрішня помилка сервера" });
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
    if (req.user.role === "admin") {
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
    res.status(500).json({ error: "Внутрішня помилка сервера" });
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
      phoneNumber:
        phoneNumber !== undefined
          ? normalizePhone(phoneNumber)
          : user.phoneNumber,
      country: country ?? user.country,
      state: state ?? user.state,
      city: city ?? user.city,
      location: location ?? user.location,
      about: about ?? user.about,
    };

    // Зміна email вимагає підтвердження нової адреси.
    // Email не змінюється одразу: ставимо pendingEmail + токен верифікації,
    // список на нову адресу. Після переходу за посиланням email оновлюється.
    if (email && req.user.role === "admin" ? email : user.email) {
      const verificationToken = crypto.randomBytes(32).toString("hex");
      updateData.pendingEmail = email;
      updateData.verificationToken = verificationToken;
      updateData.verificationTokenExpires = new Date(
        Date.now() + VERIFICATION_TOKEN_TTL_MS,
      );
      // Не змінюємо isVerified тут — користувач ще ввіряє старий email.
      // Після підтвердження pendingEmail стає основним і isVerified = true.

      // Зміна email скидає інші сесії.
      updateData.tokenVersion = (user.tokenVersion || 0) + 1;

      try {
        await sendVerificationEmail(email, user.firstName, verificationToken);
      } catch (mailErr) {
        console.error("Помилка надсилання листа верифікації:", mailErr);
      }
    }

    // Seul un admin peut changer le rôle d'un compte
    if (role !== undefined && req.user.role === "admin") {
      updateData.role = role;
    }

    await user.update(updateData);

    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: SENSITIVE_FIELDS },
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
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
};

exports.uploadProfilePicture = async (req, res) => {
  try {
    console.log("Контролер uploadProfilePicture викликано");
    if (!req.cloudinaryUrl) {
      console.log("req.cloudinaryUrl відсутній");
      return res.status(400).json({ message: "Файл не завантажено" });
    }

    console.log("ID користувача з токена:", req.user.userId);
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      console.log("Користувача не знайдено в базі даних");
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    // Supprimer l'ancienne photo : Cloudinary si http, fichier legacy sinon
    if (
      user.profilePicture &&
      user.profilePicture !== "/uploads/profile/default.png"
    ) {
      console.log("Старе фото профілю існує:", user.profilePicture);
      if (user.profilePicture.startsWith("http")) {
        console.log("Видалення старого фото з Cloudinary...");
        await deleteCloudinaryFile(user.profilePicture);
      } else {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "public",
          user.profilePicture,
        );
        console.log("Видалення старого локального фото:", oldImagePath);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Помилка видалення старого фото:", err);
        });
      }
    }

    console.log("Оновлення фото профілю користувача на:", req.cloudinaryUrl);
    await user.update({ profilePicture: req.cloudinaryUrl });
    console.log("Користувача успішно оновлено");
    res.status(200).json({ profilePicture: req.cloudinaryUrl });
  } catch (error) {
    console.error("Помилка uploadProfilePicture:", error);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
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

    // Зміна пароля скидає інші сесії (JWT-revocation через tokenVersion).
    user.password = newPassword;
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();
    await sendPasswordChangedEmail(user.email, user.firstName);

    res.status(200).json({ message: "Пароль успішно оновлено" });
  } catch (error) {
    console.error("Помилка updatePassword:", error);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
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

    if (user.profilePicture?.startsWith("http")) {
      await deleteCloudinaryFile(user.profilePicture);
    }

    // FIX P1-6 + D5: purge les annonces de l'utilisateur et leurs photos
    // Cloudinary AVANT de supprimer le compte, en forçant individualHooks
    // pour déclencher le hook beforeDestroy de chaque Adv.
    await Adv.destroy({
      where: { userId: user.id },
      individualHooks: true,
    });

    // Повідомлення про скарги, написані іншими користувачами
    // (userId-cascade не діює на reportedUserId)
    await Report.destroy({ where: { reportedUserId: user.id } });

    await user.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Помилка deleteUser:", error);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const prevMonth = new Date();
    prevMonth.setMonth(prevMonth.getMonth() - 2);

    const [
      userCount,
      adCount,
      categoryCount,
      prevUsers,
      prevAds,
      prevCategories,
    ] = await Promise.all([
      User.count(),
      Adv.count(),
      Category.count(),
      User.count({ where: { createdAt: { [Op.lt]: lastMonth } } }),
      Adv.count({ where: { createdAt: { [Op.lt]: lastMonth } } }),
      Category.count({ where: { createdAt: { [Op.lt]: lastMonth } } }),
    ]);

    const calcTrend = (current, previous) => {
      if (previous === 0) return current > 0 ? "+100%" : "0%";
      const diff = ((current - previous) / previous) * 100;
      const sign = diff >= 0 ? "+" : "";
      return `${sign}${diff.toFixed(0)}%`;
    };

    res.status(200).json({
      users: userCount,
      ads: adCount,
      categories: categoryCount,
      trends: {
        users: calcTrend(userCount, prevUsers),
        ads: calcTrend(adCount, prevAds),
        categories: calcTrend(categoryCount, prevCategories),
      },
    });
  } catch (error) {
    console.error("Помилка getDashboardStats:", error);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
};
