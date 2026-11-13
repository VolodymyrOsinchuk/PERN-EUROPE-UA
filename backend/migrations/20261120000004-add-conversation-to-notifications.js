"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    const cols = await queryInterface.describeTable("notifications");
    if (!cols.conversationId) {
      await queryInterface.addColumn("notifications", "conversationId", {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "conversations", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  },

  down: async (queryInterface) => {
    await queryInterface
      .removeColumn("notifications", "conversationId")
      .catch(() => {});
  },
};
