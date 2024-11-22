const Categorie = require("../models/category");

exports.createCategory = async (req, res) => {
  try {
    const categorie = await Categorie.create(req.body);
    res.status(201).json(categorie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Categorie.findAll({
      where: { parentId: null },
      include: [{ model: Categorie, as: "subCategories" }],
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const categorie = await Categorie.findByPk(req.params.id, {
      include: [{ model: Categorie, as: "subCategories" }],
    });
    if (categorie) {
      res.status(200).json(categorie);
    } else {
      res.status(404).json({ message: "Catégorie non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const [updated] = await Categorie.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedCategorie = await Categorie.findByPk(req.params.id);
      res.status(200).json(updatedCategorie);
    } else {
      res.status(404).json({ message: "Catégorie non trouvée" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Categorie.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Catégorie non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ajouter une sous-catégorie
exports.addSubCategory = async (req, res) => {
  try {
    const { parentId } = req.params;
    const { nom } = req.body;

    const parentCategorie = await Categorie.findByPk(parentId);
    if (!parentCategorie) {
      return res.status(404).json({ message: "Catégorie parente non trouvée" });
    }

    const newCategory = await Categorie.create({
      nom,
      parentId,
    });

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtenir toutes les sous-catégories d'une catégorie
exports.getSubCategories = async (req, res) => {
  try {
    const { parentId } = req.params;
    const sousCategories = await Categorie.findAll({
      where: { parentId },
    });
    res.status(200).json(sousCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Modifier une sous-catégorie
exports.updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, parentId } = req.body;

    const sousCategorie = await Categorie.findByPk(id);
    if (!sousCategorie) {
      return res.status(404).json({ message: "Sous-catégorie non trouvée" });
    }

    if (sousCategorie.parentId === null) {
      return res
        .status(400)
        .json({ message: "Cette catégorie n'est pas une sous-catégorie" });
    }

    await sousCategorie.update({ nom, parentId });
    res.status(200).json(sousCategorie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer une sous-catégorie
exports.deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const sousCategorie = await Categorie.findByPk(id);

    if (!sousCategorie) {
      return res.status(404).json({ message: "Sous-catégorie non trouvée" });
    }

    if (sousCategorie.parentId === null) {
      return res
        .status(400)
        .json({ message: "Cette catégorie n'est pas une sous-catégorie" });
    }

    await sousCategorie.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// // controllers/categoryController.js
// const Category = require("../models/category");

// exports.createCategory = async (req, res) => {
//   try {
//     const { name, slug, parentId } = req.body;
//     const category = await Category.create({
//       name,
//       slug,
//       parentId,
//     });
//     res.status(201).json(category);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// exports.getAllCategories = async (req, res) => {
//   try {
//     const categories = await Category.findAll({
//       include: [
//         {
//           model: Category,
//           as: "subcategories",
//           include: [
//             {
//               model: Category,
//               as: "subcategories",
//             },
//           ],
//         },
//       ],
//       where: { parentId: null },
//     });
//     res.json(categories);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getCategoryById = async (req, res) => {
//   try {
//     const category = await Category.findByPk(req.params.id, {
//       include: [
//         {
//           model: Category,
//           as: "subcategories",
//         },
//       ],
//     });
//     if (!category) {
//       return res.status(404).json({ message: "Категорію не знайдено" });
//     }
//     res.json(category);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.updateCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, slug, parentId } = req.body;

//     const [updated] = await Category.update(
//       { name, slug, parentId },
//       { where: { id } }
//     );

//     if (updated) {
//       const updatedCategory = await Category.findByPk(id);
//       return res.json(updatedCategory);
//     }

//     throw new Error("Категорію не знайдено");
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// exports.deleteCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleted = await Category.destroy({ where: { id } });

//     if (deleted) {
//       return res.status(204).send();
//     }

//     throw new Error("Категорію не знайдено");
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };
