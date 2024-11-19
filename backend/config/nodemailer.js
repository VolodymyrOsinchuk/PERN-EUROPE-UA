// config/nodemailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: process.env.SENDGRID_USERNAME,
    pass: process.env.SENDGRID_PASSWORD,
  },
  // host: "smtp.sendgrid.net",
  // port: 587,
  // secure: false,
});

module.exports = transporter;
