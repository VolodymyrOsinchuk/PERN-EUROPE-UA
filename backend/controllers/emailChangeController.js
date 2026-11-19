// backend/controllers/emailChangeController.js
const crypto = require("crypto");
const { Op } = require("sequelize");
const { User } = require("../models/user");
const {
  sendEmailChangeConfirmation,
  sendEmailChangedNotice,
} = require("../services/brevo/mailService");

const CHANGE_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 година
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOKEN_RE = /^[a-f0-9]{64}$/;

const hashToken = (raw) =>
  crypto.createHash("sha256").update(raw).digest("hex");

const normalizeEmail = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

// POST /users/change-email  { newEmail, password }
// Поточна адреса не змінюється: зміна лише запитується і чекає підтвердження.
exports.requestEmailChange = async (req, res) => {
  try {
    const newEmail = normalizeEmail(req.body?.newEmail);
    const password = req.body?.password;

    if (!EMAIL_RE.test(newEmail) || newEmail.length > 150) {
      return res.status(400).json({ message: "Вкажіть коректну нову адресу" });
    }
    if (typeof password !== "string" || !password) {
      return res.status(400).json({ message: "Вкажіть поточний пароль" });
    }

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    // Пароль підтверджує, що запит зробив власник акаунта
    const passwordOk = await user.validatePassword(password);
    if (!passwordOk) {
      return res.status(401).json({ message: "Невірний пароль" });
    }

    if (newEmail === user.email) {
      return res.status(400).json({ message: "Це вже ваша поточна адреса" });
    }

    const taken = await User.findOne({
      where: { email: newEmail },
      attributes: ["id"],
    });
    if (taken) {
      return res
        .status(409)
        .json({ message: "Ця адреса вже використовується" });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    await user.update({
      pendingEmail: newEmail,
      emailChangeTokenHash: hashToken(rawToken),
      emailChangeExpires: new Date(Date.now() + CHANGE_TOKEN_TTL_MS),
    });

    // Лист іде на НОВУ адресу: підтверджує, що вона належить користувачу
    await sendEmailChangeConfirmation(newEmail, user.firstName, rawToken);

    return res.status(200).json({
      message:
        "Ми надіслали лист із посиланням на нову адресу. Підтвердіть зміну протягом години.",
    });
  } catch (error) {
    console.error("Помилка requestEmailChange:", error.name);
    return res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

// POST /auth/confirm-email-change/:token
// POST, а не GET: поштові сканери переходять за посиланнями і не мають змінювати дані.
exports.confirmEmailChange = async (req, res) => {
  try {
    const { token } = req.params;
    if (typeof token !== "string" || !TOKEN_RE.test(token)) {
      return res.status(400).json({ message: "Посилання недійсне" });
    }

    const user = await User.findOne({
      where: {
        emailChangeTokenHash: hashToken(token),
        emailChangeExpires: { [Op.gt]: new Date() },
      },
    });
    if (!user || !user.pendingEmail) {
      return res
        .status(400)
        .json({ message: "Посилання недійсне або термін його дії минув" });
    }

    // Адресу могли зайняти, поки лист був у дорозі
    const taken = await User.findOne({
      where: { email: user.pendingEmail, id: { [Op.ne]: user.id } },
      attributes: ["id"],
    });
    if (taken) {
      await user.update({
        pendingEmail: null,
        emailChangeTokenHash: null,
        emailChangeExpires: null,
      });
      return res
        .status(409)
        .json({ message: "Ця адреса вже використовується" });
    }

    const oldEmail = user.email;
    await user.update({
      email: user.pendingEmail,
      pendingEmail: null,
      emailChangeTokenHash: null, // одноразовий токен
      emailChangeExpires: null,
    });

    // Попередження на стару адресу: якщо зміну зробив не власник, він помітить
    await sendEmailChangedNotice(oldEmail, user.firstName);

    return res.status(200).json({ message: "Нову адресу підтверджено" });
  } catch (error) {
    console.error("Помилка confirmEmailChange:", error.name);
    return res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

// DELETE /users/change-email — скасувати очікувану зміну
exports.cancelEmailChange = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }
    await user.update({
      pendingEmail: null,
      emailChangeTokenHash: null,
      emailChangeExpires: null,
    });
    return res.status(204).send();
  } catch (error) {
    console.error("Помилка cancelEmailChange:", error.name);
    return res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};
