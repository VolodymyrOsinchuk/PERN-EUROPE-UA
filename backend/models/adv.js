const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { Category } = require("./category");

const Adv = sequelize.define(
  "Adv",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // price: {
    //   type: DataTypes.FLOAT,
    //   allowNull: false,
    //   defaultValue: 0,
    // },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Actif", "Inactif", "Vendu"),
      defaultValue: "Actif",
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Categories",
        key: "id",
      },
    },
    // userId: {
    //   type: DataTypes.UUID,
    //   allowNull: false,
    //   references: {
    //     model: "Users",
    //     key: "id",
    //   },
    // },
  },
  {
    tableName: "announcements",
    timestamps: true,
  }
);

Adv.belongsTo(Category, { foreignKey: "categoryId", as: "categorie" });
Category.hasMany(Adv, { foreignKey: "categoryId", as: "advs" });

module.exports = Adv;
