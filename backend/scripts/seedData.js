/**
 * scripts/seedData.js
 *
 * Seed idempotent pour une base PostgreSQL PARTAGÉE (dev + production).
 *
 *  - Données de référence (toujours) : catégories, sous-catégories, catégories de forum.
 *  - Contenu de démonstration (optionnel) : utilisateurs, annonces, événements,
 *    news, publications, forum. Activé UNIQUEMENT avec SEED_DEMO_CONTENT=true.
 *  - Jamais de sequelize.sync() : le schéma est géré par `npm run migrate`.
 *  - Aucune suppression, aucune mise à jour : insertions conditionnelles seulement.
 *
 * Variables d'environnement :
 *   CONFIRM_SEED_DB=<nom de la base>   OBLIGATOIRE (ex. defaultdb)
 *   SEED_DEMO_CONTENT=true             optionnel
 *   SEED_ADMIN_PASSWORD, SEED_DEMO_PASSWORD   requis seulement si SEED_DEMO_CONTENT=true
 *   ALLOW_PRODUCTION_SEED=true         requis si NODE_ENV=production
 *
 * Lancement :
 *   npm run migrate
 *   CONFIRM_SEED_DB=defaultdb npm run seed
 */

const sequelize = require("../config/db");
const { User } = require("../models/user");
const { Category, SubCategory } = require("../models/category");
const { Adv } = require("../models/adv");
const { Event } = require("../models/event");
const { News } = require("../models/news");
const { Publication } = require("../models/publication");
const { ForumTopic } = require("../models/forumTopic");
const { ForumReply } = require("../models/forumReply");
const { ForumCategory } = require("../models/forumCategory");

const DAY = 24 * 60 * 60 * 1000;

// ---------------------------------------------------------------------------
// Utilitaires
// ---------------------------------------------------------------------------

async function createIfMissing(model, where, values) {
  const existing = await model.findOne({ where });
  if (existing) return existing;
  return model.create(values);
}

async function findOrCreateOne(model, where, defaults) {
  const [row] = await model.findOrCreate({ where, defaults });
  return row;
}

/** Vérifie que les modèles sont bien exportés. */
function checkModelsLoaded() {
  const models = {
    User,
    Category,
    SubCategory,
    Adv,
    Event,
    News,
    Publication,
    ForumTopic,
    ForumReply,
    ForumCategory,
  };
  const broken = Object.entries(models)
    .filter(([, m]) => !m || typeof m.findOne !== "function")
    .map(([name]) => name);
  if (broken.length) {
    throw new Error(
      `Modèles non exportés correctement (module.exports = { Nom }) : ${broken.join(", ")}`,
    );
  }
  return models;
}

/** Vérifie (lecture seule) que les tables et colonnes existent dans la base. */
async function checkSchema(models) {
  const qi = sequelize.getQueryInterface();
  const problems = [];

  for (const [name, model] of Object.entries(models)) {
    const tableName = model.getTableName();
    let columns;
    try {
      columns = await qi.describeTable(tableName);
    } catch {
      problems.push(
        `Table absente pour ${name} (${JSON.stringify(tableName)})`,
      );
      continue;
    }
    const missing = Object.values(model.rawAttributes)
      .map((attr) => attr.field)
      .filter((field) => !(field in columns));
    if (missing.length) {
      problems.push(
        `${name} : colonnes manquantes en base → ${missing.join(", ")}`,
      );
    }
  }

  if (problems.length) {
    throw new Error(
      "Schéma de la base incompatible avec les modèles :\n  - " +
        problems.join("\n  - ") +
        "\nLancez d'abord `npm run migrate` (ou ajoutez la migration manquante).",
    );
  }
}

// ---------------------------------------------------------------------------
// Données de référence (toujours semées)
// ---------------------------------------------------------------------------

