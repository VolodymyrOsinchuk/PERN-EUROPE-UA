"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn("advs", "isArchived", {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      });
    } catch (err) {
      if (err.parent?.code !== "42701") throw err;
    }
    try {
      await queryInterface.addColumn("advs", "archivedAt", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    } catch (err) {
      if (err.parent?.code !== "42701") throw err;
    }
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("advs", "isArchived").catch(() => {});
    await queryInterface.removeColumn("advs", "archivedAt").catch(() => {});
  },
};
