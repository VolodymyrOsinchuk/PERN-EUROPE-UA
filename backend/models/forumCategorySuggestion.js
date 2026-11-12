const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { User } = require("./user");

const ForumCategorySuggestion = sequelize.define(
  "ForumCategorySuggestion",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { notEmpty: true, len: [2, 150] },
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
    },
    status: {
      type: DataTypes.STRING(30),
      defaultValue: "pending", // pending, approved, rejected
    },
    adminComment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "forum_category_suggestions",
    timestamps: true,
  },
);

ForumCategorySuggestion.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "SET NULL",
});

module.exports = { ForumCategorySuggestion };