async function seedReferenceData() {
  console.log("Création des catégories et sous-catégories...");
  const catData = [
    {
      name: "Нерухомість",
      subs: ["Оренда", "Спільна оренда", "Купівля", "Екстрене житло"],
    },
    {
      name: "Робота",
      subs: ["Вакансії", "Пошук роботи", "Стажування", "Волонтерство"],
    },
    {
      name: "Послуги",
      subs: ["Переклад", "Юридична допомога", "Здоров'я", "Мовні курси"],
    },
    {
      name: "Транспортні засоби",
      subs: ["Автомобілі", "Спільні поїздки", "Велосипеди та самокати"],
    },
    {
      name: "Спільнота",
      subs: ["Культурний обмін", "Зустрічі", "Гуманітарна допомога"],
    },
  ];

  const categoryMap = {};
  const subcategoryMap = {};

  for (const item of catData) {
    const category = await findOrCreateOne(
      Category,
      { name: item.name },
      { name: item.name },
    );
    categoryMap[item.name] = category.id;

    for (const subName of item.subs) {
      const sub = await findOrCreateOne(
        SubCategory,
        { name: subName, categoryId: category.id },
        { name: subName, categoryId: category.id },
      );
      subcategoryMap[subName] = sub.id;
    }
  }

  console.log("Création des catégories du forum...");
  const forumCatData = [
    { title: "Житло", description: "Питання щодо житла" },
    {
      title: "Робота",
      description: "Питання щодо роботи та працевлаштування",
    },
    {
      title: "Адміністративні формальності",
      description: "Питання щодо адміністративних процедур",
    },
  ];
  const forumCategoryMap = {};
  for (const fc of forumCatData) {
    const row = await findOrCreateOne(
      ForumCategory,
      { title: fc.title },
      { ...fc, isActive: true },
    );
    forumCategoryMap[fc.title] = row.id;
  }

  console.log("Données de référence prêtes.");
  return { categoryMap, subcategoryMap, forumCategoryMap };
}

// ---------------------------------------------------------------------------
// Contenu de démonstration (optionnel)
// ---------------------------------------------------------------------------

