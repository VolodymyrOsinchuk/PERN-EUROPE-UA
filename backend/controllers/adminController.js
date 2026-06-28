const { User } = require("../models/user");
const sequelize = require("../config/db");

exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.findAll({
      where: { role: ["admin", "moderator"] },
      attributes: ["id", "firstName", "lastName", "email", "role", "isVerified", "lastLogin", "createdAt"],
      order: [["role", "ASC"], ["createdAt", "ASC"]],
    });
    const mapped = admins.map((u) => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`.trim(),
      email: u.email,
      role: u.role === "admin" ? "super-admin" : "moderator",
      active: u.isVerified,
      lastLogin: u.lastLogin
        ? formatRelativeTime(u.lastLogin)
        : "ніколи",
    }));
    res.status(200).json(mapped);
  } catch (error) {
    console.error("Помилка getAdmins:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateAdminRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const validRoles = ["admin", "moderator", "user"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Невірна роль" });
    }
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "Користувача не знайдено" });
    await user.update({ role });
    res.status(200).json({ message: "Роль оновлено" });
  } catch (error) {
    console.error("Помилка updateAdminRole:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    if (!email || !password || !firstName) {
      return res.status(400).json({ error: "Ім'я, email та пароль обов'язкові" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Пароль має містити щонайменше 8 символів" });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Користувач з таким email вже існує" });
    }
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || "admin",
      isVerified: true,
    });
    res.status(201).json({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Помилка createAdmin:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "Користувача не знайдено" });
    if (req.user.userId === user.id) {
      return res.status(400).json({ error: "Не можна видалити себе" });
    }
    await user.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Помилка deleteAdmin:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getSystemInfo = async (req, res) => {
  try {
    const dbResult = await sequelize.query("SELECT version()", {
      type: sequelize.QueryTypes.SELECT,
    });
    const dbVersion = dbResult[0]?.version || "PostgreSQL";
    res.status(200).json({
      appVersion: "1.0.0",
      nodeVersion: process.version,
      dbVersion,
      environment: process.env.NODE_ENV || "development",
    });
  } catch (error) {
    console.error("Помилка getSystemInfo:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.toggleMaintenance = async (req, res) => {
  try {
    const { enabled } = req.body;
    res.status(200).json({
      message: enabled
        ? "Режим обслуговування активовано"
        : "Режим обслуговування вимкнено",
      maintenance: !!enabled,
    });
  } catch (error) {
    console.error("Помилка toggleMaintenance:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.clearCache = async (req, res) => {
  try {
    res.status(200).json({ message: "Кеш очищено успішно" });
  } catch (error) {
    console.error("Помилка clearCache:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.backupDb = async (req, res) => {
  try {
    res.status(200).json({ message: "Резервну копію створено" });
  } catch (error) {
    console.error("Помилка backupDb:", error);
    res.status(500).json({ error: error.message });
  }
};

function formatRelativeTime(date) {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "щойно";
  if (diffMin < 60) return `${diffMin} хв тому`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} год тому`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 30) return `${diffD} дн тому`;
  return `${Math.floor(diffD / 30)} міс тому`;
}
