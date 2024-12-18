const { Adv, Photo } = require("../models/adv");
const { v4: uuidv4 } = require("uuid"); // Pour générer des noms de fichiers uniques
const sharp = require("sharp"); // Pour le redimensionnement et l'optimisation des images
// Middleware amélioré pour la création d'annonce
exports.createAnnonce = async (req, res) => {
  console.log("🚀 ~ exports.createAnnonce= ~ req.body:", req.body);
  console.log("🚀 ~ exports.createAnnonce= ~ req.files:", req.files);
  console.log("🚀 ~ exports.createAnnonce= ~ req.user:", req.user);

  try {
    // Validation des données d'entrée
    const {
      title,
      category,
      country,
      state,
      city,
      postalCode,
      description,
      price,
      author,
      contact,
      email,
      amenities,
      categoryId,
      status,
    } = req.body;

    // Vérification des champs obligatoires
    if (!title || !description || !price) {
      return res.status(400).json({
        error: "Tous les champs obligatoires ne sont pas remplis",
      });
    }
    // Récupérer les chemins des fichiers uploadés
    const photoPaths = req.files ? req.files.map((file) => file.path) : [];
    console.log("🚀 ~ exports.createAnnonce= ~  photoPaths:", photoPaths);

    // Récupération et préparation des données de l'annonce
    const adData = {
      title,
      // author,
      contact,
      email,
      amenities,
      description,
      country,
      state,
      city,
      // postalCode: parseFloat(postalCode),
      price: parseFloat(price),
      categoryId: parseFloat(categoryId),
      category,
      // Autres champs avec validation et transformation
      status,
      photos: photoPaths,
      userId: req.user.userId,
      // datePosted: new Date(),
      // Ajoutez d'autres champs par défaut si nécessaire
    };

    // Création de l'annonce
    const newAd = await Adv.create(adData);

    // Gestion des photos
    // if (req.files && req.files.length > 0) {
    //   const photos = await Promise.all(
    //     req.files.map(async (file) => {
    //       const resizedBuffer = await sharp(file.buffer)
    //         .resize({
    //           width: 1024,
    //           height: 1024,
    //           fit: sharp.fit.inside,
    //           withoutEnlargement: true,
    //         })
    //         // Redimensionner l'image à 800x600 pixels
    //         .toFormat("jpeg")
    //         .jpeg({
    //           quality: 90,
    //         })
    //         .toBuffer();

    //       return {
    //         data: resizedBuffer,
    //         contentType: file.mimetype,
    //         name: file.originalname,
    //         annonceId: newAd.id,
    //         size: file.size,
    //       };
    //     })
    //   );
    //   console.log("🚀 ~ exports.createAnnonce= ~ photos:", photos);

    //   await Photo.bulkCreate(photos)
    //     .then(() => {
    //       console.log("Photos enregistrées avec succès");
    //     })
    //     .catch((error) => {
    //       console.error("Erreur lors de l'enregistrement des photos:", error);
    //       throw error;
    //     });
    // }

    // Réponse avec l'annonce créée
    return res.status(201).json({
      message: "Annonce créée avec succès",
      advert: newAd,
    });
  } catch (error) {
    // Gestion des erreurs détaillée
    console.error("Erreur de création d'annonce:", error);

    // Différencier les types d'erreurs
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Erreur de validation",
        details: error.errors.map((e) => e.message),
      });
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        error: "Un conflit est survenu",
        details: error.errors.map((e) => e.message),
      });
    }

    // Erreur générique
    res.status(500).json({
      error: "Erreur interne du serveur",
      message: error.message,
    });
  }
};
exports.getAllAnnonces = async (req, res) => {
  try {
    const annonces = await Adv.findAll({
      // include: [
      //   {
      //     model: Photo,
      //     as: "photos",
      //   },
      // ],
    });
    res.status(200).json(annonces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAnnonceById = async (req, res) => {
  try {
    const annonce = await Adv.findByPk(req.params.id);
    if (annonce) {
      res.status(200).json(annonce);
    } else {
      res.status(404).json({ message: "Adv non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAnnonce = async (req, res) => {
  try {
    const [updated] = await Adv.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedAnnonce = await Adv.findByPk(req.params.id);
      res.status(200).json(updatedAnnonce);
    } else {
      res.status(404).json({ message: "Adv non trouvée" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteAnnonce = async (req, res) => {
  try {
    const deleted = await Adv.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ msg: "Adv non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
