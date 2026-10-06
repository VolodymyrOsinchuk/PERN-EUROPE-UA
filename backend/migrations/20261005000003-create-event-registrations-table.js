const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable("event_registrations", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "events", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });

    // Un utilisateur ne peut s'inscrire qu'une seule fois à un événement
    await queryInterface.addIndex("event_registrations", ["eventId", "userId"], {
      unique: true,
      name: "unique_event_user_registration",
    });
    await queryInterface.addIndex("event_registrations", ["userId"]);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("event_registrations");
  },
};
