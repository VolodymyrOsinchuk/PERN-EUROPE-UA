require("dotenv").config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

module.exports = {
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    url: process.env.DATABASE_URL,
    dialect: "postgres",
  },
  server: {
    port: process.env.SERVER_PORT || 5000,
  },
  client: {
    url: process.env.BACKEND_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expirationTime: process.env.JWT_EXPIRATION,
  },
  email: {
    smtp: {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    from: process.env.EMAIL_FROM,
  },
};
