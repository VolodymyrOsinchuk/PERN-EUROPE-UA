"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable("seller_reviews", {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      sellerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      reviewerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      rating: { type: DataTypes.INTEGER, allowNull: false },
      comment: { type: DataTypes.STRING(500), allowNull: true },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    });
    await queryInterface.addIndex("seller_reviews", ["sellerId", "reviewerId"], {
      unique: true,
      name: "seller_reviews_seller_reviewer_unique",
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("seller_reviews");
  },
};
