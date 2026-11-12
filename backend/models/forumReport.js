const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { User } = require("./user");
const { ForumTopic } = require("./forumTopic");
const { ForumReply } = require("./forumReply");

const ForumReport = sequelize.define(
  "ForumReport",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "forum_topics", key: "id" },
    },
    replyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "forum_replies", key: "id" },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
    },
    reason: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: true },
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(30),
      defaultValue: "pending", // pending, resolved, dismissed
    },
  },
  {
    tableName: "forum_reports",
    timestamps: true,
  },
);

ForumReport.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
});

ForumReport.belongsTo(ForumTopic, {
  foreignKey: "topicId",
  as: "topic",
  onDelete: "CASCADE",
});

ForumReport.belongsTo(ForumReply, {
  foreignKey: "replyId",
  as: "reply",
  onDelete: "CASCADE",
});

module.exports = { ForumReport };
