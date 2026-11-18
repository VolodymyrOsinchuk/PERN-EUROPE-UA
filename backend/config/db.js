const config = require("./config");
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

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

function removeInsecureSslMode(url) {
  const parsedUrl = new URL(url);
  if (parsedUrl.searchParams.get("sslmode")?.toLowerCase() === "no-verify") {
    parsedUrl.searchParams.delete("sslmode");
  }
  return parsedUrl.toString();
}

const databaseUrl = removeInsecureSslMode(config.db.url);
const useSsl = !isLocalUrl(databaseUrl);

function resolveCaCertificate() {
  if (process.env.DB_CA_CERT_BASE64) {
    return Buffer.from(process.env.DB_CA_CERT_BASE64, "base64").toString(
      "utf8",
    );
  }

  if (process.env.DB_CA_CERT_PATH) {
    const caPath = path.resolve(process.env.DB_CA_CERT_PATH);
    if (fs.existsSync(caPath)) return fs.readFileSync(caPath, "utf8");
  }

  const defaultCaPath = path.join(__dirname, "ca.pem");
  if (fs.existsSync(defaultCaPath)) {
    return fs.readFileSync(defaultCaPath, "utf8");
  }

  return undefined;
}

const sequelize = new Sequelize(databaseUrl, {
  logging: false,
  protocol: "postgres",
  dialect: config.db.dialect || "postgres",
  dialectOptions: useSsl
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: true,
          ca: resolveCaCertificate(),
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
