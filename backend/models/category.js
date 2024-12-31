const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      // allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [2, 100], // Name between 2 and 100 characters
        notEmpty: { msg: "Le nom de la catégorie est requis" },
      },
    },
  },
  {
    tableName: "categories",
    timestamps: true,
    indexes: [{ fields: ["name"], unique: true }],
  }
);

const SubCategory = sequelize.define(
  "SubCategory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      // allowNull: false,
    },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "categories", key: "id" },
      validate: {
        async validateCategory(value) {
          const category = await Category.findByPk(value);
          if (!category) {
            throw new Error("Invalid category");
          }
        },
      },
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
