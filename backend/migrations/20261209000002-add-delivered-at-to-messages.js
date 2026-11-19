const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    const columns = await queryInterface.describeTable("messages");

    if (!columns.deliveredAt) {
      await queryInterface.addColumn("messages", "deliveredAt", {
        type: DataTypes.DATE,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface) => {
    const columns = await queryInterface.describeTable("messages");

    if (columns.deliveredAt) {
      await queryInterface.removeColumn("messages", "deliveredAt");
    }
  },
};
