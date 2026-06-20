// backend/routes/userRouter.js
const express = require("express");
const router = express.Router();
const {
  createUser,
  deleteUser,
  getAllUsers,
  getDashboardStats,
  getUserById,
  updatePassword,
  updateUser,
  uploadProfilePicture,
} = require("../controllers/userController");
const { upload, uploadSingleToCloudinary } = require("../middleware/multer");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authMiddleware");
const checkSelfOrAdmin = require("../middleware/checkSelfOrAdmin");

router.get("/", authMiddleware, roleMiddleware(["admin"]), getAllUsers);
router.get("/current-user", authMiddleware, getUserById);
router.get("/stats", authMiddleware, getDashboardStats);
router.post(
  "/upload-profile-picture",
  authMiddleware,
  upload.single("profilePicture"),
  uploadSingleToCloudinary("users"),
  uploadProfilePicture,
);
router.patch("/update-password", authMiddleware, updatePassword);
router
  .route("/:id")
  .put(authMiddleware, checkSelfOrAdmin, updateUser)
  .delete(authMiddleware, checkSelfOrAdmin, deleteUser);

router.post("/", authMiddleware, roleMiddleware(["admin"]), createUser);

module.exports = router;
