const express = require("express");
const router = express.Router();
const { fetchExternalNews } = require("../services/externalNewsService");

// GET /api/v1/external-news
router.get("/", async (req, res) => {
  try {
    const items = await fetchExternalNews();
    res.status(200).json(items);
  } catch (error) {
    console.error("Помилка externalNews:", error);
    res.status(500).json({ message: "Не вдалося завантажити новини" });
  }
});

module.exports = router;
