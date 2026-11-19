// backend/models/country.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { User } = require("./user");

// Категорії збігаються з ключами CATEGORY_LABELS на фронтенді (Country.jsx)
const COUNTRY_LINK_CATEGORIES = [
  "government",
  "residence",
  "benefits",
  "work",
  "health",
  "education",
  "family",
  "transport",
  "finance",
  "consulate",
];

const CountryPage = sequelize.define(
  "CountryPage",
  {
    code: {
      type: DataTypes.STRING(2),
      primaryKey: true,
      allowNull: false,
      validate: { is: /^[A-Z]{2}$/ },
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { msg: "Назва країни обов'язкова" } },
    },
    flag: { type: DataTypes.STRING(10), allowNull: true },
    disclaimer: { type: DataTypes.TEXT, allowNull: true },
    isPublished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    lastVerifiedAt: { type: DataTypes.DATE, allowNull: true },
    updatedBy: { type: DataTypes.INTEGER, allowNull: true },
  },
  { tableName: "country_pages", timestamps: true },
);

const CountryLink = sequelize.define(
  "CountryLink",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    countryCode: { type: DataTypes.STRING(2), allowNull: false },
    category: {
      type: DataTypes.STRING(40),
      allowNull: false,
      validate: {
        isIn: {
          args: [COUNTRY_LINK_CATEGORIES],
          msg: "Невірна категорія посилання",
        },
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { notEmpty: { msg: "Назва посилання обов'язкова" } },
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        isUrl: {
          args: { protocols: ["https"], require_protocol: true },
          msg: "Посилання має бути https-адресою",
        },
      },
    },
    description: { type: DataTypes.TEXT, allowNull: true },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // Дата перевірки саме цього посилання
    lastVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    verifiedBy: { type: DataTypes.INTEGER, allowNull: true },
  },
  { tableName: "country_links", timestamps: true },
);

CountryPage.hasMany(CountryLink, {
  foreignKey: "countryCode",
  as: "links",
  onDelete: "CASCADE",
});
CountryLink.belongsTo(CountryPage, {
  foreignKey: "countryCode",
  as: "country",
});
CountryPage.belongsTo(User, { foreignKey: "updatedBy", as: "editor" });
CountryLink.belongsTo(User, { foreignKey: "verifiedBy", as: "verifier" });

module.exports = {
  CountryPage,
  CountryLink,
  COUNTRY_LINK_CATEGORIES,
};
