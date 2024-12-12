require("dotenv").config();
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

// import DB Sequelize
const sequelize = require("./config/db");
const advRoutes = require("./routes/advRouter");
const categoryRoutes = require("./routes/categoryRouter");
const authRoutes = require("./routes/authRouter");
const userRoutes = require("./routes/userRouter");
const config = require("./config/config");
// console.log("process.env", config);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname + "/public")));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.get("/", (req, res) => {
  res.send("Ласкаво просимо до серверної частини");
});
app.get("/api", (req, res) => {
  res.status(200).json({ msg: "Ласкаво просимо до серверної частини" });
});

app.use("/api/v1/adv", advRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

app.use("*", (req, res) => {
  res.status(404).json({ msg: "не знайдено" });
});
app.use((err, req, res, next) => {
  console.log("🚀 ~ app.use ~ err:", err);
  res.status(500).json({ msg: "Щось пішло не так!!!" });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Сервер працює на порту " + port);
  console.log(`Сервер запущено в ${process.env.NODE_ENV}`);
});

const testDbConnection = async () => {
  try {
    await sequelize.sync();
    console.log("З'єднання з базою даних встановлено успішно");
  } catch (error) {
    console.error("Не вдається підключитися до бази даних:", error);
  }
};

testDbConnection();
