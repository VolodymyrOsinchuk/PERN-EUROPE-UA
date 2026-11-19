/* Базова санітизація HTML для безпечного рендерингу контенту публікацій.
   Дозволяє лише безпечні теги та атрибути, прибираючи всі JS-події та <script>. */

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "b",
  "strong",
  "i",
  "em",
  "u",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
  "pre",
  "code",
  "a",
  "hr",
]);

const ALLOWED_ATTRS = {
  a: ["href", "title", "target", "rel"],
};

/* Прибирає небезпечні атрибути (on*, javascript:, data: крім дозволених) */
const cleanAttrs = (tag, attrs) => {
  const result = {};
  for (const [key, value] of Object.entries(attrs)) {
    const lowerKey = key.toLowerCase();
    if (lowerKey.startsWith("on")) continue; // прибираємо onClick тощо
    if (lowerKey === "style") continue; // прибираємо inline-стилі
    if (typeof value === "string" && value.trim() === "") continue;
    if (value?.toLowerCase?.().startsWith("javascript:")) continue;
    if (
      value?.toLowerCase?.().startsWith("data:") &&
      !value.toLowerCase().startsWith("data:image/")
    ) {
      continue;
    }
    const allowed =
      ALLOWED_ATTRS[tag]?.includes(lowerKey) ||
      ["id", "class", "title"].includes(lowerKey);
    if (allowed) result[key] = value;
  }
  return result;
};

/*
 * Безпечний рекурсивний обхід. Усі маніпуляції з DOM робляться з
 * захисними перевірками `el.parentNode`, щоб уникнути помилок
 * `Cannot read properties of null` при розгортанні тегів.
 */
export const sanitizeRichText = (html) => {
  if (!html) return "";
  if (typeof html !== "string") return String(html);
  if (typeof document === "undefined") return html;

  const div = document.createElement("div");
  div.innerHTML = html;

  /* Перед обходом: видаляємо <script> та всі недозволені теги
     (включаючи ті, що вже вставлені парсером, поза div, якщо можливо). */
  const scripts = div.querySelectorAll("script");
  scripts.forEach((s) => s.remove());
  const tagsIn = [
    ...div.querySelectorAll("*"),
  ];
  for (const el of tagsIn) {
    const tag = (el.tagName || "").toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) {
      // Розгортаємо вміст недозволеного тега в його парент
      const parent = el.parentNode;
      if (parent) {
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el);
        }
        parent.removeChild(el);
      }
    }
  }

  /* Очищаємо атрибути для всіх дозволених елементів */
  const allowedEls = div.querySelectorAll("*");
  for (const el of allowedEls) {
    const attrs = Array.from(el.attributes);
    for (const attr of attrs) {
      const cleaned = cleanAttrs(
        (el.tagName || "").toLowerCase(),
        { [attr.name]: attr.value },
      );
      if (cleaned[attr.name] === undefined) {
        el.removeAttribute(attr.name);
      }
    }
  }

  return div.innerHTML;
};
