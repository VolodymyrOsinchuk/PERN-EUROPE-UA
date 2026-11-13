"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable("message_reports", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      messageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "messages", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      reporterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      reason: { type: DataTypes.STRING(100), allowNull: false },
      details: { type: DataTypes.TEXT, allowNull: true },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "pending",
      },
      decidedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      decidedAt: { type: DataTypes.DATE, allowNull: true },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    });

    // Один користувач — одна скарга на одне повідомлення.
    await queryInterface.addIndex(
      "message_reports",
      ["messageId", "reporterId"],
      {
        unique: true,
        name: "message_reports_message_reporter_unique",
      },
    );
    await queryInterface.addIndex("message_reports", ["status"]);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("message_reports");
  },
};
