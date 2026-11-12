/**
 * scripts/seedData.js
 *
 * Seed PostgreSQL avec purge complète des données applicatives.
 *
 * IMPORTANT :
 *   - Les migrations gèrent exclusivement le schéma.
 *   - Aucun sequelize.sync().
 *   - La purge supprime uniquement les tables listées dans
 *     APPLICATION_MODELS.
 *   - SequelizeMeta n'est jamais supprimée.
 *   - Les séquences PostgreSQL sont réinitialisées.
 *
 * Variables :
 *
 *   CONFIRM_SEED_DB=<nom_base>       obligatoire
 *   CONFIRM_PURGE_DB=<nom_base>      obligatoire
 *
 *   SEED_DEMO_CONTENT=true           optionnel
 *   SEED_ADMIN_PASSWORD=...          requis avec demo
 *   SEED_DEMO_PASSWORD=...           requis avec demo
 *
 *   ALLOW_PRODUCTION_SEED=true       obligatoire en production
 *
 * Note :
 *   JWT_SECRET n'est pas utilisé par le seed, mais
 *   config/config.js l'exige au chargement. Une valeur
 *   par défaut (inerte) est donc injectée plus bas.
 *
 * Exemple :
 *
 *   npm run migrate
 *
 *   CONFIRM_SEED_DB=defaultdb \
 *   CONFIRM_PURGE_DB=defaultdb \
 *   npm run seed
 *
 * Avec contenu de démonstration :
 *
 *   CONFIRM_SEED_DB=defaultdb \
 *   CONFIRM_PURGE_DB=defaultdb \
 *   SEED_DEMO_CONTENT=true \
 *   SEED_ADMIN_PASSWORD=xxx \
 *   SEED_DEMO_PASSWORD=xxx \
 *   npm run seed
 */

/*
 * Le seed n'utilise ni JWT ni envoi d'email, mais
 * config/config.js exige JWT_SECRET au chargement
 * (required() lève une erreur si la variable est absente).
 *
 * On injecte donc une valeur par défaut inerte pour que
 * `npm run seed` fonctionne même sans JWT_SECRET configuré
 * (CI, conteneur minimal, .env incomplet).
 *
 * dotenv ne surcharge jamais une variable déjà définie :
 * un vrai JWT_SECRET (présent dans .env.development par
 * exemple) reste prioritaire. La valeur inerte n'est de
 * toute façon jamais utilisée — aucun token n'est signé
 * ni vérifié dans ce script.
 */
process.env.JWT_SECRET = process.env.JWT_SECRET || "seed-local-unused-value";

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

/**
 * Tables appartenant à ce seed.
 *
 * NE PAS ajouter SequelizeMeta ici.
 * SequelizeMeta contient l'historique des migrations et doit être conservée.
 */
const APPLICATION_MODELS = [
  ForumReply,
  ForumTopic,
  Adv,
  Event,
  News,
  Publication,
  SubCategory,
  ForumCategory,
  Category,
  User,
];

// ---------------------------------------------------------------------------
// UTILITAIRES
// ---------------------------------------------------------------------------

async function createIfMissing(model, where, values) {
  const existing = await model.findOne({ where });

  if (existing) {
    return existing;
  }

  return model.create(values);
}

async function findOrCreateOne(model, where, defaults) {
  const [row] = await model.findOrCreate({
    where,
    defaults,
  });

  return row;
}

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
    .filter(([, model]) => !model || typeof model.findOne !== "function")
    .map(([name]) => name);

  if (broken.length) {
    throw new Error(`Modèles non exportés correctement : ${broken.join(", ")}`);
  }

  return models;
}

// ---------------------------------------------------------------------------
// VÉRIFICATION DU SCHÉMA
// ---------------------------------------------------------------------------

