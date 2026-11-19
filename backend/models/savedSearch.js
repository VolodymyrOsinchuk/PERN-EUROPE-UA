const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { User } = require("./user");
const { Category } = require("./category");

const SavedSearch = sequelize.define(
  "SavedSearch",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    query: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: Category, key: "id" },
    },
    minPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    maxPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    country: { type: DataTypes.STRING(100), allowNull: true },
    state: { type: DataTypes.STRING(100), allowNull: true },
    city: { type: DataTypes.STRING(100), allowNull: true },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    lastNotifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "saved_searches",
    timestamps: true,
    indexes: [{ fields: ["userId"] }],
  },
);

SavedSearch.belongsTo(User, { foreignKey: "userId", as: "user" });
SavedSearch.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
User.hasMany(SavedSearch, { foreignKey: "userId", as: "savedSearches" });

module.exports = { SavedSearch };
