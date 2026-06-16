const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    console.error("Erreur suppression Cloudinary:", err.message);
  }
}

module.exports = { cloudinary, deleteCloudinaryFile };
