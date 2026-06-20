"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // advs.userId -> users.id : CASCADE
    await queryInterface
      .removeConstraint("advs", "advs_userId_fkey")
      .catch(() => {});
    await queryInterface.addConstraint("advs", {
      fields: ["userId"],
      type: "foreign key",
      name: "advs_userId_fkey",
      references: { table: "users", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // messages.senderId -> users.id : CASCADE
    await queryInterface
      .removeConstraint("messages", "messages_senderId_fkey")
      .catch(() => {});
    await queryInterface.addConstraint("messages", {
      fields: ["senderId"],
      type: "foreign key",
      name: "messages_senderId_fkey",
      references: { table: "users", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // messages.recipientId -> users.id : CASCADE
    await queryInterface
      .removeConstraint("messages", "messages_recipientId_fkey")
      .catch(() => {});
    await queryInterface.addConstraint("messages", {
      fields: ["recipientId"],
      type: "foreign key",
      name: "messages_recipientId_fkey",
      references: { table: "users", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // conversations.createdBy -> users.id : CASCADE
    await queryInterface
      .removeConstraint("conversations", "conversations_createdBy_fkey")
      .catch(() => {});
    await queryInterface.addConstraint("conversations", {
      fields: ["createdBy"],
      type: "foreign key",
      name: "conversations_createdBy_fkey",
      references: { table: "users", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeConstraint("advs", "advs_userId_fkey");
    await queryInterface.removeConstraint("messages", "messages_senderId_fkey");
    await queryInterface.removeConstraint(
      "messages",
      "messages_recipientId_fkey",
    );
    await queryInterface.removeConstraint(
      "conversations",
      "conversations_createdBy_fkey",
    );
  },
};
