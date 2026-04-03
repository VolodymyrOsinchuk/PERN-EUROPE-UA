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

exports.createEvent = async (req, res) => {
  try {
    const newEvent = await Event.create(req.body);
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
    const [updated] = await Event.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedEvent = await Event.findByPk(req.params.id);
      res.status(200).json(updatedEvent);
    } else {
      res.status(404).json({ message: "Подію не знайдено" });
    }
  } catch (error) {
    console.error("Помилка updateEvent:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send("Подію видалено");
    } else {
      res.status(404).json({ message: "Подію не знайдено" });
    }
  } catch (error) {
    console.error("Помилка deleteEvent:", error);
    res.status(500).json({ error: error.message });
  }
};
