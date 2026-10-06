const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn("users", "provider", {
      type: DataTypes.ENUM("local", "google", "facebook"),
      defaultValue: "local",
    });
    await queryInterface.addColumn("users", "providerId", {
      type: DataTypes.STRING(100),
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("users", "providerId");
    await queryInterface.removeColumn("users", "provider");
  },
};
