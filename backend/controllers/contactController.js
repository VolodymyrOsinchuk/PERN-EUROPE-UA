const { ContactMessage } = require("../models/contactMessage");

exports.createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res
        .status(400)
        .json({ error: "Усі поля є обов'язковими" });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      message: "Повідомлення надіслано. Ми зв'яжемося з вами найближчим часом.",
      contactMessage,
    });
  } catch (error) {
    console.error("Помилка createContactMessage:", error);
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
