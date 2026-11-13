"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    const cols = await queryInterface.describeTable("advs");
    const add = async (name, definition) => {
      if (!cols[name]) await queryInterface.addColumn("advs", name, definition);
    };

    await add("contactByEmail", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await add("contactByChat", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    // Приватність: контакти старих оголошень приховані, доки власник не увімкне їх.
    await add("showEmail", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await add("showPhone", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  down: async (queryInterface) => {
    for (const col of [
      "showPhone",
      "showEmail",
      "contactByChat",
      "contactByEmail",
    ]) {
      await queryInterface.removeColumn("advs", col).catch(() => {});
    }
  },
};
