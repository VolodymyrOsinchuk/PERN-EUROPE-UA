const FallbackConfig = {
  title: "Інші наші проєкти",
  subtitle: "Ще кілька корисних платформ від нашої команди",
  sessionDismissKey: "cross_promotion_dismissed",
  analyticsEvent: "cross_promotion_click",
};

export const CROSS_PROMOTION = {
  ...FallbackConfig,

  sites: [
    {
      id: "project-one",
      name: "Конвектор онлайн",
      tagline: "Конвертуй файли швидко та безкоштовно",
      url: "https://texte-video.lovable.app",
      logo: "/promo/project-one.png",

      description:
        "Безкоштовний онлайн-конвертер для швидкого перетворення файлів у різні формати.",

      category: "Інструменти",
      accentColor: "#0057B8",

      utmCampaign: "online_converter",
      enabled: true,
      featured: true,
      order: 1,
    },

    {
      id: "project-two",
      name: "Знайомства без кордонів",
      tagline: "Нові знайомства без географічних меж",
      url: "https://ukrainian-connect.vercel.app",
      logo: "/promo/project-two.png",

      description:
        "Привітна спільнота, де можна познайомитися з українцями та людьми з усього світу — у безпеці та взаємній повазі.",

      category: "Спільнота",
      accentColor: "#059669",

      utmCampaign: "ukrainian_connect",
      enabled: true,
      featured: true,
      order: 2,
    },

    {
      id: "project-three",
      name: "Linguae",
      tagline: "Вивчай мови через спілкування",
      url: "https://linguae-one.vercel.app",
      logo: "/promo/project-three.png",

      description:
        "Практикуй іноземну мову з людиною, яка хоче вивчити твою рідну мову. Навчання через взаємний обмін.",

      category: "Освіта",
      accentColor: "#7c3aed",

      utmCampaign: "linguae",
      enabled: true,
      featured: true,
      order: 3,
    },
  ],
};

// Єдина функція отримання активних проєктів
export const getActivePromotions = () =>
  CROSS_PROMOTION.sites
    .filter((site) => site.enabled)
    .sort((a, b) => a.order - b.order);

// Отримання проєктів для головного промоблоку
export const getFeaturedPromotions = () =>
  getActivePromotions().filter((site) => site.featured);
