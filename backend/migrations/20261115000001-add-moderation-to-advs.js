"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    const columns = await queryInterface.describeTable("advs");

    if (!columns.moderationStatus) {
      await queryInterface.addColumn("advs", "moderationStatus", {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: "pending",
      });
    }
    if (!columns.moderationReason) {
      await queryInterface.addColumn("advs", "moderationReason", {
        type: DataTypes.TEXT,
        allowNull: true,
      });
    }
    if (!columns.moderatedBy) {
      await queryInterface.addColumn("advs", "moderatedBy", {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
    }
    if (!columns.moderatedAt) {
      await queryInterface.addColumn("advs", "moderatedAt", {
        type: DataTypes.DATE,
        allowNull: true,
      });
    }
    if (!columns.publishedAt) {
      await queryInterface.addColumn("advs", "publishedAt", {
        type: DataTypes.DATE,
        allowNull: true,
      });
    }

    // Les annonces déjà en ligne restent visibles : on les approuve.
    await queryInterface.sequelize.query(`
      UPDATE advs
      SET "moderationStatus" = 'approved',
          "publishedAt" = COALESCE("datePosted", NOW())
      WHERE "moderationStatus" = 'pending'
    `);
  },

  down: async (queryInterface) => {
    for (const col of [
      "publishedAt",
      "moderatedAt",
      "moderatedBy",
      "moderationReason",
      "moderationStatus",
    ]) {
      await queryInterface.removeColumn("advs", col).catch(() => {});
    }
  },
};
