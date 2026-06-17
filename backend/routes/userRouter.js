// backend/routes/userRouter.js
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
const { upload, uploadSingleToCloudinary } = require("../middleware/multer");

router.route("/").get(getAllUsers).post(createUser);
router.get("/current-user", getUserById);
router.get("/stats", getDashboardStats);
router.post(
  "/upload-profile-picture",
  upload.single("profilePicture"),
  uploadSingleToCloudinary("users"),
  uploadProfilePicture,
);
router.patch("/update-password", updatePassword);
router
  .route("/:id")
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
