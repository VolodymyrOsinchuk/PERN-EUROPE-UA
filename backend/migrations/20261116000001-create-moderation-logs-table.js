"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable("moderation_logs", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      advId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "advs", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      moderatorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      previousStatus: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      newStatus: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex("moderation_logs", ["advId"]);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("moderation_logs");
  },
};
