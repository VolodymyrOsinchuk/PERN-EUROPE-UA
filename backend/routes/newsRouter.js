const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");

router.get("/", newsController.getAllNews);
router.get("/:id", newsController.getNewsById);
router.post("/", authMiddleware, roleMiddleware(["admin"]), newsController.createNews);
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), newsController.updateNews);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), newsController.deleteNews);

module.exports = router;
