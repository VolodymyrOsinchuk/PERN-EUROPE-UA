"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Add parentId to forum_categories for subcategories
    const catTableDesc = await queryInterface.describeTable("forum_categories");
    if (!catTableDesc.parentId) {
      await queryInterface.addColumn("forum_categories", "parentId", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "forum_categories",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }

    // 2. Add columns to forum_topics
    const topicTableDesc = await queryInterface.describeTable("forum_topics");

    if (!topicTableDesc.forumSubcategoryId) {
      await queryInterface.addColumn("forum_topics", "forumSubcategoryId", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "forum_categories",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });
    }

    if (!topicTableDesc.country) {
      await queryInterface.addColumn("forum_topics", "country", {
        type: Sequelize.STRING(100),
        allowNull: true,
      });
    }

    if (!topicTableDesc.city) {
      await queryInterface.addColumn("forum_topics", "city", {
        type: Sequelize.STRING(100),
        allowNull: true,
      });
    }

    if (!topicTableDesc.isPinned) {
      await queryInterface.addColumn("forum_topics", "isPinned", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }

    if (!topicTableDesc.isClosed) {
      await queryInterface.addColumn("forum_topics", "isClosed", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }

    if (!topicTableDesc.attachments) {
      await queryInterface.addColumn("forum_topics", "attachments", {
        type: Sequelize.TEXT,
        allowNull: true,
      });
    }

    // 3. Create forum_category_suggestions table
    const tables = await queryInterface.showAllTables();
    if (!tables.includes("forum_category_suggestions")) {
      await queryInterface.createTable("forum_category_suggestions", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING(150),
          allowNull: false,
        },
        description: {
          type: Sequelize.STRING(500),
          allowNull: true,
        },
        reason: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "users",
            key: "id",
          },
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
        },
        status: {
          type: Sequelize.STRING(30),
          allowNull: false,
          defaultValue: "pending",
        },
        adminComment: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("now"),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("now"),
        },
      });
    }

    // 4. Create forum_reports table
    if (!tables.includes("forum_reports")) {
      await queryInterface.createTable("forum_reports", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        topicId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "forum_topics",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        replyId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "forum_replies",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "users",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        reason: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        details: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        status: {
          type: Sequelize.STRING(30),
          allowNull: false,
          defaultValue: "pending",
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("now"),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("now"),
        },
      });
    }
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("forum_reports").catch(() => {});
    await queryInterface.dropTable("forum_category_suggestions").catch(() => {});
    await queryInterface.removeColumn("forum_topics", "attachments").catch(() => {});
    await queryInterface.removeColumn("forum_topics", "isClosed").catch(() => {});
    await queryInterface.removeColumn("forum_topics", "isPinned").catch(() => {});
    await queryInterface.removeColumn("forum_topics", "city").catch(() => {});
    await queryInterface.removeColumn("forum_topics", "country").catch(() => {});
    await queryInterface.removeColumn("forum_topics", "forumSubcategoryId").catch(() => {});
    await queryInterface.removeColumn("forum_categories", "parentId").catch(() => {});
  },
};
