const { DataTypes, Op } = require("sequelize");
const sequelize = require("../config/db");
const { User } = require("./user");
const { Adv } = require("./adv");

const Conversation = sequelize.define(
  "Conversation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    adId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: Adv, key: "id" },
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    lastMessageAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "conversations",
    timestamps: true,
  },
);

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Conversation, key: "id" },
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    recipientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "messages",
    timestamps: true,
  },
);

// Associations
Conversation.hasMany(Message, {
  foreignKey: "conversationId",
  as: "messages",
  onDelete: "CASCADE",
});
Message.belongsTo(Conversation, {
  foreignKey: "conversationId",
  as: "conversation",
});

// FIX P1-5: onDelete explicite sur sender/recipient — évite des messages
// orphelins en base si un compte est supprimé.
Message.belongsTo(User, {
  foreignKey: "senderId",
  as: "sender",
  onDelete: "CASCADE",
});
Message.belongsTo(User, {
  foreignKey: "recipientId",
  as: "recipient",
  onDelete: "CASCADE",
});

Conversation.belongsTo(Adv, {
  foreignKey: "adId",
  as: "ad",
  onDelete: "SET NULL",
});
Conversation.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
  onDelete: "CASCADE",
});

module.exports = { Conversation, Message };
