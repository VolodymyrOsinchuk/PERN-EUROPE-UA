import { parsePhoneNumberFromString } from "libphonenumber-js";

/**
 * Règle de validation partagée avec le backend
 * (backend/utils/normalizePhone.js) : 7 à 15 chiffres, avec « + »
 * optionnel en préfixe — format international (E.164) ou national.
 */
export const PHONE_PATTERN = /^(?:\+[1-9]\d{6,14}|\d{7,15})$/;

export function isValidPhone(phone) {
  return typeof phone === "string" && PHONE_PATTERN.test(phone);
}

/**
 * Normalise un numéro saisi par l'utilisateur :
 * - retire espaces, tirets, parenthèses et points ;
 * - accepte le préfixe international « 00 » (converti en « + ») ;
 * - avec un code pays connu (ex. « 380 », « 33 »), compose le numéro
 *   international : le « 0 » de trunk national est retiré et le double
 *   code pays évité ;
 * - sans code pays, le numéro national est conservé tel quel.
 * Retourne le numéro normalisé, ou null s'il est invalide.
 */
export function toE164(phoneCode, localNumber) {
  if (!localNumber) return null;

  let cleaned = localNumber.replace(/[^\d+]/g, "");
  if (!cleaned) return null;

  // Préfixe d'accès international « 00 » → « + »
  if (cleaned.startsWith("00")) cleaned = `+${cleaned.slice(2)}`;

  // Déjà en format international (ex. « +33612345678 »)
  if (cleaned.startsWith("+")) {
    return isValidPhone(cleaned) ? cleaned : null;
  }

  // Code pays connu : composition du numéro international
  if (phoneCode) {
    const local = cleaned.replace(/^0+(?=\d)/, ""); // « 0 » de trunk national
    const withCode = local.startsWith(phoneCode)
      ? local
      : `${phoneCode}${local}`;
    const international = `+${withCode}`;
    return isValidPhone(international) ? international : null;
  }

  // Sans code pays : numéro national (ex. « 0671234567 »)
  return isValidPhone(cleaned) ? cleaned : null;
}

/**
 * Formatage lisible pour l'affichage (ex. "+33 6 12 34 56 78")
 */
export function formatPhoneDisplay(e164) {
  if (!e164) return "";
  const parsed = parsePhoneNumberFromString(e164);
  return parsed ? parsed.formatInternational() : e164;
}
