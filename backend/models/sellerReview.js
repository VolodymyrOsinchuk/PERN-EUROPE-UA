const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { User } = require("./user");
const { Deal } = require("./deal");

const SellerReview = sequelize.define(
  "SellerReview",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    reviewerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    comment: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    dealId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: Deal, key: "id" },
    },
  },
  {
    tableName: "seller_reviews",
    timestamps: true,
    indexes: [
      { unique: true, fields: ["sellerId", "reviewerId"] },
      { fields: ["sellerId"] },
    ],
  },
);

User.hasMany(SellerReview, { foreignKey: "sellerId", as: "receivedReviews" });
User.hasMany(SellerReview, { foreignKey: "reviewerId", as: "sentReviews" });
SellerReview.belongsTo(User, { foreignKey: "sellerId", as: "seller" });
SellerReview.belongsTo(User, { foreignKey: "reviewerId", as: "reviewer" });

module.exports = { SellerReview };
