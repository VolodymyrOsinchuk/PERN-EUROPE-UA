const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Categorie = sequelize.define("Categorie", {
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
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "Categories",
      key: "id",
    },
  },
});

Categorie.hasMany(Categorie, { as: "subCategories", foreignKey: "parentId" });
Categorie.belongsTo(Categorie, {
  as: "categorieParent",
  foreignKey: "parentId",
});

module.exports = Categorie;
