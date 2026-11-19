// backend/migrations/20261216000001-create-publication-categories.js
"use strict";

const { DataTypes } = require("sequelize");

const SEED = [
  "Документи",
  "Робота",
  "Житло",
  "Допомога",
  "Сім'я",
  "Освіта",
  "Медицина",
  "Транспорт",
  "Фінанси",
  "Інтеграція",
  "Культура",
  "Життя в Європі",
];

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable("publication_categories", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
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
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    });

    const now = new Date();
    await queryInterface.bulkInsert(
      "publication_categories",
      SEED.map((name, i) => ({
        name,
        sortOrder: (i + 1) * 10,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      })),
    );
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("publication_categories");
  },
};
