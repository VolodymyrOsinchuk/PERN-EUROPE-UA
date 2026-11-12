const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { User } = require("./user");

const ModerationLog = sequelize.define(
  "ModerationLog",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    advId: { type: DataTypes.INTEGER, allowNull: true },
    ownerId: { type: DataTypes.INTEGER, allowNull: true },
    moderatorId: { type: DataTypes.INTEGER, allowNull: true },
    previousStatus: { type: DataTypes.STRING(30), allowNull: true },
    newStatus: { type: DataTypes.STRING(30), allowNull: false },
    reason: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "moderation_logs",
    timestamps: true,
  },
);

ModerationLog.belongsTo(User, {
  foreignKey: "moderatorId",
  as: "moderator",
  onDelete: "SET NULL",
});

module.exports = { ModerationLog };
