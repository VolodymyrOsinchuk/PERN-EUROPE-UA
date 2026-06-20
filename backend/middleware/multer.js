// const multer = require("multer");
// const path = require("path");

// // Configuration de Multer avec stockage en mémoire
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     let uploadPath = "";
//     if (req.baseUrl.includes("adv")) {
//       uploadPath = path.join(__dirname, "..", "public", "uploads", "adv");
//     } else if (req.baseUrl.includes("users")) {
//       uploadPath = path.join(__dirname, "..", "public", "uploads", "users");
//     } else {
//       uploadPath = path.join(__dirname, "..", "public", "uploads", "others");
//     }

//     const fs = require("fs");
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }

//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     cb(null, `ad-${file.originalname}`);
//   },
// });

// // Filtre pour n'accepter que les images
// const imageFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Дозволені лише зображення"), false);
//   }
// };

// // limits: {
// //   fileSize: 10 * 1024 * 1024, // Limite à 10MB par fichier
// //   files: 5 // Maximum 5 fichiers
// // }

// const upload = multer({
//   storage: storage,
//   fileFilter: imageFilter,
//   limits: {
//     fieldSize: 10 * 1024 * 1024,
//   },
// });

// module.exports = upload;
const multer = require("multer");
const streamifier = require("streamifier");
const { cloudinary } = require("../config/cloudinary");

// ── Multer : stockage en mémoire (pas de disque) ─────────────────────────────
const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Дозволені лише зображення"), false);
  }
};

const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});

// ── Helpers d'upload Cloudinary ──────────────────────────────────────────────

/**
 * Upload un buffer en mémoire vers Cloudinary.
 * @param {Buffer} buffer        - Données binaires du fichier
 * @param {string} folder        - Dossier Cloudinary (ex. "advs", "users")
 * @param {object} [options]     - Options supplémentaires passées à l'uploader
 * @returns {Promise<object>}    - Résultat Cloudinary (secure_url, public_id, …)
 */
function uploadBufferToCloudinary(buffer, folder, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

/**
 * Middleware Express : upload tous les fichiers de req.files vers Cloudinary
 * et remplace req.files par un tableau de résultats Cloudinary.
 *
 * @param {string} folder - Dossier Cloudinary cible
 */
function uploadToCloudinary(folder) {
  return async (req, res, next) => {
    if (!req.files || req.files.length === 0) return next();

    try {
      const uploads = await Promise.all(
        req.files.map((file) => uploadBufferToCloudinary(file.buffer, folder)),
      );

      // Injecte les URLs Cloudinary dans req pour les controllers
      req.cloudinaryUrls = uploads.map((r) => r.secure_url);
      req.cloudinaryPublicIds = uploads.map((r) => r.public_id);
      next();
    } catch (err) {
      console.error("Помилка завантаження у Cloudinary:", err.message);
      res.status(500).json({ error: "Помилка завантаження зображень" });
    }
  };
}

/**
 * Middleware Express : upload le fichier unique req.file vers Cloudinary.
 *
 * @param {string} folder - Dossier Cloudinary cible
 */
function uploadSingleToCloudinary(folder) {
  return async (req, res, next) => {
    if (!req.file) {
      console.log("Файл у запиті не знайдено");
      return next();
    }

    try {
      console.log(`Завантаження файлу до папки Cloudinary: ${folder}`);
      const result = await uploadBufferToCloudinary(req.file.buffer, folder);
      console.log("Файл успішно завантажено до Cloudinary:", result.secure_url);
      req.cloudinaryUrl = result.secure_url;
      req.cloudinaryPublicId = result.public_id;
      next();
    } catch (err) {
      console.error("Помилка завантаження у Cloudinary (один файл):", err.message);
      console.error("Повний об'єкт помилки:", err);
      res.status(500).json({
        error: "Помилка завантаження зображення",
        message: err.message,
        details: err.message,
      });
    }
  };
}

module.exports = {
  upload,
  uploadToCloudinary,
  uploadSingleToCloudinary,
  uploadBufferToCloudinary,
};