async function checkSchema(models) {
  const qi = sequelize.getQueryInterface();
  const problems = [];

  for (const [name, model] of Object.entries(models)) {
    const tableName = model.getTableName();

    let columns;

    try {
      columns = await qi.describeTable(tableName);
    } catch (error) {
      problems.push(
        `Table absente pour ${name} (${JSON.stringify(tableName)})`,
      );
      continue;
    }

    const missing = Object.values(model.rawAttributes)
      .map((attr) => attr.field)
      .filter((field) => !(field in columns));

    if (missing.length) {
      problems.push(`${name} : colonnes manquantes → ${missing.join(", ")}`);
    }
  }

  if (problems.length) {
    throw new Error(
      "Schéma incompatible avec les modèles :\n" +
        "  - " +
        problems.join("\n  - ") +
        "\n\n" +
        "Lancez d'abord `npm run migrate`.",
    );
  }
}

// ---------------------------------------------------------------------------
// PURGE
// ---------------------------------------------------------------------------

async function purgeDatabase() {
  console.log("");
  console.log("==============================================");
  console.log("⚠️  PURGE DES DONNÉES APPLICATIVES");
  console.log("==============================================");

  /*
   * CASCADE vide également les tables dépendantes
   * (event_registrations, reports, conversations,
   * messages, adv_expiration_settings…).
   *
   * SequelizeMeta n'est PAS dans APPLICATION_MODELS :
   * l'historique des migrations est conservé.
   */

  const qi = sequelize.getQueryInterface();

  const tableNames = APPLICATION_MODELS.map((model) => {
    const table = model.getTableName();

    if (typeof table === "string") {
      return qi.quoteIdentifier(table);
    }

    const schema = table.schema || "public";
    const tableName = table.tableName;

    return `${qi.quoteIdentifier(schema)}.${qi.quoteIdentifier(tableName)}`;
  });

  console.log("");
  console.log("Tables qui seront purgées :");

  APPLICATION_MODELS.forEach((model) => {
    console.log(`  - ${JSON.stringify(model.getTableName())}`);
  });

  console.log("");
  console.log("Exécution du TRUNCATE...");

  await sequelize.query(
    `
      TRUNCATE TABLE
        ${tableNames.join(", ")}
      RESTART IDENTITY
      CASCADE;
    `,
  );

  console.log("");
  console.log("✅ Données applicatives supprimées.");
  console.log("✅ Séquences PostgreSQL réinitialisées.");
  console.log("✅ SequelizeMeta conservée.");
}

// ---------------------------------------------------------------------------
// DONNÉES DE RÉFÉRENCE
// ---------------------------------------------------------------------------

