"use strict";

// Migration « baseline » : crée les tables de base qui n'avaient
// JAMAIS fait l'objet d'une migration (elles étaient créées par
// sequelize.sync() exécuté à chaque démarrage de index.js).
//
// Pourquoi cette migration existe :
//   - sync() recréait des index/contraintes en double à chaque
//     démarrage (accumulation de _key1, _key2… dans PostgreSQL).
//   - sync() est maintenant retiré de index.js : les migrations
//     (umzug) sont la seule source de vérité pour le schéma.
//
// Nommage volontaire 20240101000000 : antérieur à
// 20241219083216, donc exécutée EN PREMIER sur une base vide.
// Sur une base existante, chaque createTable échoue avec
// « already exists » (42P07) et l'erreur est ignorée.
//
// Les colonnes ajoutées par des migrations ultérieures ne sont
// PAS créées ici (les migrations correspondantes se chargent
// de les ajouter dans l'ordre) :
//   - advs.subcategoryId          → 20241219083216
//   - advs.isArchived/archivedAt  → 20260620120001
//   - forum_topics.forumCategoryId→ 20260620120003
//   - users.provider/providerId   → 20261005000004
//   - users.verificationTokenExpires → 20261006000001
//
// Les tables créées par d'autres migrations ne sont pas concernées :
//   settings (20260628000001), reports (20261005000001),
//   contact_messages (20261005000002),
//   event_registrations (20261005000003).

const ALREADY_EXISTS_CODES = ["42P07", "42701", "42710"];

function isAlreadyExists(err) {
  const code = err?.parent?.code || err?.original?.code || err?.code;

  if (ALREADY_EXISTS_CODES.includes(code)) return true;

  return String(err?.message || "").toLowerCase().includes("already exists");
}

async function createTableIfMissing(queryInterface, tableName, attributes) {
  try {
    await queryInterface.createTable(tableName, attributes);
  } catch (err) {
    if (!isAlreadyExists(err)) throw err;
  }
}