async function seedDemoContent({
  categoryMap,
  subcategoryMap,
  forumCategoryMap,
  adminPassword,
  demoPassword,
}) {
  // 1. Utilisateurs
  console.log("Création des utilisateurs de démonstration...");
  const adminUser = await findOrCreateOne(
    User,
    { email: "admin@ukraine-europe.eu" },
    {
      firstName: "Адміністратор",
      lastName: "Системи",
      email: "admin@ukraine-europe.eu",
      password: adminPassword,
      phoneNumber: "+33100000000",
      country: "Франція",
      state: "Іль-де-Франс",
      city: "Париж",
      location: "Париж",
      about: "Адміністратор платформи «Українці в Європі».",
      role: "admin",
      agreeToTerms: true,
      isVerified: true,
    },
  );

  const seedUsers = [
    {
      firstName: "Олена",
      lastName: "Шевченко",
      email: "olena.s@example.com",
      phoneNumber: "+48600111222",
      country: "Польща",
      state: "Мазовецьке воєводство",
      city: "Варшава",
      location: "Варшава",
      about: "Волонтерка та перекладачка, допомагаю новоприбулим.",
      role: "moderator",
    },
    {
      firstName: "Андрій",
      lastName: "Коваленко",
      email: "andriy.k@example.com",
      phoneNumber: "+491701234567",
      country: "Німеччина",
      state: "Берлін",
      city: "Берлін",
      location: "Берлін",
      about: "Розробник програмного забезпечення, який шукає співпрацю.",
      role: "user",
    },
    {
      firstName: "Світлана",
      lastName: "Петренко",
      email: "svitlana.p@example.com",
      phoneNumber: "+33655443322",
      country: "Франція",
      state: "Прованс-Альпи-Лазурний берег",
      city: "Ніцца",
      location: "Ніцца",
      about: "Викладачка французької та української мов.",
      role: "user",
    },
    {
      firstName: "Дмитро",
      lastName: "Іванов",
      email: "dmytro.i@example.com",
      phoneNumber: "+420777111222",
      country: "Чехія",
      state: "Прага",
      city: "Прага",
      location: "Прага",
      about: "Підприємець у сфері логістики.",
      role: "user",
    },
  ];

  const userMap = { "admin@ukraine-europe.eu": adminUser.id };
  for (const seedUser of seedUsers) {
    const user = await findOrCreateOne(
      User,
      { email: seedUser.email },
      {
        ...seedUser,
        password: demoPassword,
        agreeToTerms: true,
        isVerified: true,
      },
    );
    userMap[user.email] = user.id;
  }

  // 2. Annonces
  console.log("Création des annonces...");
  const advData = [
    {
      title: "Тиха квартира у Варшаві",
      country: "Польща",
      state: "Мазовецьке воєводство",
      city: "Варшава",
      description: "2 кімнати, 45 м², поруч із транспортом та магазинами.",
      email: "olena.s@example.com",
      price: 3000.0,
      photos: ["ad-1.jpg"],
      amenities: ["Мебльована", "Wi-Fi", "Пральна машина"],
      categoryId: categoryMap["Нерухомість"],
      subcategoryId: subcategoryMap["Оренда"],
      userId: userMap["olena.s@example.com"],
      views: 45,
      isPromoted: true,
    },
    {
      title: "Пошук React-розробника (віддалено/Берлін)",
      country: "Німеччина",
      state: "Берлін",
      city: "Берлін",
      description:
        "Технологічний стартап шукає React-розробника. Мови: англійська або німецька.",
      email: "andriy.k@example.com",
      price: 0.0,
      photos: [],
      amenities: ["Можлива віддалена робота", "Гнучкий графік"],
      categoryId: categoryMap["Робота"],
      subcategoryId: subcategoryMap["Вакансії"],
      userId: userMap["andriy.k@example.com"],
      views: 120,
      isPromoted: false,
    },
    {
      title: "Курси французької мови для українців",
      country: "Франція",
      state: "Прованс-Альпи-Лазурний берег",
      city: "Ніцца",
      description:
        "Курси французької мови для всіх рівнів. Можливі онлайн-заняття або заняття в аудиторії.",
      email: "svitlana.p@example.com",
      price: 20.0,
      photos: ["ad-avatar-2.jpeg"],
      amenities: ["Навчальні матеріали включено"],
      categoryId: categoryMap["Послуги"],
      subcategoryId: subcategoryMap["Мовні курси"],
      userId: userMap["svitlana.p@example.com"],
      views: 85,
      isPromoted: true,
    },
    {
      title: "Перевезення посилок Варшава - Прага",
      country: "Чехія",
      state: "Прага",
      city: "Прага",
      description:
        "Я здійснюю поїздку щопонеділка. Є можливість перевезення невеликих посилок.",
      email: "dmytro.i@example.com",
      price: 15.0,
      photos: [],
      amenities: ["Пунктуально", "Безпечно"],
      categoryId: categoryMap["Транспортні засоби"],
      subcategoryId: subcategoryMap["Спільні поїздки"],
      userId: userMap["dmytro.i@example.com"],
      views: 30,
      isPromoted: false,
    },
    {
      title: "Пожертва дитячого одягу",
      country: "Франція",
      state: "Іль-де-Франс",
      city: "Париж",
      description:
        "Віддам кілька пакетів одягу для дітей віком від 2 до 6 років.",
      email: "admin@ukraine-europe.eu",
      price: 0.0,
      photos: ["ads-1.jpeg"],
      amenities: ["Безкоштовно"],
      categoryId: categoryMap["Спільнота"],
      subcategoryId: subcategoryMap["Гуманітарна допомога"],
      userId: userMap["admin@ukraine-europe.eu"],
      views: 210,
      isPromoted: false,
    },
  ];
  for (const adv of advData) {
    await createIfMissing(Adv, { title: adv.title, userId: adv.userId }, adv);
  }

  // 3. Événements
  console.log("Création des événements...");
  const eventData = [
    {
      title: "Зустріч спільноти - Париж",
      description: "Півдня для знайомства, спілкування та обміну порадами.",
      date: new Date(Date.now() + 7 * DAY),
      location: "Культурний центр, Париж",
      type: "rencontre",
      authorName: "Адміністратор Системи",
      authorEmail: "admin@ukraine-europe.eu",
      userId: userMap["admin@ukraine-europe.eu"],
    },
    {
      title: "Вебінар: Робота в Німеччині",
      description: "Усе, що потрібно знати про німецький ринок праці.",
      date: new Date(Date.now() + 14 * DAY),
      location: "Онлайн (Zoom)",
      type: "webinar",
      authorName: "Андрій Коваленко",
      authorEmail: "andriy.k@example.com",
      userId: userMap["andriy.k@example.com"],
    },
    {
      title: "Майстер-клас: резюме та мотиваційний лист",
      description:
        "Навчіться адаптувати своє резюме до європейських стандартів.",
      date: new Date(Date.now() + 3 * DAY),
      location: "Медіатека Варшави",
      type: "atelier",
      authorName: "Олена Шевченко",
      authorEmail: "olena.s@example.com",
      userId: userMap["olena.s@example.com"],
    },
  ];
  for (const event of eventData) {
    await createIfMissing(Event, { title: event.title }, event);
  }

  // 4. Actualités
  console.log("Création des news...");
  const newsData = [
    {
      title: "Нові правила щодо статусу тимчасового захисту",
      content:
        "Європейський Союз продовжує тимчасовий захист до березня 2026 року. Ось деталі змін...",
      category: "Юридичні питання",
      importance: "high",
      date: new Date(),
    },
    {
      title: "Відкриття нового центру допомоги в Берліні",
      content:
        "Новий пункт прийому щойно відкрився для допомоги з реєстрацією та житлом.",
      category: "Допомога",
      importance: "medium",
      date: new Date(),
    },
    {
      title: "Успіх фестивалю української культури в Ліоні",
      content: "Цими вихідними у фестивалі взяли участь понад 5000 людей.",
      category: "Культура",
      importance: "low",
      date: new Date(),
    },
  ];
  for (const news of newsData) {
    await createIfMissing(News, { title: news.title }, news);
  }

  // 5. Publications
  console.log("Création des publications...");
  const publicationData = [
    {
      title: "Повний посібник: переїзд до Франції",
      content:
        "Від відкриття банківського рахунку до реєстрації в системі соціального страхування — дотримуйтесь нашого покрокового посібника.",
      category: "Посібник",
      author: "Олена Шевченко",
      readTime: "15 хв",
      date: new Date(),
      userId: userMap["olena.s@example.com"],
    },
    {
      title: "Як швидко вивчити німецьку мову?",
      content:
        "Найкращі безкоштовні та платні ресурси для ефективного покращення знань.",
      category: "Освіта",
      author: "Андрій Коваленко",
      readTime: "10 хв",
      date: new Date(),
      userId: userMap["andriy.k@example.com"],
    },
  ];
  for (const publication of publicationData) {
    await createIfMissing(
      Publication,
      { title: publication.title },
      publication,
    );
  }

  // 6. Forum
  console.log("Création des données du forum...");
  const topic1 = await createIfMissing(
    ForumTopic,
    { title: "Як знайти житло в Празі?" },
    {
      title: "Як знайти житло в Празі?",
      content:
        "Шукаю поради щодо найкращих районів та найнадійніших сайтів для оренди квартири в Празі.",
      category: "Житло",
      forumCategoryId: forumCategoryMap["Житло"],
      author: "Світлана Петренко",
      userId: userMap["svitlana.p@example.com"],
      views: 156,
      replies: 2,
    },
  );

  const topic1Replies = [
    {
      topicId: topic1.id,
      content:
        "Раджу подивитися на Sreality.cz, це головний ресурс тут. Уникай центру міста, оскільки там дуже дорого.",
      author: "Дмитро Іванов",
      userId: userMap["dmytro.i@example.com"],
    },
    {
      topicId: topic1.id,
      content: "Прага 7 та Прага 10 дуже приємні й трохи доступніші за ціною.",
      author: "Адміністратор Системи",
      userId: userMap["admin@ukraine-europe.eu"],
    },
  ];
  for (const reply of topic1Replies) {
    await createIfMissing(
      ForumReply,
      { topicId: reply.topicId, author: reply.author },
      reply,
    );
  }

  const topic2 = await createIfMissing(
    ForumTopic,
    { title: "Визнання медичних дипломів у Франції" },
    {
      title: "Визнання медичних дипломів у Франції",
      content:
        "Добрий день, я лікар в Україні й хотів би дізнатися, які етапи необхідно пройти, щоб працювати у Франції.",
      category: "Робота",
      forumCategoryId: forumCategoryMap["Робота"],
      author: "Олена Шевченко",
      userId: userMap["olena.s@example.com"],
      views: 342,
      replies: 1,
    },
  );

  await createIfMissing(
    ForumReply,
    { topicId: topic2.id, author: "Адміністратор Системи" },
    {
      topicId: topic2.id,
      content:
        "Це досить тривалий процес, який називається Padhue. Необхідно скласти іспити для перевірки знань.",
      author: "Адміністратор Системи",
      userId: userMap["admin@ukraine-europe.eu"],
    },
  );

  console.log("Contenu de démonstration créé.");
}

