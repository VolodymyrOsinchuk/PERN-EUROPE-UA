"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable("ad_drafts", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      payload: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    });

    await queryInterface.createTable("viewed_ads", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
    await queryInterface.addIndex("viewed_ads", ["userId", "advId"], {
      unique: true,
      name: "viewed_ads_user_adv_unique",
    });

    await queryInterface.createTable("deals", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: "conversations", key: "id" },
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
      status: {
        type: DataTypes.ENUM("planned", "contacted", "completed", "cancelled"),
        allowNull: false,
        defaultValue: "planned",
      },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    });

    await queryInterface.addColumn("seller_reviews", "dealId", {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "deals", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("seller_reviews", "dealId").catch(() => {});
    await queryInterface.dropTable("deals").catch(() => {});
    await queryInterface.dropTable("viewed_ads").catch(() => {});
    await queryInterface.dropTable("ad_drafts").catch(() => {});
  },
};
