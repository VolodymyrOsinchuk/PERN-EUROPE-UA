const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { User } = require("./user");

const Publication = sequelize.define(
  "Publication",
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
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    author: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    readTime: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    // backend/models/publication.js (додаткові поля в define)
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "published",
      validate: {
        isIn: [["draft", "pending", "needs_changes", "published", "archived"]],
      },
    },
    moderationReason: { type: DataTypes.TEXT, allowNull: true },
    sourceName: { type: DataTypes.STRING(150), allowNull: true },
    sourceUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: {
          args: { protocols: ["https"], require_protocol: true },
          msg: "sourceUrl має бути https-адресою",
        },
      },
    },
    lastVerifiedAt: { type: DataTypes.DATE, allowNull: true },
    verifiedBy: { type: DataTypes.STRING(100), allowNull: true },
    countryCode: {
      type: DataTypes.STRING(2),
      allowNull: true,
      validate: { is: /^[A-Z]{2}$/ },
    },
    // userId permet de filtrer les publications par utilisateur
    // et de protéger les mutations (update/delete)
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true, // nullable pour les publications existantes sans userId
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
  },
  {
    tableName: "publications",
    timestamps: true,
  },
);

User.hasMany(Publication, { foreignKey: "userId", as: "publications" });
Publication.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = { Publication };
