"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable("notifications", {
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
        allowNull: true,
        references: { model: "advs", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      type: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

    await queryInterface.addIndex("notifications", ["userId", "isRead"]);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("notifications");
  },
};
