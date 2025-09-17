const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getDashboardStats,
  uploadProfilePicture,
  updatePassword,
} = require("../controllers/userController");
const upload = require("../middleware/multer");
const { authMiddleware } = require("../middleware/authMiddleware");

router.route("/").get(getAllUsers).post(createUser);
router.get("/current-user", authMiddleware, getUserById);
router.get("/stats", authMiddleware, getDashboardStats);
router.post("/upload-profile-picture", authMiddleware, upload.single('profilePicture'), uploadProfilePicture);
router.patch("/update-password", authMiddleware, updatePassword);
router.route("/:id").put(authMiddleware, updateUser).delete(authMiddleware, deleteUser);

module.exports = router;
