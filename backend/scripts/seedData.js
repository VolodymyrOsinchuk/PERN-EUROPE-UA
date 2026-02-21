const bcrypt = require("bcryptjs");
const { User } = require("../models/user");
const { Category, SubCategory } = require("../models/category");
const { Adv } = require("../models/adv");
const { Event } = require("../models/event");
const sequelize = require("../config/db");

async function seedDatabase() {
  try {
    await sequelize.sync({ force: true }); // Be careful, this will drop all tables!

    // Create admin user
    const adminUser = await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      password: "Admin123!",
      phoneNumber: "+33123456789",
      country: "France",
      state: "Île-de-France",
      location: "Paris",
      about: "Administrateur principal du site",
      role: "admin",
      agreeToTerms: true,
      isVerified: true,
    });

    // Create categories
    const categories = await Category.bulkCreate([
      { name: "Immobilier" },
      { name: "Véhicules" },
      { name: "Emploi" },
      { name: "Services" },
      { name: "Mode" },
    ]);

    // Create subcategories
    const subcategories = await SubCategory.bulkCreate([
      { name: "Appartements", categoryId: 1 },
      { name: "Maisons", categoryId: 1 },
      { name: "Voitures", categoryId: 2 },
      { name: "Motos", categoryId: 2 },
      { name: "CDI", categoryId: 3 },
      { name: "CDD", categoryId: 3 },
      { name: "Bricolage", categoryId: 4 },
      { name: "Ménage", categoryId: 4 },
      { name: "Vêtements", categoryId: 5 },
      { name: "Accessoires", categoryId: 5 },
    ]);

    // Create regular users
    const users = await User.bulkCreate([
      {
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean.dupont@example.com",
        password: "Password123!",
        phoneNumber: "+33612345678",
        country: "France",
        state: "Occitanie",
        location: "Toulouse",
        about: "Passionné d'immobilier",
        role: "user",
        agreeToTerms: true,
        isVerified: true,
      },
      {
        firstName: "Marie",
        lastName: "Martin",
        email: "marie.martin@example.com",
        password: "Password123!",
        phoneNumber: "+33687654321",
        country: "France",
        state: "Provence-Alpes-Côte d'Azur",
        location: "Marseille",
        about: "Professionnelle de l'automobile",
        role: "user",
        agreeToTerms: true,
        isVerified: true,
      },
    ]);

    // Create advertisements
    const advertisements = await Adv.bulkCreate([
      {
        title: "Appartement T3 Centre-ville",
        country: "France",
        state: "Île-de-France",
        city: "Paris",
        description: "Bel appartement T3 rénové au centre de Paris",
        email: "jean.dupont@example.com",
        price: 450000.0,
        photos: ["ad-1.jpg", "ad-2.jpg"],
        amenities: ["Parking", "Balcon", "Cave"],
        categoryId: 1,
        userId: 2,
        views: 150,
        isPromoted: true,
      },
      {
        title: "Volkswagen Golf 7 GTI",
        country: "France",
        state: "Occitanie",
        city: "Toulouse",
        description: "Golf 7 GTI en excellent état, première main",
        email: "marie.martin@example.com",
        price: 25000.0,
        photos: ["ad-vw-1.avif", "ad-vw-2.avif"],
        amenities: ["Climatisation", "GPS", "Toit ouvrant"],
        categoryId: 2,
        userId: 3,
        views: 200,
        isPromoted: false,
      },
    ]);

    // Create events
    const events = await Event.bulkCreate([
      {
        title: "Salon de l'immobilier",
        description: "Grand salon de l'immobilier avec plus de 100 exposants",
        date: new Date("2025-11-15"),
        location: "Paris Expo Porte de Versailles",
      },
      {
        title: "Job Dating Tech",
        description: "Rencontrez les entreprises qui recrutent dans la tech",
        date: new Date("2025-12-01"),
        location: "Station F, Paris",
      },
    ]);

    console.log("Base de données peuplée avec succès !");
  } catch (error) {
    console.error("Erreur lors du peuplement de la base de données:", error);
  } finally {
    await sequelize.close();
  }
}

// Exécuter le script
seedDatabase();
