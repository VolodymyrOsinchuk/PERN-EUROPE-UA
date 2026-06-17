// config/mailgun.js
const FormData = require("form-data");
const Mailgun = require("mailgun.js");

const mailgun = new Mailgun(FormData);

const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
  // Décommentez si votre domaine est en Europe :
  // url: "https://api.eu.mailgun.net",
});

module.exports = mg;
