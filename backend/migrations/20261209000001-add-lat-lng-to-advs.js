const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    const columns = await queryInterface.describeTable("advs");

    if (!columns.latitude) {
      await queryInterface.addColumn("advs", "latitude", {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
      });
    }

    if (!columns.longitude) {
      await queryInterface.addColumn("advs", "longitude", {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
      });
    }
  },

  down: async (queryInterface) => {
    const columns = await queryInterface.describeTable("advs");

    if (columns.latitude) {
      await queryInterface.removeColumn("advs", "latitude");
    }
    if (columns.longitude) {
      await queryInterface.removeColumn("advs", "longitude");
    }
  },
};
