// FIX P0-3: nouveau middleware pour empêcher un utilisateur de modifier
// ou supprimer le compte d'un autre utilisateur.
const checkSelfOrAdmin = (req, res, next) => {
  const targetId = parseInt(req.params.id, 10);
  const isSelf = req.user.userId === targetId;
  const isAdmin = req.user.role === "admin";

  if (!isSelf && !isAdmin) {
    return res.status(403).json({
      message: "Не дозволено виконувати цю дію для іншого користувача",
    });
  }

  next();
};

module.exports = checkSelfOrAdmin;
