const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { User } = require("./user");

const AdvExpirationSetting = sequelize.define(
  "AdvExpirationSetting",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    durationPreset: {
      type: DataTypes.ENUM("1_week", "1_month", "custom"),
      allowNull: false,
      defaultValue: "1_month",
    },
    durationDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
      validate: { min: 1, max: 365 },
    },
    action: {
      type: DataTypes.ENUM("archive", "delete", "hide"),
      allowNull: false,
      defaultValue: "archive",
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
    },
  },
  {
    tableName: "adv_expiration_settings",
    timestamps: true,
  },
);

AdvExpirationSetting.belongsTo(User, { foreignKey: "updatedBy", as: "editor" });

module.exports = { AdvExpirationSetting };
