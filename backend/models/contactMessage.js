const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ContactMessage = sequelize.define(
  "ContactMessage",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { message: "Ім'я обов'язкове" } },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { isEmail: { message: "Невірний формат email" } },
    },
    subject: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: { notEmpty: { message: "Тема обов'язкова" } },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: { args: [10, 5000], msg: "Повідомлення від 10 до 5000 символів" },
      },
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "contact_messages",
    timestamps: true,
  },
);

module.exports = { ContactMessage };
