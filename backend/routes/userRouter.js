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
const {
  requestEmailChange,
  cancelEmailChange,
} = require("../controllers/emailChangeController");

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
  .get(authMiddleware, roleMiddleware(["admin"]), getUserById)
  .put(authMiddleware, checkSelfOrAdmin, updateUser)
  .delete(authMiddleware, checkSelfOrAdmin, deleteUser);

// Має стояти ДО router.route("/:id")
router.post("/change-email", authMiddleware, requestEmailChange);
router.delete("/change-email", authMiddleware, cancelEmailChange);

router.post("/", authMiddleware, roleMiddleware(["admin"]), createUser);

module.exports = router;
