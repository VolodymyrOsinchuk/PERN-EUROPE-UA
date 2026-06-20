const sanitizeHtml = require("sanitize-html");

// FIX P1-8: sanitisation serveur — la regex de nettoyage côté frontend
// (Profile.jsx: content?.replace(/<[^>]*>?/gm, "")) ne protège que
// l'affichage de CE composant, pas le stockage ni les autres consommateurs
// de la donnée (API publique, autres pages).
function sanitizeText(input) {
  if (typeof input !== "string") return input;
  return sanitizeHtml(input, {
    allowedTags: [], // texte brut uniquement — aucun HTML autorisé
    allowedAttributes: {},
  }).trim();
}

function sanitizeRichText(input) {
  if (typeof input !== "string") return input;
  return sanitizeHtml(input, {
    allowedTags: ["b", "i", "em", "strong", "p", "br", "ul", "ol", "li", "a"],
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto"],
  }).trim();
}

module.exports = { sanitizeText, sanitizeRichText };
