const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

router.route("/").get(getAllUsers);
router.get("/current-user", getUserById);
router.route("/:id").put(updateUser).delete(deleteUser);

module.exports = router;
