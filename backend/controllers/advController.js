const { Adv } = require("../models/adv");
const { Category, SubCategory } = require("../models/category");
const { User } = require("../models/user");
const { deleteCloudinaryFile } = require("../config/cloudinary");

exports.createAnnonce = async (req, res) => {
  try {
    const {
      amenities,
      categoryId,
      city,
      country,
      description,
      email,
      location,
      phone,
      price,
      state,
      subcategoryId,
      title,
    } = req.body;

    // req.cloudinaryUrls est injecté par le middleware uploadToCloudinary()
    const photoPaths = req.cloudinaryUrls || [];

    const newAd = await Adv.create({
      title,
      description,
      price: price ? parseFloat(price) : null,
      categoryId: parseInt(categoryId),
      subcategoryId: subcategoryId ? parseInt(subcategoryId) : null,
      country,
      state,
      city,
      location: location || null,
      phone: phone || null,
      email,
      amenities: amenities || [],
      photos: photoPaths,
      status: "Active",
      userId: req.user.userId,
      datePosted: new Date(),
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      views: 0,
      isPromoted: false,
    });

    return res.status(201).json({
      message: "Оголошення успішно створено",
      advert: newAd,
    });
  } catch (error) {
    console.error("Помилка createAnnonce:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Помилка валідації",
        details: error.errors.map((e) => e.message),
      });
    }
    res
      .status(500)
      .json({ error: "Внутрішня помилка сервера", message: error.message });
  }
};

exports.getAllAnnonces = async (req, res) => {
  try {
    const annonces = await Adv.findAll({
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: User, as: "user", attributes: ["id", "email"] },
      ],
      order: [["datePosted", "DESC"]],
    });
    res.status(200).json(annonces);
  } catch (error) {
    console.error("Помилка getAllAnnonces:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAnnonceById = async (req, res) => {
  try {
    const annonce = await Adv.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email", "phoneNumber"],
        },
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: SubCategory, as: "subcategory", attributes: ["id", "name"] },
      ],
    });

    if (!annonce) {
      return res.status(404).json({ message: "Оголошення не знайдено" });
    }

    await annonce.increment("views");
    res.status(200).json(annonce);
  } catch (error) {
    console.error("Помилка getAnnonceById:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateAnnonce = async (req, res) => {
  try {
    const adv = req.adv; // injecté par checkOwnership

    const {
      title,
      description,
      price,
      categoryId,
      country,
      state,
      city,
      location,
      email,
      phone,
      status,
      amenities,
    } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined && price !== "")
      updateData.price = parseFloat(price);
    if (categoryId !== undefined) updateData.categoryId = parseInt(categoryId);
    if (country !== undefined) updateData.country = country;
    if (state !== undefined) updateData.state = state;
    if (city !== undefined) updateData.city = city;
    if (location !== undefined) updateData.location = location;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone || null;
    if (status !== undefined) updateData.status = status;
    if (amenities !== undefined) updateData.amenities = amenities;

    // Nouvelles photos uploadées via Cloudinary
    if (req.cloudinaryUrls && req.cloudinaryUrls.length > 0) {
      updateData.photos = [...(adv.photos || []), ...req.cloudinaryUrls];
    }

    // Photos existantes à conserver (envoyées depuis le frontend en JSON)
    if (req.body.existingPhotos) {
      try {
        const kept = JSON.parse(req.body.existingPhotos);
        // Supprimer de Cloudinary les photos retirées par l'utilisateur
        const removed = (adv.photos || []).filter((p) => !kept.includes(p));
        await Promise.all(removed.map((url) => deleteCloudinaryFile(url)));
        // Fusionner les photos conservées avec les nouvelles
        updateData.photos = [...kept, ...(req.cloudinaryUrls || [])];
      } catch (_) {
        // Si le parsing échoue, on garde juste les nouvelles
      }
    }

    await adv.update(updateData);

    const updatedAdv = await Adv.findByPk(adv.id, {
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: User, as: "user", attributes: ["id", "email"] },
      ],
    });

    res.status(200).json({
      message: "Оголошення успішно оновлено",
      data: updatedAdv,
    });
  } catch (error) {
    console.error("Помилка updateAnnonce:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Помилка валідації",
        details: error.errors.map((e) => e.message),
      });
    }
    res
      .status(500)
      .json({ error: "Помилка оновлення", details: error.message });
  }
};

// exports.deleteAnnonce = async (req, res) => {
//   try {
//     const adv = await Adv.findByPk(req.params.id);
//     if (!adv) {
//       return res.status(404).json({ message: "Оголошення не знайдено" });
//     }

//     // Supprimer les photos Cloudinary avant de détruire la ligne DB
//     if (adv.photos?.length) {
//       await Promise.all(adv.photos.map((url) => deleteCloudinaryFile(url)));
//     }

//     await adv.destroy();
//     res.status(204).send();
//   } catch (error) {
//     console.error("Помилка deleteAnnonce:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

exports.deleteAnnonce = async (req, res) => {
  try {
    // req.adv est injecté par checkOwnership — garantit que adv.userId === req.user.userId
    const adv = req.adv;

    if (adv.photos?.length) {
      await Promise.all(adv.photos.map((url) => deleteCloudinaryFile(url)));
    }

    await adv.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Помилка deleteAnnonce:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUserAnnonces = async (req, res) => {
  try {
    const userId = req.user.userId;
    const annonces = await Adv.findAll({
      where: { userId },
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
      ],
      order: [["datePosted", "DESC"]],
    });
    res.status(200).json(annonces);
  } catch (error) {
    console.error("Помилка getUserAnnonces:", error);
    res.status(500).json({ error: error.message });
  }
};
