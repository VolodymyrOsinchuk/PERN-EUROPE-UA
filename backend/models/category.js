const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  { tableName: "categories", timestamps: true }
);

const SubCategory = sequelize.define(
  "SubCategory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Category, key: "id" },
    },
  },
  { tableName: "subcategories", timestamps: true }
);

SubCategory.belongsTo(Category, {
  foreignKey: "categoryId",
  onDelete: "CASCADE",
});
Category.hasMany(SubCategory, {
  foreignKey: "categoryId",
  onDelete: "CASCADE",
});

module.exports = { Category, SubCategory };