async function seedReferenceData() {
  console.log("");
  console.log("==============================================");
  console.log("📚 DONNÉES DE RÉFÉRENCE");
  console.log("==============================================");

  /*
   * Liste COMPLETTE des catégories et sous-catégories.
   *
   * Les noms ukrainiens correspondent aux données
   * de démonstration (seedDemoContent) et aux
   * catégories attendues par validateDemoReferences.
   *
   * IMPORTANT : la première occurrence d'un nom de
   * sous-catégorie détermine la clé « nue » utilisée
   * par les annonces de démo (ex. « Групові курси »
   * doit rester dans « Послуги »).
   */

  const catData = [
    {
      name: "Нерухомість",
      subs: [
        "Оренда квартири",
        "Оренда будинку",
        "Оренда кімнати",
        "Спільна оренда",
        "Короткострокова оренда",
        "Довгострокова оренда",
        "Продаж нерухомості",
        "Купівля нерухомості",
        "Пошук співмешканців",
        "Пошук сусідів",
        "Екстрене житло",
        "Тимчасове житло",
        "Безкоштовне житло",
        "Житло для сімей",
        "Житло для студентів",
        "Житло для людей з тваринами",
        "Обмін житлом",
        "Суборенда",
        "Оренда офісу",
        "Оренда комерційного приміщення",
        "Гараж та паркінг",
        "Допомога з пошуком житла",
      ],
    },

    {
      name: "Робота",
      subs: [
        "Вакансії",
        "Пошук роботи",
        "Віддалена робота",
        "Робота за кордоном",
        "Робота без знання мови",
        "Робота з проживанням",
        "Робота для студентів",
        "Робота для пенсіонерів",
        "Підробіток",
        "Сезонна робота",
        "Позмінна робота",
        "Фріланс",
        "Стажування",
        "Перше робоче місце",
        "Волонтерство",
        "Практика",
        "Кар'єрні консультації",
        "Резюме та мотиваційні листи",
        "Підготовка до співбесіди",
        "Пошук роботодавця",
        "Бізнес-партнери",
        "Нетворкінг",
      ],
    },

    {
      name: "Послуги",
      subs: [
        "Групові курси",
        "Індивідуальні курси",
        "Переклади та супровід",
        "Репетиторство",
        "Юридичні послуги",
        "Бухгалтерські послуги",
        "Побутові послуги",
        "Ремонт та будівництво",
        "Перукарні та салони",
        "Ветеринарні послуги",
        "Туристичні послуги",
        "Доставка та кур'єрство",
        "Фото та відео",
        "Прання та хімчистка",
        "Організація заходів",
      ],
    },

    {
      name: "Транспортні засоби",
      subs: [
        "Спільні поїздки",
        "Продаж автомобілів",
        "Оренда автомобілів",
        "Мотоцикли та скутери",
        "Велосипеди",
        "Автозапчастини",
        "Вантажівки та фургони",
        "Автосервіс та шиномонтаж",
        "Послуги таксі",
        "Авіаквитки та залізниця",
      ],
    },

    {
      name: "Спільнота",
      subs: [
        "Гуманітарна допомога",
        "Волонтерство",
        "Пошук людей",
        "Допомога з документами",
        "Психологічна підтримка",
        "Спільні заходи",
        "Українські школи та гуртки",
        "Релігійні громади",
        "Спортивні секції",
        "Речі безкоштовно",
      ],
    },

    {
      name: "Освіта",
      subs: [
        "Іноземні мови",
        "Українська мова",
        "Англійська мова",
        "Німецька мова",
        "Французька мова",
        "Польська мова",
        "Шкільні уроки",
        "Підготовка до іспитів",
        "Професійна перепідготовка",
        "Онлайн-курси",
        "Дитячі розвивальні заняття",
        "Вищі навчальні заклади",
      ],
    },

    {
      name: "Тварини",
      subs: [
        "Вигул собак",
        "Догляд за тваринами",
        "Зоотовари",
        "Передержка",
        "Знахідки та втрати",
        "Аксесуари для тварин",
      ],
    },

    {
      name: "Хобі та відпочинок",
      subs: [
        "Спорт та фітнес",
        "Музика",
        "Рукоділля",
        "Настільні ігри",
        "Книги",
        "Квитки на заходи",
        "Танці",
        "Кулінарні курси",
      ],
    },

    {
      name: "Електроніка та техніка",
      subs: [
        "Телефони",
        "Ноутбуки",
        "Комп'ютери та периферія",
        "Техніка для дому",
        "Ігрові консолі",
        "Аудіотехніка",
        "Фототехніка",
      ],
    },

    {
      name: "Одяг та речі",
      subs: [
        "Жіночий одяг",
        "Чоловічий одяг",
        "Дитячий одяг",
        "Взуття",
        "Аксесуари",
        "Меблі",
        "Посуд",
        "Текстиль",
      ],
    },
  ];

  const categoryMap = {};
  const subcategoryMap = {};

  for (const item of catData) {
    const category = await findOrCreateOne(
      Category,
      {
        name: item.name,
      },
      {
        name: item.name,
      },
    );

    categoryMap[item.name] = category.id;

    for (const subName of item.subs) {
      const sub = await findOrCreateOne(
        SubCategory,
        {
          name: subName,
          categoryId: category.id,
        },
        {
          name: subName,
          categoryId: category.id,
        },
      );

      /*
       * Clé spécifique à la catégorie :
       *
       * "Нерухомість:Оренда квартири"
       *
       * Cela évite toute ambiguïté si deux catégories
       * possèdent une sous-catégorie portant le même nom.
       */
      subcategoryMap[`${item.name}:${subName}`] = sub.id;

      /*
       * Compatibilité avec les données de démo existantes.
       *
       * La première occurrence est conservée.
       */
      if (!subcategoryMap[subName]) {
        subcategoryMap[subName] = sub.id;
      }
    }
  }

  // -------------------------------------------------------------------------
  // Catégories forum
  // -------------------------------------------------------------------------

  console.log("");
  console.log("Création des 30 catégories du forum...");

  const { FORUM_30_CATEGORIES } = require("./seedForumCategories");
  const forumCategoryMap = {};

  for (const catData of FORUM_30_CATEGORIES) {
    const { subcategories, ...mainCatData } = catData;
    const row = await findOrCreateOne(
      ForumCategory,
      {
        title: mainCatData.title,
      },
      {
        ...mainCatData,
        isActive: true,
        parentId: null,
      },
    );

    forumCategoryMap[mainCatData.title] = row.id;

    if (subcategories && subcategories.length > 0) {
      for (let i = 0; i < subcategories.length; i++) {
        const subTitle = subcategories[i];
        await findOrCreateOne(
          ForumCategory,
          {
            title: subTitle,
            parentId: row.id,
          },
          {
            title: subTitle,
            description: `Підкатегорія «${subTitle}» у розділі «${mainCatData.title}»`,
            icon: mainCatData.icon,
            color: mainCatData.color,
            bgColor: mainCatData.bgColor,
            sortOrder: i + 1,
            isActive: true,
            parentId: row.id,
          },
        );
      }
    }
  }

  console.log("✅ Données de référence créées.");

  return {
    categoryMap,
    subcategoryMap,
    forumCategoryMap,
  };
}

