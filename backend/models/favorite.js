const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { User } = require("./user");
const { Adv } = require("./adv");

const Favorite = sequelize.define(
  "Favorite",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
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
    tableName: "favorite_ads",
    timestamps: true,
    indexes: [
      { unique: true, fields: ["userId", "advId"] },
      { fields: ["userId"] },
      { fields: ["advId"] },
    ],
  },
);

User.belongsToMany(Adv, {
  through: Favorite,
  foreignKey: "userId",
  otherKey: "advId",
  as: "favoriteAds",
});
Adv.belongsToMany(User, {
  through: Favorite,
  foreignKey: "advId",
  otherKey: "userId",
  as: "favoritedBy",
});
Favorite.belongsTo(User, { foreignKey: "userId", as: "user" });
Favorite.belongsTo(Adv, { foreignKey: "advId", as: "Adv" });

module.exports = { Favorite };
