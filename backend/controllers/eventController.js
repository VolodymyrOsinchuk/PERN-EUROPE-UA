const { Event } = require("../models/event");
const { User } = require("../models/user");
const { EventRegistration } = require("../models/eventRegistration");
const { pick } = require("../utils/pick");

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({ order: [["date", "ASC"]] });
    res.status(200).json(events);
  } catch (error) {
    console.error("Помилка getAllEvents:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
    });
    if (!event) return res.status(404).json({ message: "Подію не знайдено" });

    // FIX: nombre de participants inscrits
    const registrationsCount = await EventRegistration.count({
      where: { eventId: event.id },
    });

    res.status(200).json({
      ...event.get({ plain: true }),
      registrationsCount,
    });
  } catch (error) {
    console.error("Помилка getEventById:", error);
    res.status(500).json({ error: error.message });
  }
};

// POST /api/v1/events/:id/register — s'inscrire à un événement
exports.registerEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Подію не знайдено" });
    }

    if (new Date(event.date) < new Date()) {
      return res
        .status(400)
        .json({ message: "Подія вже завершена" });
    }

    const [registration, created] =
      await EventRegistration.findOrCreate({
        where: { eventId: event.id, userId: req.user.userId },
        defaults: { eventId: event.id, userId: req.user.userId },
      });

    res.status(created ? 201 : 200).json({
      message: created
        ? "Ви зареєстровані на подію"
        : "Ви вже зареєстровані на цю подію",
      registered: true,
      registration,
    });
  } catch (error) {
    console.error("Помилка registerEvent:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({ message: "Ви вже зареєстровані на цю подію" });
    }
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/v1/events/:id/register — annuler l'inscription
exports.unregisterEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Подію не знайдено" });
    }

    const deleted = await EventRegistration.destroy({
      where: { eventId: event.id, userId: req.user.userId },
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Реєстрацію не знайдено" });
    }

    res.status(200).json({
      message: "Реєстрацію скасовано",
      registered: false,
    });
  } catch (error) {
    console.error("Помилка unregisterEvent:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/v1/events/:id/registration — statut d'inscription du user
exports.getRegistrationStatus = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Подію не знайдено" });
    }

    const registration = await EventRegistration.findOne({
      where: { eventId: event.id, userId: req.user.userId },
    });
    const count = await EventRegistration.count({
      where: { eventId: event.id },
    });

    res.status(200).json({
      registered: !!registration,
      registrationsCount: count,
    });
  } catch (error) {
    console.error("Помилка getRegistrationStatus:", error);
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
    // FIX: auto-fill authorName & authorEmail from authenticated user
    const user = await User.findByPk(req.user.userId, {
      attributes: ["firstName", "lastName", "email"],
    });

    const allowedData = pick(req.body, ["title", "description", "date", "location", "type"]);
    const newEvent = await Event.create({
      ...allowedData,
      userId: req.user.userId,
      authorName: user
        ? `${user.firstName} ${user.lastName}`.trim()
        : req.body.authorName || null,
      authorEmail: user ? user.email : req.body.authorEmail || null,
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
    if (!event) return res.status(404).json({ message: "Подію не знайдено" });

    // FIX: check userId instead of createdBy
    if (event.userId !== req.user.userId && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Не дозволено змінювати цю подію" });
    }
    await event.update(pick(req.body, ["title", "description", "date", "location", "type"]));
    res.status(200).json(event);
  } catch (error) {
    console.error("Помилка updateEvent:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Подію не знайдено" });

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
