const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ForumTopic = sequelize.define(
  "ForumTopic",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    forumCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "forum_categories", key: "id" },
    },
    author: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
    },
    replies: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastUpdate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "forum_topics",
    timestamps: true,
  },
);

const { User } = require("./user");
const { ForumCategory } = require("./forumCategory");

ForumTopic.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "SET NULL",
});

ForumTopic.belongsTo(ForumCategory, {
  foreignKey: "forumCategoryId",
  as: "forumCategory",
  onDelete: "SET NULL",
});

module.exports = { ForumTopic };
