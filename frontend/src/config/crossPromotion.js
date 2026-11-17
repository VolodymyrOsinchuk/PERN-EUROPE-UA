// frontend/src/config/crossPromotion.js
// Single source of truth for the ecosystem promotion block.
// To hide a project, set enabled: false. Logo is optional (a letter fallback is shown).

export const CROSS_PROMOTION = {
  title: "Інші наші проєкти",
  subtitle: "Ще кілька корисних платформ від нашої команди",
  sessionDismissKey: "cross_promotion_dismissed",
  sites: [
    {
      id: "project-one",
      name: "Конвектор онлайн",
      url: "https://texte-video.lovable.app",
      logo: "/promo/project-one.png",
      description: "Короткий опис: безкоштовний конвектор різних видів файлів",
      accentColor: "#0057B8",
      enabled: true,
    },
    {
      id: "project-two",
      name: "Знайомства без кордонів",
      url: "https://ukrainian-connect.vercel.app",
      logo: "/promo/project-two.png",
      description:
        "Привітна спільнота, де можна познайомитися з українцями та людьми з усього світу — у безпеці та взаємній повазі.",
      accentColor: "#059669",
      enabled: true,
    },
    {
      id: "project-three",
      name: "Linguae",
      url: "https://linguae-one.vercel.app",
      logo: "/promo/project-three.png",
      description: "Практикуй мову з кимось, хто хоче вивчити твою мову.",
      accentColor: "#7c3aed",
      enabled: true,
    },
  ],
};
