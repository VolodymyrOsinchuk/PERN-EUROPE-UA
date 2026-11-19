// frontend/src/data/publicationCategories.js
// Список категорій тепер у БД (див. hooks/usePublicationCategories.js).
// Тут лишилась лише палітра: колір визначається за назвою,
// тож нова категорія отримує колір без змін у коді.

const PALETTE = [
  { text: "#1d4ed8", bg: "#eff6ff" },
  { text: "#065f46", bg: "#ecfdf5" },
  { text: "#9a3412", bg: "#fff7ed" },
  { text: "#0f766e", bg: "#f0fdfa" },
  { text: "#be185d", bg: "#fdf2f8" },
  { text: "#6d28d9", bg: "#f5f3ff" },
  { text: "#be123c", bg: "#fff1f2" },
  { text: "#0e7490", bg: "#ecfeff" },
  { text: "#854d0e", bg: "#fefce8" },
  { text: "#166534", bg: "#f0fdf4" },
  { text: "#7e22ce", bg: "#fdf4ff" },
  { text: "#475569", bg: "#f8fafc" },
];

const FALLBACK = { text: "#64748b", bg: "#f1f5f9" };

export const getCategoryColors = (name) => {
  if (!name || typeof name !== "string") return FALLBACK;
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
};
