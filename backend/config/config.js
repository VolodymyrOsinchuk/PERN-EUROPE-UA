// config/index.js
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

// Charger le bon fichier .env selon NODE_ENV
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

const envPath = path.join(__dirname, "..", envFile);

// Charger .env si présent
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  // fallback : charger .env à la racine du projet si aucun fichier spécifique trouvé
  dotenv.config();
}

// Helper pour parser int avec fallback
function parseIntOr(value, fallback) {
  const n = Number(value);
  return Number.isInteger(n) ? n : fallback;
}

// Helper pour récupérer variable obligatoire
function required(name) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return process.env[name];
}

module.exports = {
  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseIntOr(process.env.DB_PORT, 5432),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "mydb",
    url: process.env.DATABASE_URL || null,
    dialect: "postgres",
  },

  server: {
    port: parseIntOr(process.env.SERVER_PORT, 5000),
  },

  client: {
    url: process.env.BACKEND_URL || "http://localhost:5000",
  },

  jwt: {
    secret: process.env.JWT_SECRET || required("JWT_SECRET"),
    expirationTime: process.env.JWT_EXPIRATION || "7d",
  },

  email: {
    smtp: {
      host: process.env.EMAIL_HOST || "smtp.mailgun.org",
      port: parseIntOr(process.env.EMAIL_PORT, 587),
      user: process.env.EMAIL_USER || null,
      pass: process.env.EMAIL_PASS || null,
      secure: process.env.EMAIL_SECURE === "true" || false,
    },
    from: process.env.EMAIL_FROM || "no-reply@example.com",
  },

  // Optionnel : flags et comportements
  features: {
    enableAutoExpiry: process.env.ENABLE_AUTO_EXPIRY === "true" || false,
  },
};
