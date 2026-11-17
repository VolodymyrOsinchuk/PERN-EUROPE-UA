// frontend/src/data/publicationCategories.js
// Єдиний список категорій публікацій. Порядок тут = порядок у фільтрах і формах.

export const PUBLICATION_CATEGORIES = [
  { key: "documents", label: "Документи", color: "#1d4ed8", bg: "#eff6ff" },
  { key: "work", label: "Робота", color: "#065f46", bg: "#ecfdf5" },
  { key: "housing", label: "Житло", color: "#9a3412", bg: "#fff7ed" },
  { key: "benefits", label: "Допомога", color: "#0f766e", bg: "#f0fdfa" },
  { key: "family", label: "Сім'я", color: "#be185d", bg: "#fdf2f8" },
  { key: "education", label: "Освіта", color: "#6d28d9", bg: "#f5f3ff" },
  { key: "health", label: "Медицина", color: "#be123c", bg: "#fff1f2" },
  { key: "transport", label: "Транспорт", color: "#0e7490", bg: "#ecfeff" },
  { key: "finance", label: "Фінанси", color: "#854d0e", bg: "#fefce8" },
  { key: "integration", label: "Інтеграція", color: "#166534", bg: "#f0fdf4" },
  { key: "culture", label: "Культура", color: "#7e22ce", bg: "#fdf4ff" },
  { key: "life", label: "Життя в Європі", color: "#475569", bg: "#f8fafc" },
];

// Значення, що зберігаються в БД, — це label (сумісно з існуючими записами).
export const CATEGORY_LABELS = PUBLICATION_CATEGORIES.map((c) => c.label);

const BY_LABEL = Object.fromEntries(
  PUBLICATION_CATEGORIES.map((c) => [c.label, c]),
);

const FALLBACK = { color: "#64748b", bg: "#f1f5f9" };

// Кольори для бейджів і смужок. Невідома категорія отримує нейтральний колір.
export const getCategoryColors = (label) => {
  const c = BY_LABEL[label];
  return c
    ? { text: c.color, bg: c.bg }
    : { text: FALLBACK.color, bg: FALLBACK.bg };
};
