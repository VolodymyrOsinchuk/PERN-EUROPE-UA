const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { Adv } = require("./adv");
const { User } = require("./user");

const Report = sequelize.define(
  "Report",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { message: "Причина скарги обов'язкова" } },
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "resolved"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "reports",
    timestamps: true,
  },
);

Report.belongsTo(Adv, {
  foreignKey: "advId",
  as: "ad",
  onDelete: "CASCADE",
});
Report.belongsTo(User, {
  foreignKey: "userId",
  as: "reporter",
  onDelete: "CASCADE",
});
Adv.hasMany(Report, { foreignKey: "advId", as: "reports" });
User.hasMany(Report, { foreignKey: "userId", as: "reports" });

module.exports = { Report };
