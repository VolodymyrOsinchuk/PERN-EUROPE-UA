// backend/models/faqItem.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { User } = require("./user");

const FaqItem = sequelize.define(
  "FaqItem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    question: {
      type: DataTypes.STRING(300),
      allowNull: false,
      validate: { notEmpty: { msg: "Питання обов'язкове" } },
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: { msg: "Відповідь обов'язкова" } },
    },
    category: { type: DataTypes.STRING(100), allowNull: true },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    updatedBy: { type: DataTypes.INTEGER, allowNull: true },
  },
  { tableName: "faq_items", timestamps: true },
);

FaqItem.belongsTo(User, { foreignKey: "updatedBy", as: "editor" });

module.exports = { FaqItem };
