const { Event } = require("../models/event");

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (error) {
    console.error("Помилка getAllEvents:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUserEvents = async (req, res) => {
  try {
    const userId = req.user.userId;
    const events = await Event.findAll({
      where: { userId },
      order: [["date", "DESC"]],
    });
    res.status(200).json(events);
  } catch (error) {
    console.error("Помилка getUserEvents:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const newEvent = await Event.create({
      ...req.body,
      userId: req.user.userId,
    });
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Помилка createEvent:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Помилка валідації",
        details: error.errors.map((e) => e.message),
      });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Подію не знайдено" });
    }
    if (event.userId !== req.user.userId && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Не дозволено змінювати цю подію" });
    }
    await event.update(req.body);
    res.status(200).json(event);
  } catch (error) {
    console.error("Помилка updateEvent:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Подію не знайдено" });
    }
    if (event.userId !== req.user.userId && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Не дозволено видаляти цю подію" });
    }
    await event.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Помилка deleteEvent:", error);
    res.status(500).json({ error: error.message });
  }
};
