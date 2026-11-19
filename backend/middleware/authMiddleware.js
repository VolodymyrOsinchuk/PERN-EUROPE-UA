const jwt = require("jsonwebtoken");
const { User } = require("../models/user"); // Adjust path as needed
const { verifyJWT } = require("../utils/tokenUtils");
const { Op } = require("sequelize");

// Витягує JWT із заголовка Authorization або з cookie (запасний варіант).
const getTokenFromRequest = (req) => {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) return header.slice(7);
  return req.cookies?.token || null;
};

const FIVE_MINUTES_MS = 5 * 60 * 1000;

const authMiddleware = async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({
      error: "Токен не надано",
      message: "Потрібна автентифікація",
    });
  }

  try {
    const { userId, email, role, tokenVersion } = await verifyJWT(token);
    const user = await User.findByPk(userId, {
      attributes: ["tokenVersion"],
    });
    if (!user || user.tokenVersion !== tokenVersion) {
      return res.status(401).json({
        error: "Сесію завершено",
        message: "Після зміни пароля або email всі сесії було завершено",
      });
    }
    req.user = { userId, email, role };
    // Оновлюємо lastSeen не частіше ніж раз на 5 хвилин, щоб уникнути
    // запису в БД при кожному запиті (кешування/прайс-чеки тощо).
    await User.update(
      { lastSeen: new Date() },
      {
        where: {
          id: userId,
          [Op.or]: [
            { lastSeen: null },
            {
              lastSeen: {
                [Op.lt]: new Date(Date.now() - FIVE_MINUTES_MS),
              },
            },
          ],
        },
        silent: true,
      },
    ).catch(() => {});
    next();
  } catch (error) {
    console.error("Помилка автентифікації:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Невірний токен",
        message: "Автентифікація не виконана",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Токен прострочений",
        message: "Будь ласка, увійдіть знову",
      });
    }
    res.status(500).json({
      error: "Помилка сервера",
      message: "Процес автентифікації не виконано",
    });
  }
};

// Optional: Role-based authorization middleware
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Не авторизовано",
        message: "Потрібна автентифікація",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Заборонено",
        message: "Недостатньо прав доступу",
      });
    }

    next();
  };
};

// Identifie l'utilisateur si un token valide est présent, sans bloquer sinon.
const optionalAuth = async (req, res, next) => {
  const { token } = req.cookies || {};
  if (!token) return next();
  try {
    const { userId, email, role } = await verifyJWT(token);
    req.user = { userId, email, role };
  } catch {
    // Token invalide ou expiré : on traite la requête comme anonyme.
  }
  next();
};

module.exports = {
  authMiddleware,
  roleMiddleware,
  optionalAuth,
};
