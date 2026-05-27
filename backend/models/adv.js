const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { Category, SubCategory } = require("./category");
const { User } = require("./user");

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
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { message: "Le titre ne peut pas être vide" },
        len: [3, 255],
      },
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { message: "Le pays est requis" } },
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { message: "La région/état est requise" } },
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { message: "La ville est requise" } },
    },
    // FIX: "location" added — CreateAdPage sends it, was lost before
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { len: [10, 5000] },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      // FIX: removed unique:true — multiple ads from same email must be allowed
      validate: { isEmail: { message: "Format d'email invalide" } },
    },
    // FIX: phone added
    phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: { args: [0], message: "Le prix doit être positif" },
        max: { args: [1000000], message: "Prix trop élevé" },
      },
    },
    photos: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    amenities: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    // FIX: status added
    status: {
      type: DataTypes.ENUM("Active", "Inactive", "Sold"),
      defaultValue: "Active",
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Category, key: "id" },
      validate: {
        notNull: { message: "La catégorie est requise" },
        async validateCategoryExists(value) {
          if (value) {
            const category = await Category.findByPk(value);
            if (!category) throw new Error("Catégorie inexistante");
          }
        },
      },
    },
    subcategoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: SubCategory, key: "id" },
    },
    datePosted: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      validate: { isDate: true },
    },
    expirationDate: {
      type: DataTypes.DATE,
      validate: { isDate: true },
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0 },
    },
    isPromoted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
  },
  {
    hooks: {
      beforeCreate: (adv) => {
        if (!adv.expirationDate) {
          adv.expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        }
      },
    },
    timestamps: true,
    tableName: "advs",
  },
);

User.hasMany(Adv, { foreignKey: "userId", as: "advs" });
Adv.belongsTo(User, { foreignKey: "userId", as: "user" });
Adv.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Adv.belongsTo(SubCategory, { foreignKey: "subcategoryId", as: "subcategory" });
Category.hasMany(Adv, { foreignKey: "categoryId", as: "advs" });
SubCategory.hasMany(Adv, { foreignKey: "subcategoryId", as: "advs" });

module.exports = { Adv };
