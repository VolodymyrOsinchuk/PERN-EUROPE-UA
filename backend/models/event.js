const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Event = sequelize.define(
  "Event",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // FIX: added "type" — EventDetail.jsx displays event.type
    type: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    // FIX: added "authorName" & "authorEmail" — EventDetail.jsx displays them
    authorName: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    authorEmail: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
  },
  {
    tableName: "events",
    timestamps: true,
  },
);

module.exports = { Event };
