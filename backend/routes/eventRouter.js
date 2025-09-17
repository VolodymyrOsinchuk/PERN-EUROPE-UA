const express = require("express");
const router = express.Router();
const {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

router.route("/").get(getAllEvents).post(createEvent);
router.route("/:id").put(updateEvent).delete(deleteEvent);

module.exports = router;
