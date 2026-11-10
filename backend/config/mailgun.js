// config/mailgun.js
const FormData = require("form-data");
const Mailgun = require("mailgun.js");

const {
  MAILGUN_API_KEY,
  // Région EU par défaut (comme avant). Pour une région US : https://api.mailgun.net
  MAILGUN_API_URL = "https://api.eu.mailgun.net",
} = process.env;

if (!MAILGUN_API_KEY) {
  throw new Error(
    "MAILGUN_API_KEY est manquant dans les variables d'environnement.",
  );
}

const mailgun = new Mailgun(FormData);

module.exports = mailgun.client({
  username: "api",
  key: MAILGUN_API_KEY,
  url: MAILGUN_API_URL,
});
