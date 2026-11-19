const { User } = require("../models/user");
const { Adv, PUBLIC_WHERE } = require("../models/adv");
const { Event } = require("../models/event");
const { Op } = require("sequelize");

/**
 * GET /api/v1/public/stats
 * Public statistics for the landing page (no auth required).
 */
exports.getPublicStats = async (req, res) => {
  try {
    const [
      userCount,
      adCount,
      eventCount,
      countryCount,
      adCountryCount,
      adCityCount,
    ] =
      await Promise.all([
        User.count(),
        Adv.count({ where: PUBLIC_WHERE }),
        Event.count(),
        User.count({
          distinct: true,
          col: "country",
          where: {
            country: {
              [Op.ne]: null,
            },
          },
        }),
        Adv.count({
          distinct: true,
          col: "country",
          where: PUBLIC_WHERE,
        }),
        Adv.count({
          distinct: true,
          col: "city",
          where: PUBLIC_WHERE,
        }),
      ]);

    res.status(200).json({
      users: userCount,
      ads: adCount,
      events: eventCount,
      countries: countryCount,
      adCountries: adCountryCount,
      adCities: adCityCount,
    });
  } catch (error) {
    console.error("Помилка getPublicStats:", error);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
};
