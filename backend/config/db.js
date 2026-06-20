require("dotenv").config();
const config = require("./config");
const fs = require("fs");
const path = require("path");

const { Sequelize } = require("sequelize");
let sequelize;

if (process.env.NODE_ENV === "production") {
  sequelize = new Sequelize(config.db.url, {
    logging: false,
    protocol: "postgres",
    dialect: config.db.dialect || "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: process.env.DB_CA_CERT_BASE64
          ? Buffer.from(process.env.DB_CA_CERT_BASE64, "base64").toString(
              "utf8",
            )
          : undefined,
      },
    },
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      dialect: "postgres",
      protocol: "postgres",
      // Supprimé dialectModule: pg pour éviter les problèmes
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    },
  );
}

module.exports = sequelize;
