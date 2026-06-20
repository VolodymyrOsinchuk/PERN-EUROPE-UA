const rateLimit = require("express-rate-limit");

// 5 tentatives de connexion / 15 min / IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Забагато спроб входу",
    message: "Спробуйте знову через 15 хвилин",
  },
  // Compte les échecs ET succès par défaut ; pour ne compter que les échecs,
  // utiliser skipSuccessfulRequests: true
  skipSuccessfulRequests: true,
});

// 5 inscriptions / heure / IP — évite la création massive de comptes
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Забагато реєстрацій",
    message: "Спробуйте знову через годину",
  },
});

// 10 demandes de vérification email / heure / IP
const verifyEmailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter, registerLimiter, verifyEmailLimiter };
