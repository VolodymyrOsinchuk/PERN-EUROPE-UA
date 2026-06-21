const path = require("path");
require("dotenv").config({
  path: path.join(
    __dirname,
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
  ),
});
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cron = require("node-cron");
const app = express();

const sequelize = require("./config/db");
const { startAdExpirationCron } = require("./cron/adExpirationCron");
const advRoutes = require("./routes/advRouter");
const categoryRoutes = require("./routes/categoryRouter");
const authRoutes = require("./routes/authRouter");
const userRoutes = require("./routes/userRouter");
const eventRoutes = require("./routes/eventRouter");
const newsRoutes = require("./routes/newsRouter");
const publicationRoutes = require("./routes/publicationRouter");
const forumRoutes = require("./routes/forumRouter");
const messageRoutes = require("./routes/messageRouter");
const adExpirationSettingsRouter = require("./routes/adExpirationSettingsRouter");
const config = require("./config/config");
const { authMiddleware } = require("./middleware/authMiddleware");

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: config.client.url,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("Ласкаво просимо до серверної частини");
});

app.get("/api", (req, res) => {
  res.status(200).json({ message: "Ласкаво просимо до серверної частини" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", authMiddleware, userRoutes);
app.use("/api/v1/adv", advRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/publications", publicationRoutes);
app.use("/api/v1/forum", forumRoutes);
app.use("/api/v1/messages", authMiddleware, messageRoutes);
app.use("/api/v1/admin/ad-expiration-settings", adExpirationSettingsRouter);

startAdExpirationCron();

app.use((err, req, res, next) => {
  console.error("[ПОМИЛКА]", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      error: "Помилка валідації",
      details: err.errors.map((e) => e.message),
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      error: "Виник конфлікт",
      details: err.errors.map((e) => e.message),
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Невірний токен" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Токен прострочений" });
  }

  res
    .status(500)
    .json({ error: "Внутрішня помилка сервера", message: err.message });
});

app.use((req, res) => {
  res.status(404).json({ error: "Не знайдено", path: req.path });
});

const port = process.env.PORT || 5000;

const https = require("https");
const http = require("http");

cron.schedule("*/15 * * * *", async () => {
  try {
    // 1. Ping Database
    await sequelize.authenticate();
    console.log(`[${new Date().toISOString()}] База даних активна`);

    // 2. Ping Self (to keep Render/etc awake)
    const backendUrl = process.env.BACKEND_URL;
    if (backendUrl) {
      const client = backendUrl.startsWith("https") ? https : http;
      client
        .get(`${backendUrl}/api`, (res) => {
          console.log(
            `[${new Date().toISOString()}] Авто-пінг успішний: ${res.statusCode}`,
          );
        })
        .on("error", (err) => {
          console.error(
            `[${new Date().toISOString()}] Помилка авто-пінгу:`,
            err.message,
          );
        });
    }
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Помилка пінгу:`, err.message);
  }
});

const testDbConnection = async () => {
  try {
    await sequelize.sync();
    console.log("З'єднання з базою даних встановлено успішно");
    app.listen(port, () => {
      console.log(`Сервер працює на порту ${port}`);
      console.log(`Сервер запущено в ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("Не вдається підключитися до бази даних:", error);
    process.exit(1);
  }
};

testDbConnection();
