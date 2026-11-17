// backend/utils/publicationInput.js
const PUBLICATION_CATEGORIES = require("../config/publicationCategories");
const { sanitizeText, sanitizeRichText } = require("./sanitize");

const toBool = (v) => v === true || v === "true" || v === "on";

// Повертає { error } або { data } з нормалізованими полями.
function normalizePublicationInput(body) {
  const {
    title,
    content,
    category,
    readTime,
    countryCode,
    sourceName,
    sourceUrl,
  } = body;

  if (!PUBLICATION_CATEGORIES.includes(category)) {
    return { error: "Невідома категорія" };
  }

  const code = countryCode ? String(countryCode).toUpperCase() : null;
  if (code && !/^[A-Z]{2}$/.test(code)) {
    return { error: "Некоректний код країни" };
  }

  let source = null;
  if (sourceUrl) {
    try {
      const u = new URL(sourceUrl);
      if (u.protocol !== "https:") throw new Error();
      source = u.toString();
    } catch {
      return { error: "Посилання на джерело має бути https-адресою" };
    }
  }

  return {
    data: {
      title: sanitizeText(title || ""),
      content: sanitizeRichText(content || ""),
      category,
      readTime: readTime ? sanitizeText(readTime) : null,
      countryCode: code,
      sourceName: sourceName ? sanitizeText(sourceName) : null,
      sourceUrl: source,
    },
  };
}

function resolveStatus({ isStaff, currentStatus, body }) {
  // Автор лише зберігає чернетку або надсилає на перевірку.
  if (!isStaff) return toBool(body.submit) ? "pending" : "draft";
  // Адмін/модератор може явно опублікувати або зберегти чернетку.
  if (body.publish !== undefined)
    return toBool(body.publish) ? "published" : "draft";
  return currentStatus || "draft";
}

module.exports = { normalizePublicationInput, toBool, resolveStatus };
