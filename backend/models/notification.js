const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { User } = require("./user");
const { Adv } = require("./adv");

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    advId: { type: DataTypes.INTEGER, allowNull: true },
    conversationId: { type: DataTypes.INTEGER, allowNull: true },
    type: {
      type: DataTypes.STRING(40),
      allowNull: false,
      validate: {
        isIn: {
          args: [
            [
              "ad_pending",
              "ad_approved",
              "ad_rejected",
              "ad_needs_changes",
              "ad_hidden",
              "message_received",
            ],
          ],
          msg: "Невірний тип сповіщення",
        },
      },
    },
    message: { type: DataTypes.TEXT, allowNull: false },
    isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  {
    tableName: "notifications",
    timestamps: true,
  },
);

Notification.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
});
Notification.belongsTo(Adv, {
  foreignKey: "advId",
  as: "ad",
  onDelete: "SET NULL",
});

module.exports = { Notification };
