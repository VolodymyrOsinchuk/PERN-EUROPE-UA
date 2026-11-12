const path = require("path");
require("dotenv").config({
  path: path.join(
    __dirname,
    process.env.NODE_ENV === "production"
      ? "../.env.production"
      : "../.env.development",
  ),
});
const sequelize = require("../config/db");
const { ForumCategory } = require("../models/forumCategory");

const FORUM_30_CATEGORIES = [
  {
    title: "Житло",
    description: "Оренда, купівля нерухомості, пошук співмешканців, договори, депозити та гарантії",
    icon: "home",
    color: "#0284c7",
    bgColor: "#e0f2fe",
    sortOrder: 1,
    subcategories: ["Оренда", "Купівля нерухомості", "Пошук сусідів / колівінг", "Юридичні питання оренди"],
  },
  {
    title: "Робота",
    description: "Пошук вакансій, резюме, контракти, працевлаштування та трудове законодавство",
    icon: "work",
    color: "#2563eb",
    bgColor: "#eff6ff",
    sortOrder: 2,
    subcategories: ["Вакансії", "Пошук роботи / резюме", "Трудові договори та права", "Підтвердження стажу"],
  },
  {
    title: "Адміністративні формальності",
    description: "Реєстрація місця проживання, прописка, довідки, взаємодія з меріями та префектурами",
    icon: "assignment",
    color: "#4f46e5",
    bgColor: "#eef2ff",
    sortOrder: 3,
    subcategories: ["Реєстрація адреси", "Довідки та витяги", "Запис у державні установи"],
  },
  {
    title: "Імміграція та легалізація",
    description: "Тимчасовий захист, посвідки на проживання (ВНЖ/ПМЖ), візи, громадянство та статус",
    icon: "badge",
    color: "#7c3aed",
    bgColor: "#f5f3ff",
    sortOrder: 4,
    subcategories: ["Тимчасовий захист", "ВНЖ / ПМЖ", "Громадянство та паспорти", "Подовження документів"],
  },
  {
    title: "Фінанси та банківські послуги",
    description: "Відкриття банківських рахунків, перекази в Україну, картки, кредити та фінанси",
    icon: "account_balance",
    color: "#059669",
    bgColor: "#ecfdf5",
    sortOrder: 5,
    subcategories: ["Банківські рахунки", "Грошові перекази", "Кредити та іпотека", "Криптовалюти та інвестиції"],
  },
  {
    title: "Податки та соціальні внески",
    description: "Податкові декларації, резидентство, уникнення подвійного оподаткування",
    icon: "receipt_long",
    color: "#0d9488",
    bgColor: "#f0fdfa",
    sortOrder: 6,
    subcategories: ["Податкове резидентство", "Річна декларація", "Подвійне оподаткування", "Соціальні внески"],
  },
  {
    title: "Здоров'я та медицина",
    description: "Державна медицина, пошук україномовних лікарів, невідкладна допомога, аптеки",
    icon: "local_hospital",
    color: "#e11d48",
    bgColor: "#ffe4e6",
    sortOrder: 7,
    subcategories: ["Україномовні лікарі", "Запис до лікаря та невідкладна допомога", "Ліки та рецепти", "Стоматологія"],
  },
  {
    title: "Освіта та навчання",
    description: "Вступ до університетів, коледжі, стипендії, визнання українських дипломів",
    icon: "school",
    color: "#d97706",
    bgColor: "#fef3c7",
    sortOrder: 8,
    subcategories: ["Вища освіта / Університети", "Визнання дипломів (нострифікація)", "Стипендії та гранти", "Професійні курси"],
  },
  {
    title: "Вивчення мов",
    description: "Безкоштовні мовні курси, школи, додатки, практика мови та розмовні клуби",
    icon: "translate",
    color: "#0284c7",
    bgColor: "#e0f2fe",
    sortOrder: 9,
    subcategories: ["Безкоштовні державні курси", "Мовні школи та репетитори", "Розмовні клуби", "Матеріали для самостійного вивчення"],
  },
  {
    title: "Діти та батьківство",
    description: "Дитячі садки, школи, секції, дозвілля для дітей, пільги та виховання за кордоном",
    icon: "child_care",
    color: "#ea580c",
    bgColor: "#ffedd5",
    sortOrder: 10,
    subcategories: ["Дитячі садки", "Школи та гімназії", "Гуртки та спортивні секції", "Дитячі виплати та пільги"],
  },
  {
    title: "Сім'я та возз'єднання",
    description: "Возз'єднання родини, запрошення родичів, реєстрація шлюбу чи народження дитини",
    icon: "diversity_1",
    color: "#db2777",
    bgColor: "#fdf2f8",
    sortOrder: 11,
    subcategories: ["Процедура возз'єднання", "Візи для літніх батьків", "Реєстрація шлюбу", "Свідоцтво про народження дитини"],
  },
  {
    title: "Автомобілі та транспорт",
    description: "Реєстрація авто на укр номерах, розмитнення, обмін прав, ТО, штрафи та транспорт",
    icon: "directions_car",
    color: "#475569",
    bgColor: "#f1f5f9",
    sortOrder: 12,
    subcategories: ["Українські номери та реєстрація", "Обмін водійського посвідчення", "Купівля авто в Європі", "Громадський транспорт та проїзні"],
  },
  {
    title: "Покупки та послуги",
    description: "Магазини, сервіси, ремонт, побутові послуги від українських майстрів у Європі",
    icon: "shopping_bag",
    color: "#ca8a04",
    bgColor: "#fef9c3",
    sortOrder: 13,
    subcategories: ["Українські майстри та послуги", "Шопінг та вигідні пропозиції", "Ремонт техніки та житла", "Б'юті-послуги"],
  },
  {
    title: "Правова допомога",
    description: "Консультації юристів, адвокати, захист прав, суперечки з орендодавцями та роботодавцями",
    icon: "gavel",
    color: "#64748b",
    bgColor: "#f8fafc",
    sortOrder: 14,
    subcategories: ["Безкоштовна юридична допомога", "Трудові суперечки", "Захист прав споживачів", "Судові справи та адвокати"],
  },
  {
    title: "Соціальна допомога та виплати",
    description: "Соціальні центри (CAF, Jobcenter), щомісячні допомоги, житлові субсидії",
    icon: "volunteer_activism",
    color: "#0891b2",
    bgColor: "#ecfeff",
    sortOrder: 15,
    subcategories: ["Щомісячні грошові виплати", "Допомога на житло (субсидії)", "Гуманітарні штаби та одяг", "Пільги для вразливих категорій"],
  },
  {
    title: "Страхування",
    description: "Медичне страхування (mutuelle/Krankenkasse), автоцивілка, страхування житла",
    icon: "health_and_safety",
    color: "#16a34a",
    bgColor: "#f0fdf4",
    sortOrder: 16,
    subcategories: ["Медична страховка", "Страхування авто (Зелена карта)", "Страхування житла", "Страхування відповідальності"],
  },
  {
    title: "Харчування та продукти",
    description: "Українські ресторани, пекарні, магазини звичних продуктів, рецепти та гастрономія",
    icon: "restaurant",
    color: "#c026d3",
    bgColor: "#fae8ff",
    sortOrder: 17,
    subcategories: ["Українські продукти за кордоном", "Ресторани та кав'ярні", "Домашня випічка та кулінарія"],
  },
  {
    title: "Подорожі та відпочинок",
    description: "Подорожі країнами Європи, дешеві квитки, готелі, маршрути вихідного дня та кемпінги",
    icon: "flight_takeoff",
    color: "#0284c7",
    bgColor: "#e0f2fe",
    sortOrder: 18,
    subcategories: ["Дешеві авіаквитки та поїзди", "Маршрути вихідного дня", "Відпочинок на морі та в горах", "Правила подорожей з укр паспортом"],
  },
  {
    title: "Посилки та перевезення",
    description: "Доставка посилок Україна-Європа, буси, Нова Пошта, Meest, попутники та вантажі",
    icon: "local_shipping",
    color: "#b45309",
    bgColor: "#fef3c7",
    sortOrder: 19,
    subcategories: ["Поштові оператори (НП, Meest, Укрпошта)", "Приватні перевізники / буси", "Пошук попутного вантажу", "Митні правила та обмеження"],
  },
  {
    title: "Домашні тварини",
    description: "Ввезення тварин, ветпаспорти, чипування, титри сказу, ветеринари та житло з тваринами",
    icon: "pets",
    color: "#d97706",
    bgColor: "#fffbeb",
    sortOrder: 20,
    subcategories: ["Оформлення ветеринарних документів", "Пошук ветеринара та вакцинація", "Оренда житла з домашніми улюбленцями", "Перевезення літаком / поїздом"],
  },
  {
    title: "Бізнес та підприємництво",
    description: "Відкриття власної справи, ФОП/auto-entrepreneur/Gewerbe, ліцензії, бізнес-плани",
    icon: "storefront",
    color: "#1e3a8a",
    bgColor: "#dbeafe",
    sortOrder: 21,
    subcategories: ["Реєстрація ФОП / компанії", "Ліцензування та сертифікація", "Гранти для українського бізнесу", "Бухгалтерія та звітність"],
  },
  {
    title: "Фриланс та дистанційна робота",
    description: "Робота на іноземні замовники, Upwork, коворкінги, договори В2В, валютні надходження",
    icon: "laptop_mac",
    color: "#0369a1",
    bgColor: "#e0f2fe",
    sortOrder: 22,
    subcategories: ["Платформи для фрилансу", "Контракти з іноземними клієнтами", "Коворкінги та інтернет", "Податки для айтівців та фрилансерів"],
  },
  {
    title: "Психологія та адаптація",
    description: "Психологічна підтримка, стрес, культурний шок, групи взаємопідтримки",
    icon: "psychology",
    color: "#9333ea",
    bgColor: "#faf5ff",
    sortOrder: 23,
    subcategories: ["Безкоштовні консультації психологів", "Подолання стресу та тривожності", "Адаптація та нове середовище", "Підтримка дітей та підлітків"],
  },
  {
    title: "Міста та регіони Європи",
    description: "Особливості життя в різних містах: транспорт, райони для життя, клімат, специфіка",
    icon: "public",
    color: "#2563eb",
    bgColor: "#eff6ff",
    sortOrder: 24,
    subcategories: ["Міста Польщі", "Міста Німеччини", "Міста Франції", "Міста Чехії", "Інші країни ЄС"],
  },
  {
    title: "Події та зустрічі українців",
    description: "Мітинги, благодійні ярмарки, концерти, зустрічі громад, фестивалі та виставки",
    icon: "celebration",
    color: "#e11d48",
    bgColor: "#ffe4e6",
    sortOrder: 25,
    subcategories: ["Анонси культурних подій", "Благодійні заходи та ярмарки", "Зустрічі українських громад", "Мітинги та акції солідарності"],
  },
  {
    title: "Українська культура та традиції",
    description: "Святкування національних свят, традиції, українські клуби, майстер-класи",
    icon: "auto_stories",
    color: "#059669",
    bgColor: "#ecfdf5",
    sortOrder: 26,
    subcategories: ["Свята та обряди", "Українські книжкові клуби", "Народні ремесла та майстер-класи", "Збереження ідентичності"],
  },
  {
    title: "Знайомства та спілкування",
    description: "Пошук друзів, однодумців, компаній для прогулянок та спілкування рідною мовою",
    icon: "chat",
    color: "#ec4899",
    bgColor: "#fdf2f8",
    sortOrder: 27,
    subcategories: ["Пошук друзів за містами", "Спільні хобі та спорт", "Клуби за інтересами", "Неформальні зустрічі"],
  },
  {
    title: "Запитання та відповіді",
    description: "Швидкі запитання, поради від бувалих, відповіді на щоденні побутові та практичні питання",
    icon: "help_outline",
    color: "#0891b2",
    bgColor: "#cffafe",
    sortOrder: 28,
    subcategories: ["Швидкі запитання новачків", "Побутові лайфхаки", "Корисні контакти"],
  },
  {
    title: "Оголошення та пропозиції",
    description: "Приватні оголошення спільноти, взаємодопомога, віддам безкоштовно, обмін речами",
    icon: "campaign",
    color: "#f59e0b",
    bgColor: "#fef3c7",
    sortOrder: 29,
    subcategories: ["Віддам безкоштовно / подарую", "Обмін речами", "Взаємодопомога та волонтерство", "Пошук допомоги"],
  },
  {
    title: "Новини та важлива інформація",
    description: "Офіційні повідомлення посольств, зміни в законах європейських країн, важливі сповіщення",
    icon: "newspaper",
    color: "#4b5563",
    bgColor: "#f3f4f6",
    sortOrder: 30,
    subcategories: ["Офіційні новини та зміни в законах", "Повідомлення консульств та посольств", "Важливі попередження"],
  },
];

