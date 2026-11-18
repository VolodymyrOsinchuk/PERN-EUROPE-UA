const sequelize = require("../config/db");

async function truncateAllTables() {
  if (process.env.ALLOW_DB_RESET !== "true") {
    console.error(
      "Скидання БД заблоковано. Для локального reset явно задайте ALLOW_DB_RESET=true.",
    );
    process.exitCode = 1;
    return;
  }

  if (process.env.NODE_ENV === "production") {
    console.error("Скидання БД у production заборонено.");
    process.exitCode = 1;
    return;
  }

  try {
    await sequelize.authenticate();
    console.log("З'єднання встановлено успішно");
    await sequelize.sync({ force: process.env.NODE_ENV !== "production" });
  } catch (error) {
    console.error("Не вдається підключитися до бази даних:", error);
  } finally {
    await sequelize.close();
    console.log("З'єднання успішно закрито..");
  }
}

truncateAllTables();
