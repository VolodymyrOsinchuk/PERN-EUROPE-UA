const { Op } = require("sequelize");
const { Notification } = require("../models/notification");

// GET /api/v1/notifications — liste de l'utilisateur connecté
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.userId },
      order: [["createdAt", "DESC"]],
      limit: 50,
    });
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Помилка getMyNotifications:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

// GET /api/v1/notifications/unread-count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.count({
      where: { userId: req.user.userId, isRead: false },
    });
    res.status(200).json({ unread: count });
  } catch (error) {
    console.error("Помилка getUnreadCount:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

// PATCH /api/v1/notifications/:id/read
exports.markAsRead = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Некоректний ідентифікатор" });
    }

    // Filtre sur userId : on ne peut marquer que ses propres notifications.
    const [updated] = await Notification.update(
      { isRead: true },
      { where: { id, userId: req.user.userId } },
    );
    if (updated === 0) {
      return res.status(404).json({ message: "Сповіщення не знайдено" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Помилка markAsRead:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};

// PATCH /api/v1/notifications/read-all
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.userId, isRead: false } },
    );
    res.status(204).send();
  } catch (error) {
    console.error("Помилка markAllAsRead:", error);
    res.status(500).json({ message: "Внутрішня помилка сервера" });
  }
};
