const { User } = require("../models/user");
const { Category, SubCategory } = require("../models/category");
const { Adv } = require("../models/adv");
const { Event } = require("../models/event");
const { News } = require("../models/news");
const { Publication } = require("../models/publication");
const { ForumTopic } = require("../models/forumTopic");
const { ForumReply } = require("../models/forumReply");
const sequelize = require("../config/db");

async function seedDatabase() {
  try {
    console.log("Початок синхронізації бази даних...");
    await sequelize.sync({ force: process.env.NODE_ENV !== "production" });
    console.log("Базу даних синхронізовано.");

    // 1. Create Users
    console.log("Створення користувачів...");
    const adminUser = await User.create({
      firstName: "Admin",
      lastName: "System",
      email: "admin@ukraine-europe.eu",
      password: "AdminPassword123!",
      phoneNumber: "+33100000000",
      country: "France",
      state: "Île-de-France",
      location: "Paris",
      about: "Administrateur de la plateforme Ukrainians in Europe.",
      role: "admin",
      agreeToTerms: true,
      isVerified: true,
    });

    const users = await User.bulkCreate(
      [
        {
          firstName: "Olena",
          lastName: "Shevchenko",
          email: "olena.s@example.com",
          password: "UserPassword123!",
          phoneNumber: "+48600111222",
          country: "Poland",
          state: "Mazovian",
          location: "Warsaw",
          about: "Bénévole et traductrice, j'aide les nouveaux arrivants.",
          role: "moderator",
          agreeToTerms: true,
          isVerified: true,
        },
        {
          firstName: "Andriy",
          lastName: "Kovalenko",
          email: "andriy.k@example.com",
          password: "UserPassword123!",
          phoneNumber: "+491701234567",
          country: "Germany",
          state: "Berlin",
          location: "Berlin",
          about: "Développeur software à la recherche de collaborations.",
          role: "user",
          agreeToTerms: true,
          isVerified: true,
        },
        {
          firstName: "Svitlana",
          lastName: "Petrenko",
          email: "svitlana.p@example.com",
          password: "UserPassword123!",
          phoneNumber: "+33655443322",
          country: "France",
          state: "Provence-Alpes-Côte d'Azur",
          location: "Nice",
          about: "Professeure de français et d'ukrainien.",
          role: "user",
          agreeToTerms: true,
          isVerified: true,
        },
        {
          firstName: "Dmytro",
          lastName: "Ivanov",
          email: "dmytro.i@example.com",
          password: "UserPassword123!",
          phoneNumber: "+420777111222",
          country: "Czech Republic",
          state: "Prague",
          location: "Prague",
          about: "Entrepreneur dans le domaine de la logistique.",
          role: "user",
          agreeToTerms: true,
          isVerified: true,
        },
      ],
      { individualHooks: true },
    );
    console.log("Користувачів створено.");

    // 2. Create Categories & Subcategories
    console.log("Створення категорій і підкатегорій...");
    const catData = [
      {
        name: "Immobilier",
        subs: ["Location", "Colocation", "Achat", "Hébergement d'urgence"],
      },
      {
        name: "Emploi",
        subs: ["Offres d'emploi", "Demandes d'emploi", "Stages", "Bénévolat"],
      },
      {
        name: "Services",
        subs: ["Traduction", "Aide juridique", "Santé", "Cours de langue"],
      },
      {
        name: "Véhicules",
        subs: ["Voitures", "Covoiturage", "Vélos & Trottinettes"],
      },
      {
        name: "Communauté",
        subs: ["Échanges culturels", "Rencontres", "Aide humanitaire"],
      },
    ];

    const categoryMap = {};
    const subcategoryMap = {};

    for (const item of catData) {
      const category = await Category.create({ name: item.name });
      categoryMap[item.name] = category.id;
      for (const subName of item.subs) {
        const sub = await SubCategory.create({
          name: subName,
          categoryId: category.id,
        });
        subcategoryMap[subName] = sub.id;
      }
    }
    console.log("Категорії створено.");

    // 3. Create Advertisements
    console.log("Створення оголошень...");
    await Adv.bulkCreate([
      {
        title: "Appartement calme à Varsovie",
        country: "Poland",
        state: "Mazovian",
        city: "Warsaw",
        description: "2 pièces, 45m2, proche des transports et des commerces.",
        email: "olena.s@example.com",
        price: 3000.0,
        photos: ["ad-1.jpg"],
        amenities: ["Meublé", "Wifi", "Lave-linge"],
        categoryId: categoryMap["Immobilier"],
        subcategoryId: subcategoryMap["Location"],
        userId: 2,
        views: 45,
        isPromoted: true,
      },
      {
        title: "Recherche développeur React (Remote/Berlin)",
        country: "Germany",
        state: "Berlin",
        city: "Berlin",
        description:
          "Startup tech recherche un développeur React. Langues: Anglais ou Allemand.",
        email: "andriy.k@example.com",
        price: 0.0,
        photos: [],
        amenities: ["Remote possible", "Horaires flexibles"],
        categoryId: categoryMap["Emploi"],
        subcategoryId: subcategoryMap["Offres d'emploi"],
        userId: 3,
        views: 120,
        isPromoted: false,
      },
      {
        title: "Cours de français pour ukrainiens",
        country: "France",
        state: "Provence-Alpes-Côte d'Azur",
        city: "Nice",
        description:
          "Cours de français tous niveaux. Possibilité de cours en ligne ou en présentiel.",
        email: "svitlana.p@example.com",
        price: 20.0,
        photos: ["ad-avatar-2.jpeg"],
        amenities: ["Support pédagogique inclus"],
        categoryId: categoryMap["Services"],
        subcategoryId: subcategoryMap["Cours de langue"],
        userId: 4,
        views: 85,
        isPromoted: true,
      },
      {
        title: "Transport de colis Varsovie - Prague",
        country: "Czech Republic",
        state: "Prague",
        city: "Prague",
        description:
          "Je fais le trajet tous les lundis. Possibilité de transporter de petits colis.",
        email: "dmytro.i@example.com",
        price: 15.0,
        photos: [],
        amenities: ["Ponctuel", "Sûr"],
        categoryId: categoryMap["Véhicules"],
        subcategoryId: subcategoryMap["Covoiturage"],
        userId: 5,
        views: 30,
        isPromoted: false,
      },
      {
        title: "Don de vêtements pour enfants",
        country: "France",
        state: "Île-de-France",
        city: "Paris",
        description:
          "Donne plusieurs sacs de vêtements pour enfants de 2 à 6 ans.",
        email: "admin@ukraine-europe.eu",
        price: 0.0,
        photos: ["ads-1.jpeg"],
        amenities: ["Gratuit"],
        categoryId: categoryMap["Communauté"],
        subcategoryId: subcategoryMap["Aide humanitaire"],
        userId: 1,
        views: 210,
        isPromoted: false,
      },
    ]);
    console.log("Оголошення створено.");

    // 4. Create Events
    console.log("Створення подій...");
    await Event.bulkCreate([
      {
        title: "Rencontre communautaire - Paris",
        description:
          "Une après-midi pour faire connaissance et échanger des conseils.",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        location: "Centre culturel, Paris",
        userId: 1,
      },
      {
        title: "Webinaire : Travailler en Allemagne",
        description:
          "Tout ce qu'il faut savoir sur le marché du travail allemand.",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        location: "En ligne (Zoom)",
        userId: 3,
      },
      {
        title: "Atelier CV et lettre de motivation",
        description: "Apprenez à adapter votre CV aux standards européens.",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        location: "Médiathèque de Varsovie",
        userId: 2,
      },
    ]);
    console.log("Події створено.");

    // 5. Create News
    console.log("Створення новин...");
    await News.bulkCreate([
      {
        title: "Nouvelles régulations pour le statut de protection temporaire",
        content:
          "L'Union Européenne prolonge la protection temporaire jusqu'en mars 2026. Voici les détails des changements...",
        category: "Légal",
        importance: "high",
        date: new Date(),
      },
      {
        title: "Ouverture d'un nouveau centre d'aide à Berlin",
        content:
          "Un nouveau point d'accueil vient d'ouvrir ses portes pour aider à l'enregistrement et au logement.",
        category: "Aide",
        importance: "medium",
        date: new Date(),
      },
      {
        title: "Succès du festival de la culture ukrainienne à Lyon",
        content:
          "Plus de 5000 personnes ont participé au festival ce week-end.",
        category: "Culture",
        importance: "low",
        date: new Date(),
      },
    ]);
    console.log("Новини створено.");

    // 6. Create Publications
    console.log("Створення публікацій...");
    await Publication.bulkCreate([
      {
        title: "Guide complet : S'installer en France",
        content:
          "De l'ouverture d'un compte bancaire à l'inscription à la sécurité sociale, suivez notre guide étape par étape.",
        category: "Guide",
        author: "Olena Shevchenko",
        readTime: "15 min",
        date: new Date(),
        userId: 2,
      },
      {
        title: "Comment apprendre l'allemand rapidement ?",
        content:
          "Les meilleures ressources gratuites et payantes pour progresser efficacement.",
        category: "Éducation",
        author: "Andriy Kovalenko",
        readTime: "10 min",
        date: new Date(),
        userId: 3,
      },
    ]);
    console.log("Публікації створено.");

    // 7. Create Forum Topics & Replies
    console.log("Створення даних форуму...");
    const topic1 = await ForumTopic.create({
      title: "Comment trouver un logement à Prague ?",
      content:
        "Je cherche des conseils sur les meilleurs quartiers et les sites web les plus fiables pour louer un appartement à Prague.",
      category: "Logement",
      author: "Svitlana Petrenko",
      views: 156,
      replies: 2,
    });

    await ForumReply.bulkCreate([
      {
        topicId: topic1.id,
        content:
          "Je te conseille de regarder sur Sreality.cz, c'est la référence ici. Évite le centre-ville qui est très cher.",
        author: "Dmytro Ivanov",
      },
      {
        topicId: topic1.id,
        content:
          "Prague 7 et Prague 10 sont très sympas et un peu plus abordables.",
        author: "Admin System",
      },
    ]);

    const topic2 = await ForumTopic.create({
      title: "Équivalence des diplômes médicaux en France",
      content:
        "Bonjour, je suis médecin en Ukraine et je voudrais savoir quelles sont les étapes pour exercer en France.",
      category: "Travail",
      author: "Olena Shevchenko",
      views: 342,
      replies: 1,
    });

    await ForumReply.create({
      topicId: topic2.id,
      content:
        "C'est un processus assez long appelé Padhue. Il faut passer des épreuves de vérification des connaissances.",
      author: "Admin System",
    });

    console.log("Дані форуму створено.");

    console.log("Базу даних успішно ініціалізовано!");
  } catch (error) {
    console.error("Помилка заповнення бази даних:", error);
  } finally {
    await sequelize.close();
  }
}

seedDatabase();
