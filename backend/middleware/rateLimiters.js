const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");

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

// 10 messages par heure et par utilisateur connecté
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) =>
    // Utilisateurs connectés : limité par userId ; visiteurs (formulaire public) : limité par IP
    req.user ? String(req.user.userId) : ipKeyGenerator(req.ip),
  message: {
    error: "Забагато повідомлень",
    message: "Спробуйте знову через годину",
  },
});

// 5 запитів на відновлення / годину / IP
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Забагато запитів",
    message: "Спробуйте знову через годину",
  },
});

module.exports = {
  loginLimiter,
  registerLimiter,
  verifyEmailLimiter,
  contactLimiter,
  passwordResetLimiter,
};
