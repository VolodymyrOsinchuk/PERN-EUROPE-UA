const sequelize = require("../config/db");

async function truncateAllTables() {
  try {
    await sequelize.authenticate();
    console.log("З'єднання встановлено успішно");
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error("Не вдається підключитися до бази даних:", error);
  } finally {
    await sequelize.close();
    console.log("З'єднання успішно закрито..");
  }
}

truncateAllTables();
