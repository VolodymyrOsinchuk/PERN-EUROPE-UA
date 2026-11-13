const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { User } = require("./user");
const { Message } = require("./message");

const MessageReport = sequelize.define(
  "MessageReport",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    messageId: { type: DataTypes.INTEGER, allowNull: false },
    reporterId: { type: DataTypes.INTEGER, allowNull: false },
    reason: { type: DataTypes.STRING(100), allowNull: false },
    details: { type: DataTypes.TEXT, allowNull: true },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "pending",
    },
    decidedBy: { type: DataTypes.INTEGER, allowNull: true },
    decidedAt: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: "message_reports", timestamps: true },
);

MessageReport.belongsTo(Message, {
  foreignKey: "messageId",
  as: "message",
  onDelete: "CASCADE",
});
MessageReport.belongsTo(User, {
  foreignKey: "reporterId",
  as: "reporter",
  onDelete: "CASCADE",
});
MessageReport.belongsTo(User, {
  foreignKey: "decidedBy",
  as: "decider",
  onDelete: "SET NULL",
});

module.exports = { MessageReport };
