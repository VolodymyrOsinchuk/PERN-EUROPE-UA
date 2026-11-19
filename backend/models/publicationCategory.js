// backend/models/publicationCategory.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PublicationCategory = sequelize.define(
  "PublicationCategory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: "Назва категорії обов'язкова" } },
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  { tableName: "publication_categories", timestamps: true },
);

module.exports = { PublicationCategory };
