const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    const columns = await queryInterface.describeTable("users");

    if (!columns.pendingEmail) {
      await queryInterface.addColumn("users", "pendingEmail", {
        type: DataTypes.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface) => {
    const columns = await queryInterface.describeTable("users");

    if (columns.pendingEmail) {
      await queryInterface.removeColumn("users", "pendingEmail");
    }
  },
};
