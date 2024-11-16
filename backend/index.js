require("dotenv").config();
const express = require("express");
const app = express();

// import DB Sequelize
const sequelize = require("./config/db");

app.get("/", (req, res) => {
  res.send("Welcome to the backend");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("server listening on port 5000");
});

const testDbConnection = async () => {
  try {
    await sequelize.sync({ logging: false });
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

testDbConnection();
