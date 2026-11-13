const { Adv } = require("../models/adv");
const { User } = require("../models/user");
const { sanitizeText } = require("../utils/sanitize");
const { isAdPublic } = require("../utils/publicAd");
const { sendAdContactEmail } = require("../utils/emailService");

const MAX_LEN = 2000;

// POST /ad-email  { adId, message }
exports.sendAdEmail = async (req, res) => {
  try {
    const me = req.user.userId;
    const adId = Number(req.body?.adId);
    const message = sanitizeText(req.body?.message ?? "");

    if (
      !Number.isInteger(adId) ||
      adId <= 0 ||
      message.length < 1 ||
      message.length > MAX_LEN
    ) {
      return res
        .status(400)
        .json({ message: "Вкажіть оголошення та текст (до 2000 символів)" });
    }

    const ad = await Adv.findByPk(adId, {
      attributes: [
        "id",
        "title",
        "email",
        "userId",
        "status",
        "isArchived",
        "moderationStatus",
        "contactByEmail",
      ],
    });
    if (!ad || !isAdPublic(ad)) {
      return res.status(404).json({ message: "Оголошення не знайдено" });
    }
    if (!ad.contactByEmail) {
      return res.status(403).json({
        message: "Листування через email для цього оголошення вимкнено",
      });
    }
    if (ad.userId === me) {
      return res
        .status(400)
        .json({ message: "Ви не можете написати власному оголошенню" });
    }

    const sender = await User.findByPk(me, {
      attributes: ["firstName", "lastName", "email"],
    });

    const sent = await sendAdContactEmail({
      to: ad.email,
      adId: ad.id,
      adTitle: ad.title,
      senderName: `${sender.firstName} ${sender.lastName}`.trim(),
      senderEmail: sender.email,
      message,
    });

    if (!sent) {
      return res
        .status(502)
        .json({ message: "Не вдалося надіслати лист. Спробуйте пізніше" });
    }
    return res.status(200).json({ message: "Лист надіслано" });
  } catch (error) {
    console.error("Помилка sendAdEmail:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};