// ---------------------------------------------------------------------------
// VALIDATION DES RÉFÉRENCES
// ---------------------------------------------------------------------------

function validateDemoReferences({
  categoryMap,
  subcategoryMap,
  forumCategoryMap,
}) {
  const requiredCategories = [
    "Нерухомість",
    "Робота",
    "Послуги",
    "Транспортні засоби",
    "Спільнота",
  ];

  /*
   * IMPORTANT :
   *
   * Chaque entrée ci-dessous doit exister dans catData.
   *
   * La clé « nue » d'une sous-catégorie correspond à
   * sa PREMIÈRE occurrence dans catData :
   *
   *   "Оренда квартири"       → catégorie "Нерухомість"
   *   "Вакансії"              → catégorie "Робота"
   *   "Групові курси"         → catégorie "Послуги"
   *   "Спільні поїздки"       → catégorie "Транспортні засоби"
   *   "Гуманітарна допомога"  → catégorie "Спільнота"
   */
  const requiredSubcategories = [
    "Оренда квартири",
    "Вакансії",
    "Групові курси",
    "Спільні поїздки",
    "Гуманітарна допомога",
  ];

  const requiredForumCategories = ["Житло", "Робота"];

  const missingCategories = requiredCategories.filter(
    (name) => !categoryMap[name],
  );

  const missingSubcategories = requiredSubcategories.filter(
    (name) => !subcategoryMap[name],
  );

  const missingForumCategories = requiredForumCategories.filter(
    (name) => !forumCategoryMap[name],
  );

  const errors = [];

  if (missingCategories.length) {
    errors.push(`Catégories manquantes : ${missingCategories.join(", ")}`);
  }

  if (missingSubcategories.length) {
    errors.push(
      `Sous-catégories manquantes : ${missingSubcategories.join(", ")}`,
    );
  }

  if (missingForumCategories.length) {
    errors.push(
      `Catégories forum manquantes : ${missingForumCategories.join(", ")}`,
    );
  }

  if (errors.length) {
    throw new Error(
      "Références de démonstration invalides :\n  - " + errors.join("\n  - "),
    );
  }
}

// ---------------------------------------------------------------------------
// CONTENU DE DÉMONSTRATION
// ---------------------------------------------------------------------------

