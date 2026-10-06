const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    const columns = await queryInterface.describeTable("users");

    if (!columns.verificationTokenExpires) {
      await queryInterface.addColumn("users", "verificationTokenExpires", {
        type: DataTypes.DATE,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface) => {
    const columns = await queryInterface.describeTable("users");

    if (columns.verificationTokenExpires) {
      await queryInterface.removeColumn("users", "verificationTokenExpires");
    }
  },
};
