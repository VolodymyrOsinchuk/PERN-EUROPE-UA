const path = require("path");
const { Sequelize } = require("sequelize");
const { Umzug, SequelizeStorage } = require("umzug");
const SequelizeLib = require("sequelize");
const sequelize = require("../config/db");

const umzug = new Umzug({
  migrations: {
    glob: path.join(__dirname, "../migrations/*.js"),
    resolve: (args) => ({
      name: args.name,
      path: args.path,
      up: async () => {
        const migration = require(args.path);
        const queryInterface = sequelize.getQueryInterface();
        await migration.up(queryInterface, SequelizeLib);
      },
      down: async () => {
        const migration = require(args.path);
        const queryInterface = sequelize.getQueryInterface();
        await migration.down(queryInterface, SequelizeLib);
      },
    }),
  },
  context: sequelize,
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

const runMigrations = async () => {
  try {
    const pending = await umzug.pending();
    if (pending.length === 0) {
      console.log("Aucune migration en attente.");
    } else {
      console.log(`${pending.length} migration(s) en attente :`);
      pending.forEach((m) => console.log(`  - ${m.name}`));
      const executed = await umzug.up();
      console.log(`${executed.length} migration(s) exécutée(s).`);
    }
  } catch (error) {
    console.error("Erreur lors de l'exécution des migrations:", error);
    process.exit(1);
  }
};

runMigrations().then(() => {
  console.log("Migrations terminées.");
  process.exit(0);
});
