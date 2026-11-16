import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CONSENT_KEY = "cookieConsent";
const CONSENT_VERSION = 1;

const defaultConsent = {
  necessary: true,
  analytics: false,
  marketing: false,
};

const readConsent = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(CONSENT_KEY));

    if (saved?.version !== CONSENT_VERSION) return null;

    return {
      necessary: true,
      analytics: saved.analytics === true,
      marketing: saved.marketing === true,
    };
  } catch {
    return null;
  }
};

const Banner = ({ onAccept, onConsentChange }) => {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [consent, setConsent] = useState(defaultConsent);

  useEffect(() => {
    const saved = readConsent();

    if (saved) {
      setConsent(saved);
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, []);

  const saveConsent = (newConsent) => {
    const data = {
      ...newConsent,
      necessary: true,
      version: CONSENT_VERSION,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(CONSENT_KEY, JSON.stringify(data));

    setConsent(data);
    setVisible(false);
    setSettingsOpen(false);

    // Informer les autres composants de la décision
    window.dispatchEvent(
      new CustomEvent("cookie-consent-updated", {
        detail: data,
      }),
    );

    if (onConsentChange) onConsentChange(data);
  };

  const handleAccept = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    });

    if (onAccept) onAccept();
  };

  const handleReject = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  const handleSaveSettings = () => {
    saveConsent(consent);
  };

  return (
    <>
      {/* Cookie banner */}
      {visible && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(30, 41, 59, 0.97)",
            color: "white",
            p: 3,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
            zIndex: 1400,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight={700} sx={{ mb: 0.5 }}>
              🍪 Ми використовуємо cookie
            </Typography>

            <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
              Необхідні cookie забезпечують роботу сайту. За вашою згодою ми
              також можемо використовувати аналітичні та маркетингові cookie.{" "}
              <Link href="/policy" sx={{ color: "#90caf9" }}>
                Політика конфіденційності
              </Link>
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Button
              variant="outlined"
              onClick={handleReject}
              sx={{ color: "white", borderColor: "#94a3b8" }}
            >
              Відхилити
            </Button>

            <Button
              variant="outlined"
              onClick={() => setSettingsOpen(true)}
              sx={{ color: "white", borderColor: "#94a3b8" }}
            >
              Налаштувати
            </Button>

            <Button variant="contained" onClick={handleAccept}>
              Прийняти всі
            </Button>
          </Box>
        </Box>
      )}

      {/* Settings dialog */}
      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Налаштування cookie
          <IconButton
            onClick={() => setSettingsOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Ви можете самостійно обрати, які cookie дозволити. Необхідні cookie
            завжди активні, оскільки вони потрібні для роботи сайту.
          </Typography>

          <Box sx={{ py: 1 }}>
            <FormControlLabel
              control={<Switch checked disabled />}
              label="Необхідні cookie"
            />
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Забезпечують безпеку, авторизацію та основні функції сайту.
            </Typography>
          </Box>

          <Box sx={{ py: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={consent.analytics}
                  onChange={(e) =>
                    setConsent((prev) => ({
                      ...prev,
                      analytics: e.target.checked,
                    }))
                  }
                />
              }
              label="Аналітичні cookie"
            />
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Допомагають зрозуміти, як відвідувачі використовують сайт.
            </Typography>
          </Box>

          <Box sx={{ py: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={consent.marketing}
                  onChange={(e) =>
                    setConsent((prev) => ({
                      ...prev,
                      marketing: e.target.checked,
                    }))
                  }
                />
              }
              label="Маркетингові cookie"
            />
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Використовуються для реклами та маркетингових інструментів.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleReject} color="inherit">
            Відхилити всі
          </Button>

          <Button variant="contained" onClick={handleSaveSettings}>
            Зберегти налаштування
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reopen cookie settings */}
      {!visible && !settingsOpen && (
        <Button
          onClick={() => {
            const saved = readConsent();
            setConsent(saved || defaultConsent);
            setSettingsOpen(true);
          }}
          size="small"
          sx={{
            position: "fixed",
            bottom: 12,
            left: 12,
            minWidth: 0,
            width: 42,
            height: 42,
            borderRadius: "50%",
            backgroundColor: "#1e293b",
            color: "white",
            zIndex: 1200,
            fontSize: 20,
            "&:hover": {
              backgroundColor: "#334155",
            },
          }}
          aria-label="Налаштування cookie"
        >
          🍪
        </Button>
      )}
    </>
  );
};

export default Banner;
