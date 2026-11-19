"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn("reports", "reportedUserId", {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addIndex("reports", ["reportedUserId"], {
      name: "reports_reported_user_id",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("reports", "reportedUserId").catch(
      () => {},
    );
  },
};
