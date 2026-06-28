"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add forumCategoryId column
    await queryInterface.addColumn("forum_topics", "forumCategoryId", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // Backfill: match category string to forum_categories.title
    await queryInterface.sequelize.query(`
      UPDATE forum_topics
      SET "forumCategoryId" = fc.id
      FROM forum_categories fc
      WHERE forum_topics.category = fc.title
    `);

    // Add FK constraint
    await queryInterface
      .removeConstraint("forum_topics", "forum_topics_forumCategoryId_fkey")
      .catch(() => {});
    await queryInterface.addConstraint("forum_topics", {
      fields: ["forumCategoryId"],
      type: "foreign key",
      name: "forum_topics_forumCategoryId_fkey",
      references: { table: "forum_categories", field: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  },

  down: async (queryInterface) => {
    await queryInterface
      .removeConstraint("forum_topics", "forum_topics_forumCategoryId_fkey")
      .catch(() => {});
    await queryInterface
      .removeColumn("forum_topics", "forumCategoryId")
      .catch(() => {});
  },
};
