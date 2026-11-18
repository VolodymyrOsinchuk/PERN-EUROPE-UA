const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { User } = require("./user");
const { Adv } = require("./adv");
const { Conversation } = require("./conversation");

const Deal = sequelize.define(
  "Deal",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: Conversation, key: "id" },
    },
    advId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Adv, key: "id" },
    },
    buyerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    status: {
      type: DataTypes.ENUM("planned", "contacted", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "planned",
    },
  },
  { tableName: "deals", timestamps: true },
);

Deal.belongsTo(Conversation, { foreignKey: "conversationId", as: "conversation" });
Deal.belongsTo(Adv, { foreignKey: "advId", as: "ad" });
Deal.belongsTo(User, { foreignKey: "buyerId", as: "buyer" });
Deal.belongsTo(User, { foreignKey: "sellerId", as: "seller" });

module.exports = { Deal };
