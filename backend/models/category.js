const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const slugify = require("slugify");

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Categories",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "categories",
    timestamps: true,
    hooks: {
      beforeValidate: (category) => {
        category.slug = slugify(category.name, { lower: true });
      },
    },
  }
);

Category.hasMany(Category, { as: "subCategories", foreignKey: "parentId" });
Category.belongsTo(Category, {
  as: "parent",
  foreignKey: "parentId",
});

module.exports = Category;
