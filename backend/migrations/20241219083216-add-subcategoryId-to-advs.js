// migrations/YYYYMMDDHHMMSS-add-subcategoryId-to-advs.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // La colonne peut déjà exister via sync() — ignorer si c'est le cas
    try {
      await queryInterface.addColumn("advs", "subcategoryId", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "subcategories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    } catch (err) {
      if (err.parent?.code !== "42701") throw err;
    }

    try {
      await queryInterface.addIndex("advs", ["subcategoryId"]);
    } catch (err) {
      if (err.parent?.code !== "55006") throw err;
    }
  },

  down: async (queryInterface) => {
    await queryInterface.removeIndex("advs", ["subcategoryId"]).catch(() => {});
    await queryInterface.removeColumn("advs", "subcategoryId").catch(() => {});
  },
};
