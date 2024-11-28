const { Category, SubCategory } = require("../models/category");

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    // const categories = await Category.findAll({
    //   where: { categoryId: null },
    //   include: [{ model: Category, as: "subCategories" }],
    // });
    const categories = await Category.findAll({ include: SubCategory });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByPk(id, {
      include: SubCategory,
    });
    console.log("🚀 ~ exports.getCategoryById= ~ category:", category);
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: "Catégorie non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const [updated] = await Category.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedCategorie = await Category.findByPk(req.params.id);
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
    const deleted = await Category.destroy({
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
    const { categoryId } = req.params;
    const { name } = req.body;

    const parentCategory = await Category.findByPk(categoryId);

    if (!parentCategory) {
      return res.status(404).json({ message: "Catégorie parente non trouvée" });
    }

    const newCategory = await SubCategory.create({
      name,
      categoryId,
    });

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtenir toutes les sous-catégories d'une catégorie
exports.getSubCategories = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const sousCategories = await SubCategory.findAll({
      where: { categoryId },
    });
    console.log(
      "🚀 ~ exports.getSubCategories= ~ sousCategories:",
      sousCategories
    );
    res.status(200).json(sousCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubCategoryById = async (req, res) => {
  try {
    const { categoryId, id } = req.params;
    const parentCategory = await Category.findByPk(categoryId);
    console.log(
      "🚀 ~ exports.getSubCategoryById= ~  parentCategory :",
      parentCategory
    );

    if (!parentCategory) {
      return res.status(404).json({ message: "Catégorie parente non trouvée" });
    }
    const sousCategories = await SubCategory.findByPk(
      id
      //   {
      //   where: { categoryId },
      // }
    );
    console.log(
      "🚀 ~ exports.getSubCategoryById= ~ sousCategories:",
      sousCategories
    );
    res.status(200).json(sousCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Modifier une sous-catégorie
exports.updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, categoryId } = req.body;

    const sousCategorie = await Category.findByPk(id);
    if (!sousCategorie) {
      return res.status(404).json({ message: "Sous-catégorie non trouvée" });
    }

    if (sousCategorie.categoryId === null) {
      return res
        .status(400)
        .json({ message: "Cette catégorie n'est pas une sous-catégorie" });
    }

    await sousCategorie.update({ name, categoryId });
    res.status(200).json(sousCategorie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer une sous-catégorie
exports.deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const sousCategorie = await Category.findByPk(id);

    if (!sousCategorie) {
      return res.status(404).json({ message: "Sous-catégorie non trouvée" });
    }

    if (sousCategorie.categoryId === null) {
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
//     const { name, slug, categoryId } = req.body;
//     const category = await Category.create({
//       name,
//       slug,
//       categoryId,
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
//       where: { categoryId: null },
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
//     const { name, slug, categoryId } = req.body;

//     const [updated] = await Category.update(
//       { name, slug, categoryId },
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
