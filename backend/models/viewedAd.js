const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { User } = require("./user");
const { Adv } = require("./adv");

const ViewedAd = sequelize.define(
  "ViewedAd",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    advId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Adv, key: "id" },
    },
  },
  {
    tableName: "viewed_ads",
    timestamps: true,
    indexes: [{ unique: true, fields: ["userId", "advId"] }],
  },
);

ViewedAd.belongsTo(User, { foreignKey: "userId", as: "user" });
ViewedAd.belongsTo(Adv, { foreignKey: "advId", as: "Adv" });

module.exports = { ViewedAd };
