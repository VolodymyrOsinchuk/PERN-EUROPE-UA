// Règle identique au frontend (frontend/src/utils/phone.js) :
// 7 à 15 chiffres, avec « + » optionnel en préfixe —
// format international (E.164) ou numéro national.
const PHONE_PATTERN = /^(?:\+[1-9]\d{6,14}|\d{7,15})$/;

/**
 * Normalise un numéro de téléphone brut reçu par l'API :
 * - supprime espaces, tirets, parenthèses et points ;
 * - convertit le préfixe international « 00 » en « + » ;
 * - retourne null pour une valeur vide/absente ;
 * - une valeur sans aucun chiffre après nettoyage (ex. « abc »)
 *   est retournée telle quelle (« ») : c'est le modèle Sequelize
 *   qui la rejettera — aucune saisie invalide n'est acceptée
 *   en silence.
 */
function normalizePhone(value) {
  if (value === undefined) return undefined;
  if (value === null || String(value).trim() === "") return null;

  let cleaned = String(value).replace(/[^\d+]/g, "");
  if (cleaned.startsWith("00")) cleaned = `+${cleaned.slice(2)}`;
  return cleaned;
}

function isValidPhone(value) {
  return typeof value === "string" && PHONE_PATTERN.test(value);
}

module.exports = { PHONE_PATTERN, normalizePhone, isValidPhone };
