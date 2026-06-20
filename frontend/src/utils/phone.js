import { parsePhoneNumberFromString } from "libphonenumber-js";

/**
 * Combine un code pays (ex. "33") et un numéro local saisi par l'utilisateur
 * en un numéro E.164 valide (ex. "+33612345678"), ou retourne null si invalide.
 */
export function toE164(phoneCode, localNumber, countryIsoGuess) {
  if (!localNumber) return null;
  const raw = `+${phoneCode}${localNumber.replace(/\D/g, "")}`;
  const parsed = parsePhoneNumberFromString(raw);
  return parsed?.isValid() ? parsed.number : null;
}

/**
 * Formatage lisible pour l'affichage (ex. "+33 6 12 34 56 78")
 */
export function formatPhoneDisplay(e164) {
  if (!e164) return "";
  const parsed = parsePhoneNumberFromString(e164);
  return parsed ? parsed.formatInternational() : e164;
}
