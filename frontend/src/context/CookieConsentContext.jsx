import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CONSENT_STORAGE_KEY,
  readConsent,
  writeConsent,
} from "../utils/consent";
import { TRACKERS } from "../utils/trackers";

const CookieConsentContext = createContext(null);

// Loads or unloads each tracker to match the current consent.
// `active` is a Set of tracker ids that are currently loaded, so
// repeated calls never load a tracker twice.
function applyConsent(consent, active) {
  TRACKERS.forEach((t) => {
    const allowed = consent?.[t.category] === true;
    if (allowed && !active.has(t.id)) {
      t.load();
      active.add(t.id);
    } else if (!allowed && active.has(t.id)) {
      t.unload();
      active.delete(t.id);
    }
  });
}

export function CookieConsentProvider({ children }) {
  // Lazy initializer: reads storage once, validates it, and cleans it if corrupted.
  const [consent, setConsent] = useState(readConsent);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const activeTrackers = useRef(new Set());

  // Apply consent whenever it changes (including withdrawal).
  useEffect(() => {
    applyConsent(consent, activeTrackers.current);
  }, [consent]);

  // Keep several open tabs in sync (e.g. consent withdrawn in another tab).
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === CONSENT_STORAGE_KEY) setConsent(readConsent());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const saveConsent = useCallback((prefs) => {
    setConsent(writeConsent(prefs));
    setSettingsOpen(false);
  }, []);

  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const value = useMemo(
    () => ({
      consent,
      showBanner: consent === null,
      settingsOpen,
      openSettings,
      closeSettings,
      saveConsent,
      hasConsent: (category) => consent?.[category] === true,
    }),
    [consent, settingsOpen, openSettings, closeSettings, saveConsent],
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error(
      "useCookieConsent must be used inside CookieConsentProvider",
    );
  }
  return ctx;
}