async function seedForumCategories() {
  try {
    console.log("🌱 Початок сідування 30 категорій форуму...");
    let createdCount = 0;
    let updatedCount = 0;
    let subCreatedCount = 0;

    for (const catData of FORUM_30_CATEGORIES) {
      const { subcategories, ...mainCatData } = catData;
      let category = await ForumCategory.findOne({
        where: { title: mainCatData.title },
      });

      if (!category) {
        category = await ForumCategory.create({
          ...mainCatData,
          isActive: true,
          parentId: null,
        });
        createdCount++;
      } else {
        await category.update({
          description: mainCatData.description,
          icon: mainCatData.icon,
          color: mainCatData.color,
          bgColor: mainCatData.bgColor,
          sortOrder: mainCatData.sortOrder,
          isActive: true,
        });
        updatedCount++;
      }

      // Seed subcategories
      if (subcategories && subcategories.length > 0) {
        for (let i = 0; i < subcategories.length; i++) {
          const subTitle = subcategories[i];
          let subCat = await ForumCategory.findOne({
            where: { title: subTitle, parentId: category.id },
          });
          if (!subCat) {
            await ForumCategory.create({
              title: subTitle,
              description: `Підкатегорія «${subTitle}» у розділі «${category.title}»`,
              icon: mainCatData.icon,
              color: mainCatData.color,
              bgColor: mainCatData.bgColor,
              sortOrder: i + 1,
              isActive: true,
              parentId: category.id,
            });
            subCreatedCount++;
          }
        }
      }
    }

    console.log(`✅ Успішно! Створено нових категорій: ${createdCount}, оновлено: ${updatedCount}, створено підкатегорій: ${subCreatedCount}. Всього основних категорій: 30.`);
  } catch (error) {
    console.error("❌ Помилка сідування категорій форуму:", error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  seedForumCategories();
}

module.exports = { seedForumCategories, FORUM_30_CATEGORIES };
