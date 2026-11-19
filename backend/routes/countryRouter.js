// backend/routes/countryRouter.js
const express = require("express");
const router = express.Router();
const country = require("../controllers/countryController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authMiddleware");

const staffOnly = [authMiddleware, roleMiddleware(["admin", "moderator"])];

// Публічні
router.get("/", country.getPublishedCountries);

// Для admin і moderator.
// Фіксовані шляхи (/admin/all, /links/:id) оголошено раніше за /:code.
router.get("/admin/all", ...staffOnly, country.getAllCountriesAdmin);
router.post("/", ...staffOnly, country.createCountry);
router.put("/links/:id", ...staffOnly, country.updateLink);
router.patch("/links/:id/verify", ...staffOnly, country.verifyLink);
router.delete("/links/:id", ...staffOnly, country.deleteLink);
router.post("/:code/links", ...staffOnly, country.createLink);
router.put("/:code", ...staffOnly, country.updateCountry);

// Публічна сторінка однієї країни (лише якщо опублікована)
router.get("/:code", country.getPublishedCountry);

module.exports = router;
