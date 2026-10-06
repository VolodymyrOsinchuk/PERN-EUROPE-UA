const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Routes publiques — ordre important: routes fixes avant /:id
router.get("/", eventController.getAllEvents);
router.get("/user-events", authMiddleware, eventController.getUserEvents);
router.get("/:id/registration", authMiddleware, eventController.getRegistrationStatus);
router.get("/:id", eventController.getEventById);

// CRUD authentifié
router.post("/", authMiddleware, eventController.createEvent);
router.put("/:id", authMiddleware, eventController.updateEvent);
router.delete("/:id", authMiddleware, eventController.deleteEvent);

// Inscriptions aux événements
router.post("/:id/register", authMiddleware, eventController.registerEvent);
router.delete("/:id/register", authMiddleware, eventController.unregisterEvent);

module.exports = router;
