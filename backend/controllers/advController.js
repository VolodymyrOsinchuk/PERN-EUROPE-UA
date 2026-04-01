const { Adv } = require("../models/adv");
const { Category, SubCategory } = require("../models/category");
const { User } = require("../models/user");
const sharp = require("sharp"); // Pour le redimensionnement et l'optimisation des images
// Middleware amélioré pour la création d'annonce

// Middleware de validation
const validateFields = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      categoryId,
      subcategoryId,
      country,
      state,
      city,
      location,
      email,
      phone,
    } = req.body;

    // Validation des champs requis
    if (!title || !description || !categoryId || !subcategoryId) {
      return res.status(400).json({
        error: "Tous les champs obligatoires doivent être remplis",
      });
    }

    // Validation du prix
    if (price && (isNaN(price) || price < 0)) {
      return res.status(400).json({
        error: "Le prix doit être un nombre positif",
      });
    }

    // Vérification de l'existence de la catégorie
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({
        error: "Catégorie invalide",
      });
    }

    // Vérification de l'existence de la sous-catégorie
    const subcategory = await SubCategory.findByPk(subcategoryId);
    if (!subcategory || subcategory.categoryId !== parseInt(categoryId)) {
      return res.status(400).json({
        error: "Sous-catégorie invalide ou ne correspond pas à la catégorie",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

exports.createAnnonce = async (req, res) => {
  console.log("🚀 ~ exports.createAnnonce= ~ req.body:", req.body);
  console.log("🚀 ~ exports.createAnnonce= ~ req.files:", req.files);
  console.log("🚀 ~ exports.createAnnonce= ~ req.user:", req.user);

  try {
    // Validation des données d'entrée
    const {
      title,
      description,
      price,
      categoryId,
      subcategoryId,
      country,
      state,
      city,
      location,
      phone,
      email,
      amenities,
    } = req.body;

    // Récupérer les chemins des fichiers uploadés
    const photoPaths = req.files ? req.files.map((file) => file.path) : [];
    console.log("🚀 ~ exports.createAnnonce= ~  photoPaths:", photoPaths);

    // Récupération et préparation des données de l'annonce
    const adData = {
      title,
      description,
      price: parseFloat(price) || null,
      categoryId: parseFloat(categoryId),
      subcategoryId: parseFloat(subcategoryId),
      country,
      state,
      city,
      location,
      phone,
      email,
      amenities,
      photos: photoPaths,
      status: "Active",
      userId: req.user.userId,
      datePosted: new Date(),
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
      views: 0,
      isPromoted: false,
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
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "email"],
        },
      ],
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
    const adv = req.adv; // From checkOwnership middleware
    console.log("🚀 ~ exports.updateAnnonce= ~ adv:", adv);

    const {
      title,
      description,
      price,
      categoryId,
      // subcategoryId,
      country,
      state,
      city,
      location,
      email,
      phone,
      status,
      amenities,
    } = req.body;

    // Mise à jour des champs
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (categoryId) updateData.categoryId = categoryId;
    // if (subcategoryId) updateData.subcategoryId = subcategoryId;
    if (country) updateData.country = country;
    if (state) updateData.state = state;
    if (city) updateData.city = city;
    if (location) updateData.location = location;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (status) updateData.status = status;
    if (amenities) updateData.amenities = amenities;

    // Gestion des nouvelles photos si présentes
    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map((file) => file.path);
      updateData.photos = [...(adv.photos || []), ...newPhotos];
    }

    // Mise à jour de l'annonce
    await adv.update(updateData);

    // Récupérer l'annonce mise à jour avec les relations
    const updatedAdv = await Adv.findByPk(adv.id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
        // {
        //   model: SubCategory,
        //   as: "subcategory",
        //   attributes: ["id", "name"],
        // },
        {
          model: User,
          as: "user",
          attributes: ["id", "email"],
        },
      ],
    });

    res.status(200).json({
      message: "Annonce mise à jour avec succès",
      data: updatedAdv,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
    res.status(500).json({
      error: "Erreur lors de la mise à jour de l'annonce",
      details: error.message,
    });
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

exports.getUserAnnonces = async (req, res) => {
  try {
    const userId = req.user.userId;
    const annonces = await Adv.findAll({
      where: { userId },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
      order: [["datePosted", "DESC"]],
    });
    res.status(200).json(annonces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
