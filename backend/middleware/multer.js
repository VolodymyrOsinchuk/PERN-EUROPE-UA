const multer = require("multer");
const path = require("path");

// Configuration de Multer avec stockage en mémoire
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "";
    if (req.baseUrl.includes("adv")) {
      uploadPath = "public/uploads/adv";
    } else if (req.baseUrl.includes("users")) {
      uploadPath = "public/uploads/users";
    } else {
      uploadPath = "public/uploads/others";
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `ad-${file.originalname}`);
  },
});

// Filtre pour n'accepter que les images
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Seules les images sont autorisées"), false);
  }
};

// limits: {
//   fileSize: 10 * 1024 * 1024, // Limite à 10MB par fichier
//   files: 5 // Maximum 5 fichiers
// }

const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fieldSize: 10 * 1024 * 1024,
  },
});

module.exports = upload;