async function seedDemoContent({
  categoryMap,
  subcategoryMap,
  forumCategoryMap,
  adminPassword,
  demoPassword,
}) {
  console.log("");
  console.log("==============================================");
  console.log("🧪 CONTENU DE DÉMONSTRATION");
  console.log("==============================================");

  // -------------------------------------------------------------------------
  // 1. Utilisateurs
  // -------------------------------------------------------------------------

  const adminUser = await createIfMissing(
    User,
    {
      email: "admin@ukraine-europe.eu",
    },
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

  const userMap = {
    "admin@ukraine-europe.eu": adminUser.id,
  };

  for (const seedUser of seedUsers) {
    const user = await createIfMissing(
      User,
      {
        email: seedUser.email,
      },
      {
        ...seedUser,
        password: demoPassword,
        agreeToTerms: true,
        isVerified: true,
      },
    );

    userMap[user.email] = user.id;
  }

  // -------------------------------------------------------------------------
  // 2. Annonces
  // -------------------------------------------------------------------------

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
      subcategoryId: subcategoryMap["Оренда квартири"],
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

      // "Групові курси" appartient à la catégorie
      // "Послуги" (première occurrence dans catData),
      // ce qui est cohérent avec categoryId ci-dessus.
      subcategoryId: subcategoryMap["Групові курси"],

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
    if (!adv.categoryId) {
      throw new Error(`Catégorie introuvable pour l'annonce "${adv.title}".`);
    }

    if (!adv.subcategoryId) {
      throw new Error(
        `Sous-catégorie introuvable pour l'annonce "${adv.title}".`,
      );
    }

    await createIfMissing(
      Adv,
      {
        title: adv.title,
        userId: adv.userId,
      },
      adv,
    );
  }

  // -------------------------------------------------------------------------
  // 3. Événements
  // -------------------------------------------------------------------------

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
    await createIfMissing(
      Event,
      {
        title: event.title,
      },
      event,
    );
  }

  // -------------------------------------------------------------------------
  // 4. News
  // -------------------------------------------------------------------------

  const newsData = [
    {
      title: "Нові правила щодо статусу тимчасового захисту",
      content:
        "Європейський Союз продовжує тимчасовий захист. Ось деталі змін...",
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
    await createIfMissing(
      News,
      {
        title: news.title,
      },
      news,
    );
  }

  // -------------------------------------------------------------------------
  // 5. Publications
  // -------------------------------------------------------------------------

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
      {
        title: publication.title,
      },
      publication,
    );
  }

  // -------------------------------------------------------------------------
  // 6. Forum
  // -------------------------------------------------------------------------

  const topic1 = await createIfMissing(
    ForumTopic,
    {
      title: "Як знайти житло в Празі?",
    },
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
      {
        topicId: reply.topicId,
        author: reply.author,
      },
      reply,
    );
  }

  const topic2 = await createIfMissing(
    ForumTopic,
    {
      title: "Визнання медичних дипломів у Франції",
    },
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
    {
      topicId: topic2.id,
      author: "Адміністратор Системи",
    },
    {
      topicId: topic2.id,
      content:
        "Це досить тривалий процес, який називається Padhue. Необхідно скласти іспити для перевірки знань.",
      author: "Адміністратор Системи",
      userId: userMap["admin@ukraine-europe.eu"],
    },
  );

  console.log("✅ Contenu de démonstration créé.");
}

// ---------------------------------------------------------------------------
// POINT D'ENTRÉE
// ---------------------------------------------------------------------------

