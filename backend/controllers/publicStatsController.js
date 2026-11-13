const { User } = require("../models/user");
const { Adv } = require("../models/adv");
const { Event } = require("../models/event");

/**
 * GET /api/v1/public/stats
 * Public statistics for the landing page (no auth required).
 */
exports.getPublicStats = async (req, res) => {
  try {
    const [userCount, adCount, eventCount, countryCount] =
      await Promise.all([
        User.count(),
        Adv.count(),
        Event.count(),
        User.count({
          distinct: true,
          col: "country",
          where: {
            country: {
              [require("sequelize").Op.ne]: null,
            },
          },
        }),
      ]);

    res.status(200).json({
      users: userCount,
      ads: adCount,
      events: eventCount,
      countries: countryCount,
    });
  } catch (error) {
    console.error("Помилка getPublicStats:", error);
    res.status(500).json({ error: error.message });
  }
};