async function addIndexIfMissing(queryInterface, tableName, fields, options) {
  try {
    await queryInterface.addIndex(tableName, fields, options);
  } catch (err) {
    if (!isAlreadyExists(err)) throw err;
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const createdAt = { type: Sequelize.DATE, allowNull: false };
    const updatedAt = { type: Sequelize.DATE, allowNull: false };

    // ── users ──
    await createTableIfMissing(queryInterface, "users", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      firstName: { type: Sequelize.STRING(50), allowNull: false },
      lastName: { type: Sequelize.STRING(50), allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      phoneNumber: { type: Sequelize.STRING(20), allowNull: true },
      profilePicture: { type: Sequelize.STRING, allowNull: true },
      country: { type: Sequelize.STRING, allowNull: true },
      state: { type: Sequelize.STRING, allowNull: true },
      city: { type: Sequelize.STRING, allowNull: true },
      location: { type: Sequelize.STRING, allowNull: true },
      about: { type: Sequelize.TEXT, allowNull: true },
      role: {
        type: Sequelize.ENUM("user", "admin", "moderator"),
        defaultValue: "user",
      },
      agreeToTerms: { type: Sequelize.BOOLEAN, defaultValue: false },
      isVerified: { type: Sequelize.BOOLEAN, defaultValue: false },
      lastLogin: { type: Sequelize.DATE, allowNull: true },
      verificationToken: { type: Sequelize.STRING, allowNull: true },
      resetPasswordToken: { type: Sequelize.STRING, allowNull: true },
      resetPasswordExpires: { type: Sequelize.DATE, allowNull: true },
      createdAt,
      updatedAt,
    });

    // ── categories ──
    await createTableIfMissing(queryInterface, "categories", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      createdAt,
      updatedAt,
    });

    // ── subcategories ──
    await createTableIfMissing(queryInterface, "subcategories", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "categories", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt,
      updatedAt,
    });

    // Index composite déclaré dans models/category.js :
    // un même nom de sous-catégorie est autorisé dans
    // plusieurs catégories (l'unicité porte sur la paire).
    await addIndexIfMissing(
      queryInterface,
      "subcategories",
      ["categoryId", "name"],
      { unique: true, name: "subcategories_category_id_name" },
    );

    // ── advs ──
    await createTableIfMissing(queryInterface, "advs", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: Sequelize.STRING(255), allowNull: false },
      country: { type: Sequelize.STRING(100), allowNull: false },
      state: { type: Sequelize.STRING(100), allowNull: false },
      city: { type: Sequelize.STRING(100), allowNull: false },
      location: { type: Sequelize.STRING(255), allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: false },
      email: { type: Sequelize.STRING(100), allowNull: false },
      phone: { type: Sequelize.STRING(30), allowNull: true },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      photos: { type: Sequelize.ARRAY(Sequelize.STRING), defaultValue: [] },
      amenities: { type: Sequelize.ARRAY(Sequelize.STRING), defaultValue: [] },
      status: {
        type: Sequelize.ENUM("Active", "Inactive", "Sold"),
        defaultValue: "Active",
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "categories", key: "id" },
      },
      datePosted: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      expirationDate: { type: Sequelize.DATE, allowNull: true },
      views: { type: Sequelize.INTEGER, defaultValue: 0 },
      isPromoted: { type: Sequelize.BOOLEAN, defaultValue: false },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      createdAt,
      updatedAt,
    });

    // ── events ──
    await createTableIfMissing(queryInterface, "events", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: Sequelize.STRING(255), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      date: { type: Sequelize.DATE, allowNull: false },
      location: { type: Sequelize.STRING(255), allowNull: false },
      type: { type: Sequelize.STRING(100), allowNull: true },
      authorName: { type: Sequelize.STRING(150), allowNull: true },
      authorEmail: { type: Sequelize.STRING(150), allowNull: true },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt,
      updatedAt,
    });

    // ── news ──
    await createTableIfMissing(queryInterface, "news", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: Sequelize.STRING(255), allowNull: false },
      content: { type: Sequelize.TEXT, allowNull: false },
      category: { type: Sequelize.STRING(100), allowNull: true },
      importance: {
        type: Sequelize.ENUM("low", "medium", "high"),
        defaultValue: "medium",
      },
      date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      createdAt,
      updatedAt,
    });

    // ── publications ──
    await createTableIfMissing(queryInterface, "publications", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: Sequelize.STRING(255), allowNull: false },
      content: { type: Sequelize.TEXT, allowNull: false },
      category: { type: Sequelize.STRING(100), allowNull: true },
      author: { type: Sequelize.STRING(100), allowNull: true },
      readTime: { type: Sequelize.STRING(50), allowNull: true },
      date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt,
      updatedAt,
    });

    // ── forum_categories ──
    await createTableIfMissing(queryInterface, "forum_categories", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: Sequelize.STRING(150), allowNull: false, unique: true },
      description: { type: Sequelize.STRING(300), allowNull: true },
      icon: {
        type: Sequelize.STRING(60),
        allowNull: true,
        defaultValue: "forum",
      },
      color: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: "#0057B8",
      },
      bgColor: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: "#eff6ff",
      },
      sortOrder: { type: Sequelize.INTEGER, defaultValue: 0 },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt,
      updatedAt,
    });

    // ── forum_topics (sans forumCategoryId : ajouté par 20260620120003) ──
    await createTableIfMissing(queryInterface, "forum_topics", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: Sequelize.STRING(255), allowNull: false },
      content: { type: Sequelize.TEXT, allowNull: false },
      category: { type: Sequelize.STRING(100), allowNull: true },
      author: { type: Sequelize.STRING(100), allowNull: true },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      replies: { type: Sequelize.INTEGER, defaultValue: 0 },
      views: { type: Sequelize.INTEGER, defaultValue: 0 },
      lastUpdate: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      createdAt,
      updatedAt,
    });

    // ── forum_replies ──
    await createTableIfMissing(queryInterface, "forum_replies", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      topicId: { type: Sequelize.INTEGER, allowNull: false },
      content: { type: Sequelize.TEXT, allowNull: false },
      author: { type: Sequelize.STRING(100), allowNull: true },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt,
      updatedAt,
    });

    // ── conversations ──
    await createTableIfMissing(queryInterface, "conversations", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      adId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "advs", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      lastMessageAt: { type: Sequelize.DATE, allowNull: true },
      createdAt,
      updatedAt,
    });

    // ── messages ──
    await createTableIfMissing(queryInterface, "messages", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      conversationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "conversations", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      senderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      recipientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      body: { type: Sequelize.TEXT, allowNull: false },
      isRead: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt,
      updatedAt,
    });

    // ── adv_expiration_settings ──
    await createTableIfMissing(queryInterface, "adv_expiration_settings", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      durationPreset: {
        type: Sequelize.ENUM("1_week", "1_month", "custom"),
        allowNull: false,
        defaultValue: "1_month",
      },
      durationDays: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 30,
      },
      action: {
        type: Sequelize.ENUM("archive", "delete", "hide"),
        allowNull: false,
        defaultValue: "archive",
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt,
      updatedAt,
    });

    console.log("[baseline] Tables de base vérifiées/créées.");
  },

  down: async () => {
    // No-op volontaire : sur une base existante, ces tables
    // existaient déjà avant cette migration (backfill) et
    // ne doivent surtout pas être supprimées.
  },
};
