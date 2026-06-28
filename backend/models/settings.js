const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { User } = require("./user");

const Settings = sequelize.define(
  "Settings",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    siteTitle: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "PERN EUROPE UA",
    },
    supportEmail: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "support@example.com",
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
    },
  },
  {
    tableName: "settings",
    timestamps: true,
  },
);

Settings.belongsTo(User, { foreignKey: "updatedBy", as: "editor" });

module.exports = { Settings };
