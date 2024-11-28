require("dotenv").config();
const { Sequelize } = require("sequelize");
const config = require("./config");
const fs = require("fs");
const path = require("path");

const sequelize = new Sequelize(config.database.url, {
  logging: false,
  dialect: config.database.dialect || "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
      // ca: fs.readFileSync(path.join(__dirname, "./ca.pem"), "utf8").toString(),
    },
  },
});

module.exports = sequelize;
