const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Routes publiques
router.get("/", eventController.getAllEvents);

// Route authentifiée
router.get(
  "/user-events",
  authMiddleware,
  eventController.getUserEvents
);

// CRUD avec auth
router.post("/", authMiddleware, eventController.createEvent);
router.put("/:id", authMiddleware, eventController.updateEvent);
router.delete("/:id", authMiddleware, eventController.deleteEvent);

module.exports = router;
