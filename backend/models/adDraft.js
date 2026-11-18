const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { User } = require("./user");

const AdDraft = sequelize.define(
  "AdDraft",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: User, key: "id" },
    },
    payload: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
  },
  { tableName: "ad_drafts", timestamps: true },
);

User.hasOne(AdDraft, { foreignKey: "userId", as: "adDraft" });
AdDraft.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = { AdDraft };
