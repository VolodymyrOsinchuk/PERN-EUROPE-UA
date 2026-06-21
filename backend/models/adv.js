const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { Category, SubCategory } = require("./category");
const { User } = require("./user");
const { deleteCloudinaryFile } = require("../config/cloudinary");

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
        notEmpty: { message: "Заголовок не може бути порожнім" },
        len: [3, 255],
      },
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { message: "Країна обов'язкова" } },
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { message: "Регіон/область обов'язкові" } },
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { message: "Місто обов'язкове" } },
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
      validate: { isEmail: { message: "Невірний формат email" } },
    },
    // FIX: phone added
    phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
      validate: {
        is: {
          args: /^\+[1-9]\d{6,14}$/,
          msg: "Номер телефону має бути у міжнародному форматі E.164",
        },
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: { args: [0], message: "Ціна має бути додатним числом" },
        max: { args: [1000000], message: "Ціна занадто висока" },
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
        notNull: { message: "Категорія обов'язкова" },
        async validateCategoryExists(value) {
          if (value) {
            const category = await Category.findByPk(value);
            if (!category) throw new Error("Категорія не існує");
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
    isArchived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    archivedAt: {
      type: DataTypes.DATE,
      allowNull: true,
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
      beforeDestroy: async (adv) => {
        if (adv.photos?.length) {
          await Promise.all(adv.photos.map((url) => deleteCloudinaryFile(url)));
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
