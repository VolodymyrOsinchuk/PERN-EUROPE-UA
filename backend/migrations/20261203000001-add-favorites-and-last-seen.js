"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn("users", "lastSeen", {
      type: DataTypes.DATE,
      allowNull: true,
    });

    await queryInterface.createTable("favorite_ads", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      advId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "advs", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    });

    await queryInterface.addIndex("favorite_ads", ["userId", "advId"], {
      unique: true,
      name: "favorite_ads_user_adv_unique",
    });
    await queryInterface.addIndex("favorite_ads", ["userId"], {
      name: "favorite_ads_user_id",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("favorite_ads");
    await queryInterface.removeColumn("users", "lastSeen");
  },
};
