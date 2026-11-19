// backend/migrations/20261210000001-create-country-pages-and-links.js
"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable("country_pages", {
      code: {
        type: DataTypes.STRING(2),
        primaryKey: true,
        allowNull: false,
      },
      name: { type: DataTypes.STRING(100), allowNull: false },
      flag: { type: DataTypes.STRING(10), allowNull: true },
      disclaimer: { type: DataTypes.TEXT, allowNull: true },
      isPublished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      lastVerifiedAt: { type: DataTypes.DATE, allowNull: true },
      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    });

    await queryInterface.createTable("country_links", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      countryCode: {
        type: DataTypes.STRING(2),
        allowNull: false,
        references: { model: "country_pages", key: "code" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      category: { type: DataTypes.STRING(40), allowNull: false },
      title: { type: DataTypes.STRING(255), allowNull: false },
      url: { type: DataTypes.STRING(500), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      sortOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      lastVerifiedAt: { type: DataTypes.DATE, allowNull: false },
      verifiedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    });

    await queryInterface.addIndex("country_links", ["countryCode"]);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("country_links");
    await queryInterface.dropTable("country_pages");
  },
};
