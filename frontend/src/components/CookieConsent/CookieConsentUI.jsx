import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useCookieConsent } from "../../context/CookieConsentContext";

// Below MUI modals (1300) and react-toastify, above page content.
const Z_BANNER = 1250;

const REJECT_OPTIONAL = { analytics: false, marketing: false };
const ACCEPT_ALL = { analytics: true, marketing: true };

function CategoryLabel({ title, description }) {
  return (
    <Box>
      <Typography fontWeight={600}>{title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  );
}

// Mounted only while open, so its draft state resets on every opening.
function SettingsDialog({ initial, onClose, onSave }) {
  const [draft, setDraft] = useState({
    analytics: !!initial?.analytics,
    marketing: !!initial?.marketing,
  });

  const toggle = (key) => (e) =>
    setDraft((d) => ({ ...d, [key]: e.target.checked }));

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="cookie-settings-title"
    >
      <DialogTitle id="cookie-settings-title">Налаштування cookie</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5}>
          <FormControlLabel
            control={<Switch checked disabled />}
            label={
              <CategoryLabel
                title="Необхідні"
                description="Потрібні для роботи сайту, входу в акаунт і безпеки. Завжди увімкнені."
              />
            }
            sx={{ alignItems: "flex-start", m: 0 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={draft.analytics}
                onChange={toggle("analytics")}
              />
            }
            label={
              <CategoryLabel
                title="Аналітичні"
                description="Допомагають зрозуміти, як використовується сайт. Наразі на сайті не використовуються."
              />
            }
            sx={{ alignItems: "flex-start", m: 0 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={draft.marketing}
                onChange={toggle("marketing")}
              />
            }
            label={
              <CategoryLabel
                title="Маркетингові"
                description="Для показу релевантної реклами. Наразі на сайті не використовуються."
              />
            }
            sx={{ alignItems: "flex-start", m: 0 }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ flexWrap: "wrap", gap: 1, p: 2 }}>
        <Button onClick={() => onSave(REJECT_OPTIONAL)}>
          Відхилити необов'язкові
        </Button>
        <Button variant="outlined" onClick={() => onSave(draft)}>
          Зберегти вибір
        </Button>
        <Button variant="contained" onClick={() => onSave(ACCEPT_ALL)}>
          Прийняти всі
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function CookieConsentUI() {
  const {
    consent,
    showBanner,
    settingsOpen,
    openSettings,
    closeSettings,
    saveConsent,
  } = useCookieConsent();

  return (
    <>
      {showBanner && (
        <Paper
          role="dialog"
          aria-labelledby="cookie-banner-title"
          aria-describedby="cookie-banner-desc"
          elevation={8}
          sx={{
            position: "fixed",
            left: { xs: 0, md: 24 },
            right: { xs: 0, md: 24 },
            bottom: { xs: 0, md: 24 },
            mx: "auto",
            maxWidth: { md: 960 },
            zIndex: Z_BANNER,
            p: { xs: 2, md: 3 },
            borderRadius: { xs: "16px 16px 0 0", md: "16px" },
            border: "1px solid #e2e8f0",
          }}
        >
          <Typography id="cookie-banner-title" variant="h6" fontWeight={700}>
            Ми використовуємо cookie
          </Typography>
          <Typography
            id="cookie-banner-desc"
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Необхідні cookie потрібні, щоб сайт працював і ви могли входити в
            акаунт. Аналітичні та маркетингові cookie вмикаються лише з вашої
            згоди. Детальніше — у{" "}
            <a href="/policy" style={{ color: "#0057B8" }}>
              Політиці конфіденційності
            </a>
            .
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ mt: 2.5, justifyContent: "flex-end" }}
          >
            <Button variant="outlined" onClick={openSettings}>
              Налаштувати
            </Button>
            <Button
              variant="outlined"
              onClick={() => saveConsent(REJECT_OPTIONAL)}
            >
              Відхилити необов'язкові
            </Button>
            <Button variant="contained" onClick={() => saveConsent(ACCEPT_ALL)}>
              Прийняти всі
            </Button>
          </Stack>
        </Paper>
      )}

      {consent && !showBanner && (
        <Button
          variant="outlined"
          size="small"
          onClick={openSettings}
          aria-label="Відкрити налаштування cookie"
          sx={{
            position: "fixed",
            left: 16,
            bottom: 16,
            zIndex: Z_BANNER - 10,
            bgcolor: "#fff",
            textTransform: "none",
          }}
        >
          Налаштування cookie
        </Button>
      )}

      {settingsOpen && (
        <SettingsDialog
          initial={consent}
          onClose={closeSettings}
          onSave={saveConsent}
        />
      )}
    </>
  );
}
