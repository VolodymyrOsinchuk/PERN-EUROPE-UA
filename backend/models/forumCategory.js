const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ForumCategory = sequelize.define(
  "ForumCategory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { notEmpty: true, len: [2, 150] },
    },
    description: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING(60),
      allowNull: true,
      defaultValue: "forum",
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "#0057B8",
    },
    bgColor: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "#eff6ff",
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "forum_categories",
    timestamps: true,
  },
);

module.exports = { ForumCategory };