async function seedDatabase() {
  try {
    // -----------------------------------------------------------------------
    // 1. Sécurité production
    // -----------------------------------------------------------------------

    const isProduction = process.env.NODE_ENV === "production";

    if (isProduction && process.env.ALLOW_PRODUCTION_SEED !== "true") {
      throw new Error(
        "⛔ En production, le seed exige ALLOW_PRODUCTION_SEED=true.",
      );
    }

    // -----------------------------------------------------------------------
    // 2. Connexion / cible
    // -----------------------------------------------------------------------

    const { host, database } = sequelize.config;

    console.log("");
    console.log("==============================================");
    console.log("🌱 SEED DATABASE");
    console.log("==============================================");
    console.log(`Host     : ${host}`);
    console.log(`Database : ${database}`);
    console.log("");

    // -----------------------------------------------------------------------
    // 3. Double confirmation
    // -----------------------------------------------------------------------

    if (process.env.CONFIRM_SEED_DB !== database) {
      throw new Error(
        `Seed refusé.\n` +
          `CONFIRM_SEED_DB doit être exactement égal à : ${database}`,
      );
    }

    if (process.env.CONFIRM_PURGE_DB !== database) {
      throw new Error(
        `Purge refusée.\n` +
          `CONFIRM_PURGE_DB doit être exactement égal à : ${database}`,
      );
    }

    // -----------------------------------------------------------------------
    // 4. Démo
    // -----------------------------------------------------------------------

    const withDemo = process.env.SEED_DEMO_CONTENT === "true";

    const adminPassword = process.env.SEED_ADMIN_PASSWORD;

    const demoPassword = process.env.SEED_DEMO_PASSWORD;

    if (withDemo && (!adminPassword || !demoPassword)) {
      throw new Error(
        "SEED_DEMO_CONTENT=true exige " +
          "SEED_ADMIN_PASSWORD et " +
          "SEED_DEMO_PASSWORD.",
      );
    }

    // -----------------------------------------------------------------------
    // 5. Vérifications lecture seule
    // -----------------------------------------------------------------------

    const models = checkModelsLoaded();

    await sequelize.authenticate();

    console.log("✅ Connexion à PostgreSQL OK.");

    await checkSchema(models);

    console.log("✅ Schéma compatible avec les modèles.");

    // -----------------------------------------------------------------------
    // 6. PURGE
    // -----------------------------------------------------------------------

    await purgeDatabase();

    // -----------------------------------------------------------------------
    // 7. Référentiel
    // -----------------------------------------------------------------------

    const reference = await seedReferenceData();

    // -----------------------------------------------------------------------
    // 8. Validation démo
    // -----------------------------------------------------------------------

    if (withDemo) {
      validateDemoReferences(reference);
    }

    // -----------------------------------------------------------------------
    // 9. Démo
    // -----------------------------------------------------------------------

    if (withDemo) {
      await seedDemoContent({
        ...reference,
        adminPassword,
        demoPassword,
      });
    } else {
      console.log("");
      console.log("ℹ️  Contenu de démonstration ignoré.");
      console.log("   SEED_DEMO_CONTENT !== true");
    }

    // -----------------------------------------------------------------------
    // 10. Résumé
    // -----------------------------------------------------------------------

    const [
      categories,
      subcategories,
      users,
      advs,
      events,
      news,
      publications,
      forumCategories,
      forumTopics,
      forumReplies,
    ] = await Promise.all([
      Category.count(),
      SubCategory.count(),
      User.count(),
      Adv.count(),
      Event.count(),
      News.count(),
      Publication.count(),
      ForumCategory.count(),
      ForumTopic.count(),
      ForumReply.count(),
    ]);

    console.log("");
    console.log("Résumé :");
    console.log(`  Catégories          : ${categories}`);
    console.log(`  Sous-catégories     : ${subcategories}`);
    console.log(`  Catégories forum    : ${forumCategories}`);
    console.log(`  Utilisateurs        : ${users}`);
    console.log(`  Annonces            : ${advs}`);
    console.log(`  Événements          : ${events}`);
    console.log(`  Actualités          : ${news}`);
    console.log(`  Publications        : ${publications}`);
    console.log(`  Sujets forum        : ${forumTopics}`);
    console.log(`  Réponses forum      : ${forumReplies}`);

    // -----------------------------------------------------------------------
    // 11. Fin
    // -----------------------------------------------------------------------

    console.log("");
    console.log("==============================================");
    console.log("✅ SEED TERMINÉ AVEC SUCCÈS");
    console.log("==============================================");
    console.log("");
  } catch (error) {
    console.error("");
    console.error("==============================================");
    console.error("❌ ÉCHEC DU SEED");
    console.error("==============================================");

    console.error(error.message);

    if (error.parent?.message) {
      console.error("");
      console.error("Détail PostgreSQL :");
      console.error(error.parent.message);
    }

    if (error.errors) {
      error.errors.forEach((e) => {
        console.error(" -", e.message);
      });
    }

    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

seedDatabase();
