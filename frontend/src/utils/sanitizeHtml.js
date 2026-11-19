/* Базова санітизація HTML для безпечного рендерингу контенту публікацій.
   Дозволяє лише безпечні теги та атрибути, прибираючи всі JS-події та <script>. */

const ALLOWED_TAGS = [
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
];

const ALLOWED_ATTRS = {
  a: ["href", "title", "target", "rel"],
};

/* Прибирає небезпечні атрибути (on*, javascript:, data: крім дозволених) */
const cleanAttrs = (tag, attrs) => {
  const result = {};
  for (const [key, value] of Object.entries(attrs)) {
    const lowerKey = key.toLowerCase();
    if (lowerKey.startsWith("on")) continue; // прибираємо onClick тощо
    if (lowerKey === "style") continue; // прибираємо inline-стили
    if (value?.toLowerCase().startsWith("javascript:")) continue;
    if (value?.toLowerCase().startsWith("data:") && !value.toLowerCase().startsWith("data:image/")) continue;
    const allowed =
      ALLOWED_ATTRS[tag]?.includes(lowerKey) ||
      ["id", "class", "title"].includes(lowerKey);
    if (allowed) result[key] = value;
  }
  return result;
};

/* Рекурсивно обходить DOM-подібний рядок через тимчасовий елемент.
   Потребує DOM (браузер), тому використовується лише в компоненті. */
export const sanitizeRichText = (html) => {
  if (!html) return "";
  if (typeof html !== "string") return String(html);

  const div = document.createElement("div");
  div.innerHTML = html;

  /* Видаляємо всі <script> та події */
  const scripts = div.querySelectorAll("script");
  scripts.forEach((s) => s.remove());

  const walk = (node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node;
      const tag = el.tagName.toLowerCase();

      if (!ALLOWED_TAGS.includes(tag)) {
        /* Розгортаємо недозволений тег, залишаючи вміст */
        const parent = el.parentNode;
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el);
        }
        parent.removeChild(el);
        return;
      }

      /* Очищаємо атрибути */
      const attrs = el.attributes;
      for (let i = attrs.length - 1; i >= 0; i--) {
        const attr = attrs[i];
        const cleaned = cleanAttrs(tag, { [attr.name]: attr.value });
        if (cleaned[attr.name] === undefined) {
          el.removeAttribute(attr.name);
        } else if (cleaned[attr.name] !== attr.value) {
          el.setAttribute(attr.name, cleaned[attr.name]);
        }
      }

      for (let i = 0; i < el.childNodes.length; i++) {
        walk(el.childNodes[i]);
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      /* Текстові вузли залишаємо як є (вже в HTML-контексті) */
    }
  };

  walk(div);
  return div.innerHTML;
};
