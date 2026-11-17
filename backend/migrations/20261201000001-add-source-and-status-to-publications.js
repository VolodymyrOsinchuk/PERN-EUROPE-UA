// backend/migrations/20261201000001-add-source-and-status-to-publications.js
"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    const cols = await queryInterface.describeTable("publications");
    const add = async (name, definition) => {
      if (!cols[name])
        await queryInterface.addColumn("publications", name, definition);
    };

    await add("status", {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "published",
    });
    await add("sourceName", { type: DataTypes.STRING(150), allowNull: true });
    await add("sourceUrl", { type: DataTypes.STRING(500), allowNull: true });
    await add("lastVerifiedAt", { type: DataTypes.DATE, allowNull: true });
    await add("verifiedBy", { type: DataTypes.STRING(100), allowNull: true });
    await add("countryCode", { type: DataTypes.STRING(2), allowNull: true });

    await queryInterface.addIndex("publications", ["status"]).catch(() => {});
    await queryInterface
      .addIndex("publications", ["countryCode"])
      .catch(() => {});
  },

  down: async (queryInterface) => {
    for (const col of [
      "countryCode",
      "verifiedBy",
      "lastVerifiedAt",
      "sourceUrl",
      "sourceName",
      "status",
    ]) {
      await queryInterface.removeColumn("publications", col).catch(() => {});
    }
  },
};
