const { ContactMessage } = require("../models/contactMessage");
const { sanitizeText } = require("../utils/sanitize");
const {
  sendContactNotification,
  sendContactAcknowledgement,
} = require("../services/brevo/mailService");

exports.createContactMessage = async (req, res) => {
  try {
    // Honeypot: поле "website" приховане від людей. Боти його заповнюють.
    // Відповідаємо успіхом, щоб бот не зрозумів, що його викрили.
    if (req.body?.website) {
      return res.status(201).json({ message: "Повідомлення надіслано." });
    }

    const name = sanitizeText(req.body?.name);
    const email = sanitizeText(req.body?.email);
    const subject = sanitizeText(req.body?.subject);
    const message = sanitizeText(req.body?.message);

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Усі поля є обов'язковими" });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
    });

    // Листи не блокують відповідь. Збій пошти не скасовує збереження звернення.
    await Promise.allSettled([
      sendContactNotification({ name, email, subject, message }),
      sendContactAcknowledgement({ name, email, subject }),
    ]);

    res.status(201).json({
      message: "Повідомлення надіслано. Ми зв'яжемося з вами найближчим часом.",
      contactMessage,
    });
  } catch (error) {
    console.error("Помилка createContactMessage:", error.name);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Помилка валідації",
        details: error.errors.map((e) => e.message),
      });
    }
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
};
exports.getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Помилка getContactMessages:", error);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
};
