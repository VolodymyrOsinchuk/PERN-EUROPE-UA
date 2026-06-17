// // config/nodemailer.js
// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "SendGrid",
//   auth: {
//     user: process.env.SENDGRID_USERNAME,
//     pass: process.env.SENDGRID_PASSWORD,
//   },
//   // host: "smtp.sendgrid.net",
//   // port: 587,
//   // secure: false,
// });

// module.exports = transporter;

const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");

// const transporter = nodemailer.createTransport({
//   host: "smtp.mailgun.org", // ou smtp-relay.sendinblue.com, email-smtp.us-east-1.amazonaws.com
//   port: 587,
//   secure: false,
//   auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
// });
// await transporter.sendMail({ from, to, subject, text, html });
// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
};

const transporter = nodemailer.createTransport(mg(auth));

module.exports = transporter;
