const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ForumReply = sequelize.define(
  "ForumReply",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "forum_replies",
    timestamps: true,
  }
);

module.exports = { ForumReply };