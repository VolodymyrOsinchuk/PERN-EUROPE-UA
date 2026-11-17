// backend/migrations/20261202000001-publication-moderation-and-notifications.js
"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    const pubCols = await queryInterface.describeTable("publications");
    if (!pubCols.moderationReason) {
      await queryInterface.addColumn("publications", "moderationReason", {
        type: DataTypes.TEXT,
        allowNull: true,
      });
    }

    const notifCols = await queryInterface.describeTable("notifications");
    if (!notifCols.publicationId) {
      await queryInterface.addColumn("notifications", "publicationId", {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "publications", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }
  },

  down: async (queryInterface) => {
    await queryInterface
      .removeColumn("notifications", "publicationId")
      .catch(() => {});
    await queryInterface
      .removeColumn("publications", "moderationReason")
      .catch(() => {});
  },
};
