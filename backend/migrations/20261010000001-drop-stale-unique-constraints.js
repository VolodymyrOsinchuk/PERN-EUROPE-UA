"use strict";

// Supprime les contraintes UNIQUE(name) obsolètes ou dupliquées
// sur `categories` et `subcategories`.
//
// Contexte :
//   Les anciennes versions des modèles déclaraient `unique: true`
//   sur subcategories.name, et sequelize.sync() (exécuté à chaque
//   démarrage de index.js) accumulait les contraintes :
//   subcategories_name_key, subcategories_name_key1… _keyN.
//
//   Or le modèle autorise le même nom de sous-catégorie dans
//   plusieurs catégories (ex. « Волонтерство » dans « Робота » ET
//   « Спільнота »). La seule unicité valide est (categoryId, name),
//   portée par l'index subcategories_category_id_name.
//
//   Sur `categories`, une seule contrainte UNIQUE(name) est gardée
//   (les doublons sont supprimés).
//
// La détection est dynamique (pg_constraint) : le nombre de
// doublons varie selon les environnements.

module.exports = {
  up: async (queryInterface) => {
    const [rows] = await queryInterface.sequelize.query(
      `SELECT conrelid::regclass::text AS tbl, conname
       FROM pg_constraint
       WHERE contype = 'u'
         AND pg_get_constraintdef(oid) = 'UNIQUE (name)'
         AND conrelid IN ('categories'::regclass, 'subcategories'::regclass)
       ORDER BY conrelid::regclass::text, conname`,
    );

    let categoriesKept = false;

    for (const row of rows) {
      const table = row.tbl;
      const name = row.conname;

      // Garder exactement une contrainte UNIQUE(name) sur categories
      if (table === "categories" && !categoriesKept) {
        categoriesKept = true;
        continue;
      }

      await queryInterface.sequelize.query(
        `ALTER TABLE ${table} DROP CONSTRAINT "${name}"`,
      );
      console.log(`[cleanup] ${table}.${name} supprimée`);
    }

    console.log("[cleanup] Contraintes UNIQUE(name) nettoyées.");
  },

  down: async () => {
    // Irréversible : les contraintes supprimées étaient des
    // doublons. La contrainte gardée sur categories n'a pas
    // été touchée.
  },
};
