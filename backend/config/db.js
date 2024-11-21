require("dotenv").config();
const { Sequelize } = require("sequelize");
const config = require("./config");

const sequelize = new Sequelize(config.database.url, {
  logging: false,
  dialect: config.database.dialect || "postgres",
});

module.exports = sequelize;
