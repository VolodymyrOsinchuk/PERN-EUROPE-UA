const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { User } = require("./user");
const { Conversation } = require("./conversation");

const Message = sequelize.define(
  "Message",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    conversationId: { type: DataTypes.INTEGER, allowNull: false },
    senderId: { type: DataTypes.INTEGER, allowNull: false },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: { args: [1, 2000], msg: "Повідомлення від 1 до 2000 символів" },
      },
    },
    readAt: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: "messages", timestamps: true },
);

Message.belongsTo(Conversation, {
  foreignKey: "conversationId",
  as: "conversation",
  onDelete: "CASCADE",
});
Message.belongsTo(User, {
  foreignKey: "senderId",
  as: "sender",
  onDelete: "CASCADE",
});

module.exports = { Message };
