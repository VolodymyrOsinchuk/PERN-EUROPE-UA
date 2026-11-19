"use strict";

/**
 * Додатковий стовпець users.tokenVersion для скидання JWT-сесій
 * при зміні пароля та email.
 */
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn("users", "tokenVersion", {
      type: "INTEGER",
      allowNull: false,
      defaultValue: 0,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("users", "tokenVersion");
  },
};
