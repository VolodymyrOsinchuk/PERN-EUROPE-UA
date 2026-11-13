"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    // Перебудова безпечна лише для порожніх таблиць.
    const [rows] = await queryInterface.sequelize.query(
      `SELECT (SELECT COUNT(*) FROM conversations)::int
            + (SELECT COUNT(*) FROM messages)::int AS total`,
    );
    if (rows[0].total > 0) {
      throw new Error(
        "conversations/messages не порожні: перебудову зупинено.",
      );
    }

    await queryInterface.dropTable("messages");
    await queryInterface.dropTable("conversations");

    await queryInterface.createTable("conversations", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      adId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "advs", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      buyerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      sellerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      lastMessageAt: { type: DataTypes.DATE, allowNull: true },
      lastNotifiedAt: { type: DataTypes.DATE, allowNull: true },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    });

    // Одна розмова на пару (оголошення, покупець).
    await queryInterface.addIndex("conversations", ["adId", "buyerId"], {
      unique: true,
      name: "conversations_ad_buyer_unique",
    });
    await queryInterface.addIndex("conversations", ["sellerId"]);

    await queryInterface.createTable("messages", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "conversations", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      body: { type: DataTypes.TEXT, allowNull: false },
      readAt: { type: DataTypes.DATE, allowNull: true },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    });

    await queryInterface.addIndex("messages", ["conversationId", "id"]);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("messages");
    await queryInterface.dropTable("conversations");
  },
};
