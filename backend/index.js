require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

// import DB Sequelize
const sequelize = require("./config/db");
const advRoutes = require("./routes/advRouter");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.get("/", (req, res) => {
  res.send("Ласкаво просимо до серверної частини");
});

app.use("/api/v1/adv", advRoutes);

app.use("*", (req, res) => {
  res.status(404).json({ msg: "не знайдено" });
});
app.use((err, req, res, next) => {
  console.log("🚀 ~ app.use ~ err:", err);
  res.status(500).json({ msg: "Щось пішло не так!!!" });
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
