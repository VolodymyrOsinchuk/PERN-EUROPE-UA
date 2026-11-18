const { SellerReview } = require("../models/sellerReview");
const { User } = require("../models/user");
const sequelize = require("../config/db");
const { Deal } = require("../models/deal");

exports.getSellerReviews = async (req, res) => {
  try {
    const sellerId = Number(req.params.sellerId);
    const reviews = await SellerReview.findAll({
      where: { sellerId },
      include: [
        {
          model: User,
          as: "reviewer",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 20,
    });
    const summary = await SellerReview.findOne({
      where: { sellerId },
      attributes: [
        [sequelize.fn("AVG", sequelize.col("rating")), "average"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      raw: true,
    });
    res.status(200).json({
      average: summary?.average ? Number(summary.average) : null,
      count: summary?.count ? Number(summary.count) : 0,
      reviews,
    });
  } catch (error) {
    console.error("Помилка getSellerReviews:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

exports.upsertSellerReview = async (req, res) => {
  try {
    const sellerId = Number(req.params.sellerId);
    const reviewerId = req.user.userId;
    const rating = Number(req.body?.rating);
    const comment = String(req.body?.comment || "").trim().slice(0, 500);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Оцінка має бути від 1 до 5" });
    }
    if (sellerId === reviewerId) {
      return res.status(400).json({ message: "Не можна оцінити власний акаунт" });
    }
    const seller = await User.findByPk(sellerId);
    if (!seller) return res.status(404).json({ message: "Продавця не знайдено" });

    const deal = await Deal.findOne({
      where: {
        sellerId,
        buyerId: reviewerId,
        status: "completed",
      },
    });
    if (!deal) {
      return res.status(403).json({
        message: "Відгук можна залишити лише після завершеної угоди",
      });
    }

    await SellerReview.upsert({
      sellerId,
      reviewerId,
      rating,
      comment: comment || null,
      dealId: deal.id,
    });
    res.status(200).json({ message: "Відгук збережено" });
  } catch (error) {
    console.error("Помилка upsertSellerReview:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};
