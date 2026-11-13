const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { User } = require("./user");
const { Adv } = require("./adv");

const Conversation = sequelize.define(
  "Conversation",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    adId: { type: DataTypes.INTEGER, allowNull: true },
    buyerId: { type: DataTypes.INTEGER, allowNull: false },
    sellerId: { type: DataTypes.INTEGER, allowNull: false },
    lastMessageAt: { type: DataTypes.DATE, allowNull: true },
    lastNotifiedAt: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: "conversations", timestamps: true },
);

Conversation.belongsTo(Adv, {
  foreignKey: "adId",
  as: "ad",
  onDelete: "SET NULL",
});
Conversation.belongsTo(User, {
  foreignKey: "buyerId",
  as: "buyer",
  onDelete: "CASCADE",
});
Conversation.belongsTo(User, {
  foreignKey: "sellerId",
  as: "seller",
  onDelete: "CASCADE",
});

module.exports = { Conversation };
