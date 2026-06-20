const cloudinary = require("cloudinary").v2;

/**
 * Supprime un fichier Cloudinary à partir de son URL publique ou de son public_id.
 * Retourne silencieusement si l'URL est vide ou locale.
 */
async function deleteCloudinaryFile(urlOrPublicId) {
  if (!urlOrPublicId || !urlOrPublicId.startsWith("http")) return;

  try {
    // Extraire le public_id depuis l'URL Cloudinary
    // URL type : https://res.cloudinary.com/<cloud>/image/upload/v123/<folder>/<id>.ext
    const match = urlOrPublicId.match(
      /\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z]{2,4})?$/i,
    );
    if (!match) return;

    const publicId = match[1];
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Помилка видалення з Cloudinary:", err.message);
  }
}

console.log("Перевірка конфігурації Cloudinary:");
if (process.env.CLOUDINARY_CLOUD_NAME === "Untitled") {
  console.error(
    "КРИТИЧНА ПОМИЛКА: Cloudinary Cloud Name досі має значення 'Untitled' у вашому .env файлі!",
  );
  console.error(
    "Оновіть CLOUDINARY_CLOUD_NAME у backend/.env.development, вказавши справжню назву Cloudinary cloud.",
  );
} else {
  // console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
  // console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
  // console.log(
  //   "CLOUDINARY_API_SECRET:",
  //   process.env.CLOUDINARY_API_SECRET ? "PRESENT (MASKED)" : "MISSING",
  // );
  console.log(
    "Конфігурація CLOUDINARY виглядає коректною. Cloudinary готовий до використання.",
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = { cloudinary, deleteCloudinaryFile };