// ---------------------------------------------------------------------------
// Point d'entrée
// ---------------------------------------------------------------------------

async function seedDatabase() {
  try {
    // --- Gardes de sécurité (aucune écriture avant qu'elles passent) -------
    const isProduction = process.env.NODE_ENV === "production";
    if (isProduction && process.env.ALLOW_PRODUCTION_SEED !== "true") {
      throw new Error(
        "En production, le seed exige ALLOW_PRODUCTION_SEED=true.",
      );
    }

    const { host, database } = sequelize.config;
    console.log(`Cible du seed : ${host}/${database}`);
    if (process.env.CONFIRM_SEED_DB !== database) {
      throw new Error(
        `Seed refusé. Confirmez la base cible avec CONFIRM_SEED_DB=${database}`,
      );
    }

    const withDemo = process.env.SEED_DEMO_CONTENT === "true";
    const adminPassword = process.env.SEED_ADMIN_PASSWORD;
    const demoPassword = process.env.SEED_DEMO_PASSWORD;
    if (withDemo && (!adminPassword || !demoPassword)) {
      throw new Error(
        "SEED_DEMO_CONTENT=true exige SEED_ADMIN_PASSWORD et SEED_DEMO_PASSWORD.",
      );
    }

    // --- Vérifications en lecture seule ------------------------------------
    const models = checkModelsLoaded();
    await sequelize.authenticate();
    console.log("Connexion à la base OK.");
    await checkSchema(models);
    console.log("Schéma compatible avec les modèles.");

    // --- Semis -------------------------------------------------------------
    const reference = await seedReferenceData();

    if (withDemo) {
      await seedDemoContent({ ...reference, adminPassword, demoPassword });
    } else {
      console.log(
        "Contenu de démonstration ignoré (SEED_DEMO_CONTENT !== 'true').",
      );
    }

    console.log("Seed terminé avec succès.");
  } catch (error) {
    console.error("Échec du seed :", error.message);
    if (error.parent && error.parent.message) {
      console.error("Détail PostgreSQL :", error.parent.message);
    }
    if (error.errors) {
      error.errors.forEach((e) => console.error(" -", e.message));
    }
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

seedDatabase();
