export const CONSENT_STORAGE_KEY = "uve_cookie_consent";
// Increase this number whenever categories or purposes change.
// Users with an older version will be asked again.
export const CONSENT_VERSION = 1;
// PROPOSED value (12 months). Confirm before publishing.
export const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

const isValidRecord = (r) =>
  !!r &&
  typeof r === "object" &&
  r.necessary === true &&
  typeof r.analytics === "boolean" &&
  typeof r.marketing === "boolean" &&
  r.version === CONSENT_VERSION &&
  typeof r.updatedAt === "string" &&
  !Number.isNaN(Date.parse(r.updatedAt));

const removeStoredConsent = () => {
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    /* storage unavailable: nothing to remove */
  }
};

/** Returns a valid, unexpired consent record, or null. Never throws. */
export function readConsent() {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const record = JSON.parse(raw);
    const age = Date.now() - Date.parse(record?.updatedAt);
    if (!isValidRecord(record) || age < 0 || age > CONSENT_MAX_AGE_MS) {
      removeStoredConsent();
      return null;
    }
    return record;
  } catch {
    removeStoredConsent(); // corrupted JSON
    return null;
  }
}

/** Stores the decision. Only the consent key is touched. */
export function writeConsent({ analytics = false, marketing = false }) {
  const record = {
    necessary: true,
    analytics: !!analytics,
    marketing: !!marketing,
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Storage blocked: consent still applies in memory for this page view.
    // The banner will reappear on the next visit.
  }
  return record;
}
