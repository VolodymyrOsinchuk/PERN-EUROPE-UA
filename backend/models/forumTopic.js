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
    author: {
      type: DataTypes.STRING(100),
      allowNull: true,
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
  }
);

module.exports = { ForumTopic };
