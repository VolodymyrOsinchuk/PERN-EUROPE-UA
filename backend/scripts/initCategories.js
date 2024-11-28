// const Categorie = require("../models/category");
// const sequelize = require("../config/db");

// async function initCategories() {
//   await sequelize.sync({ force: true }); // Attention : ceci effacera toutes les données existantes

//   const categories = [
//     { name: "Immobilier", subCategories: ["Vente", "Achat", "Location"] },
//     { name: "Travail", subCategories: ["Je cherche", "Je propose"] },
//     { name: "Véhicules", subCategories: ["Voitures", "Motos", "Vélos"] },
//     {
//       name: "Maison",
//       subCategories: ["Meubles", "Électroménager", "Décoration"],
//     },
//     {
//       name: "Multimédia",
//       subCategories: ["Informatique", "Téléphonie", "Jeux vidéo"],
//     },
//   ];

//   for (const cat of categories) {
//     const mainCat = await Categorie.create({ name: cat.name });
//     for (const subCat of cat.subCategories) {
//       await Categorie.create({ name: subCat, parentId: mainCat.id });
//     }
//   }

//   console.log("Catégories initialisées avec succès");
// }

// initCategories().catch(console.error);
