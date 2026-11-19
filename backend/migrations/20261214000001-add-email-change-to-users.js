// backend/migrations/20261214000001-add-email-change-to-users.js
"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    const cols = await queryInterface.describeTable("users");
    const add = async (name, definition) => {
      if (!cols[name])
        await queryInterface.addColumn("users", name, definition);
    };

    await add("pendingEmail", { type: DataTypes.STRING(150), allowNull: true });
    // У БД зберігаємо хеш токена, а не сам токен (як при скиданні пароля)
    await add("emailChangeTokenHash", {
      type: DataTypes.STRING(64),
      allowNull: true,
    });
    await add("emailChangeExpires", { type: DataTypes.DATE, allowNull: true });

    await queryInterface
      .addIndex("users", ["emailChangeTokenHash"])
      .catch(() => {});
  },

  down: async (queryInterface) => {
    for (const col of [
      "emailChangeExpires",
      "emailChangeTokenHash",
      "pendingEmail",
    ]) {
      await queryInterface.removeColumn("users", col).catch(() => {});
    }
  },
};
