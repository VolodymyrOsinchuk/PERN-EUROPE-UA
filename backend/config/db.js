const config = require("./config");
const { Sequelize } = require("sequelize");

// Développement et production utilisent la MÊME base PostgreSQL,
// définie par DATABASE_URL (obligatoire — voir config/config.js).
// Il n'y a donc pas de branche « local » : pour cibler une base
// locale en développement, faites pointer DATABASE_URL dessus,
// par exemple : postgres://postgres:motdepasse@localhost:5432/europe-ua
function isLocalUrl(url) {
  try {
    const { hostname } = new URL(url);
    return ["localhost", "127.0.0.1", "::1"].includes(hostname);
  } catch {
    return false;
  }
}

const useSsl = !isLocalUrl(config.db.url);

const sequelize = new Sequelize(config.db.url, {
  logging: false,
  protocol: "postgres",
  dialect: config.db.dialect || "postgres",
  dialectOptions: useSsl
    ? {
        ssl: {
          require: true,
          // Correspond à « sslmode=no-verify » dans DATABASE_URL
          rejectUnauthorized: false,
          ca: process.env.DB_CA_CERT_BASE64
            ? Buffer.from(process.env.DB_CA_CERT_BASE64, "base64").toString(
                "utf8",
              )
            : undefined,
        },
      }
    : { ssl: false },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;
