"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ── Foreign Key constraints manquantes ──

    // forum_replies.topicId -> forum_topics.id
    await queryInterface
      .removeConstraint("forum_replies", "forum_replies_topicId_fkey")
      .catch(() => {});
    await queryInterface.addConstraint("forum_replies", {
      fields: ["topicId"],
      type: "foreign key",
      name: "forum_replies_topicId_fkey",
      references: { table: "forum_topics", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // forum_topics.userId -> users.id
    await queryInterface
      .removeConstraint("forum_topics", "forum_topics_userId_fkey")
      .catch(() => {});
    await queryInterface.addConstraint("forum_topics", {
      fields: ["userId"],
      type: "foreign key",
      name: "forum_topics_userId_fkey",
      references: { table: "users", field: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    // forum_replies.userId -> users.id
    await queryInterface
      .removeConstraint("forum_replies", "forum_replies_userId_fkey")
      .catch(() => {});
    await queryInterface.addConstraint("forum_replies", {
      fields: ["userId"],
      type: "foreign key",
      name: "forum_replies_userId_fkey",
      references: { table: "users", field: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    // events.userId -> users.id
    await queryInterface
      .removeConstraint("events", "events_userId_fkey")
      .catch(() => {});
    await queryInterface.addConstraint("events", {
      fields: ["userId"],
      type: "foreign key",
      name: "events_userId_fkey",
      references: { table: "users", field: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    // publications.userId -> users.id
    await queryInterface
      .removeConstraint("publications", "publications_userId_fkey")
      .catch(() => {});
    await queryInterface.addConstraint("publications", {
      fields: ["userId"],
      type: "foreign key",
      name: "publications_userId_fkey",
      references: { table: "users", field: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    // ── Indexes ──
    await queryInterface.addIndex("advs", ["userId"]);
    await queryInterface.addIndex("advs", ["categoryId"]);
    await queryInterface.addIndex("advs", ["status"]);
    await queryInterface.addIndex("advs", ["expirationDate"]);
    await queryInterface.addIndex("advs", ["datePosted"]);

    await queryInterface.addIndex("events", ["userId"]);
    await queryInterface.addIndex("events", ["date"]);

    await queryInterface.addIndex("news", ["date"]);
    await queryInterface.addIndex("news", ["category"]);

    await queryInterface.addIndex("publications", ["userId"]);
    await queryInterface.addIndex("publications", ["date"]);

    await queryInterface.addIndex("forum_topics", ["userId"]);
    await queryInterface.addIndex("forum_topics", ["category"]);
    await queryInterface.addIndex("forum_topics", ["updatedAt"]);

    await queryInterface.addIndex("forum_replies", ["topicId"]);
    await queryInterface.addIndex("forum_replies", ["userId"]);

    await queryInterface.addIndex("messages", ["conversationId"]);
    await queryInterface.addIndex("messages", ["senderId"]);
    await queryInterface.addIndex("messages", ["recipientId"]);
    await queryInterface.addIndex("messages", ["isRead"]);

    await queryInterface.addIndex("conversations", ["createdBy"]);
    await queryInterface.addIndex("conversations", ["lastMessageAt"]);

    await queryInterface.addIndex("adv_expiration_settings", ["updatedBy"]);
  },

  down: async (queryInterface) => {
    // Remove FK constraints
    await queryInterface.removeConstraint("forum_replies", "forum_replies_topicId_fkey").catch(() => {});
    await queryInterface.removeConstraint("forum_topics", "forum_topics_userId_fkey").catch(() => {});
    await queryInterface.removeConstraint("forum_replies", "forum_replies_userId_fkey").catch(() => {});
    await queryInterface.removeConstraint("events", "events_userId_fkey").catch(() => {});
    await queryInterface.removeConstraint("publications", "publications_userId_fkey").catch(() => {});

    // Remove indexes
    await queryInterface.removeIndex("advs", ["userId"]).catch(() => {});
    await queryInterface.removeIndex("advs", ["categoryId"]).catch(() => {});
    await queryInterface.removeIndex("advs", ["status"]).catch(() => {});
    await queryInterface.removeIndex("advs", ["expirationDate"]).catch(() => {});
    await queryInterface.removeIndex("advs", ["datePosted"]).catch(() => {});
    await queryInterface.removeIndex("events", ["userId"]).catch(() => {});
    await queryInterface.removeIndex("events", ["date"]).catch(() => {});
    await queryInterface.removeIndex("news", ["date"]).catch(() => {});
    await queryInterface.removeIndex("news", ["category"]).catch(() => {});
    await queryInterface.removeIndex("publications", ["userId"]).catch(() => {});
    await queryInterface.removeIndex("publications", ["date"]).catch(() => {});
    await queryInterface.removeIndex("forum_topics", ["userId"]).catch(() => {});
    await queryInterface.removeIndex("forum_topics", ["category"]).catch(() => {});
    await queryInterface.removeIndex("forum_topics", ["updatedAt"]).catch(() => {});
    await queryInterface.removeIndex("forum_replies", ["topicId"]).catch(() => {});
    await queryInterface.removeIndex("forum_replies", ["userId"]).catch(() => {});
    await queryInterface.removeIndex("messages", ["conversationId"]).catch(() => {});
    await queryInterface.removeIndex("messages", ["senderId"]).catch(() => {});
    await queryInterface.removeIndex("messages", ["recipientId"]).catch(() => {});
    await queryInterface.removeIndex("messages", ["isRead"]).catch(() => {});
    await queryInterface.removeIndex("conversations", ["createdBy"]).catch(() => {});
    await queryInterface.removeIndex("conversations", ["lastMessageAt"]).catch(() => {});
    await queryInterface.removeIndex("adv_expiration_settings", ["updatedBy"]).catch(() => {});
  },
};
