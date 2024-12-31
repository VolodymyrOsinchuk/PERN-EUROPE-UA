// migrations/YYYYMMDDHHMMSS-add-subcategoryId-to-advs.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("advs", "subcategoryId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "subcategories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    // Créer un index pour améliorer les performances des requêtes
    await queryInterface.addIndex("advs", ["subcategoryId"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex("advs", ["subcategoryId"]);
    await queryInterface.removeColumn("advs", "subcategoryId");
  },
};
