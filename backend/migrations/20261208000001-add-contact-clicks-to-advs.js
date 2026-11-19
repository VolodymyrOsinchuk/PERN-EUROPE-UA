const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    const columns = await queryInterface.describeTable("advs");

    if (!columns.contactClicks) {
      await queryInterface.addColumn("advs", "contactClicks", {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
      });
    }
  },

  down: async (queryInterface) => {
    const columns = await queryInterface.describeTable("advs");

    if (columns.contactClicks) {
      await queryInterface.removeColumn("advs", "contactClicks");
    }
  },
};
