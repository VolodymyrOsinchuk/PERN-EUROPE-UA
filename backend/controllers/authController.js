const { User } = require("../models/user");
const crypto = require("crypto");
const { sendVerificationEmail } = require("../utils/emailService");
const { createJWT } = require("../utils/tokenUtils");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Відсутні дані для реєстрації" });
    }

    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      country,
      city,
      agreeToTerms,
    } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: "Електронна пошта, пароль, ім'я та прізвище обов'язкові",
      });
    }

    const isFirstAccount = (await User.count()) === 0;
    if (isFirstAccount) {
      req.body.role = "admin";
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Користувач вже існує" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      verificationToken,
      country,
      city,
      agreeToTerms,
    });

    await sendVerificationEmail(user.email, firstName, verificationToken);

    res.status(201).json({
      message: "Користувача успішно створено",
      userId: user.id,
      token: verificationToken,
    });
  } catch (error) {
    console.error("Помилка під час реєстрації:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Помилка валідації",
        details: error.errors.map((e) => e.message),
      });
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Виник конфлікт",
        details: error.errors.map((e) => e.message),
      });
    }
    res.status(500).json({
      message: "Помилка під час реєстрації",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Електронна пошта та пароль обов'язкові" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Невірні облікові дані" });
    }

    const isMatch = await bcrypt.compare(password, user.dataValues.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Невірні облікові дані" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Будь ласка, підтвердіть свій аккаунт" });
    }

    const token = createJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await user.update({ lastLogin: new Date() });

    const oneDay = 1000 * 60 * 60 * 24;

    const userLogin = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res
      .status(200)
      .json({
        message: "Користувач увійшов в систему",
        user: userLogin,
        token,
      });
  } catch (error) {
    console.error("Помилка під час входу:", error);
    res.status(500).json({
      message: "Помилка під час входу",
      error: error.message,
    });
  }
};

exports.logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({ message: "Користувач вийшов із системи" });
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      where: { verificationToken: token },
    });

    if (!user) {
      return res.status(400).json({ message: "Невірний токен підтвердження" });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: "Електронну пошту успішно підтверджено" });
  } catch (error) {
    console.error("Помилка під час підтвердження електронної пошти:", error);
    res.status(500).json({
      message: "Помилка під час підтвердження електронної пошти",
      error: error.message,
    });
  }
};
