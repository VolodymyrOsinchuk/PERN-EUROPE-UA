import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Grid,
  Avatar,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import PageHeader from "../PageHeader";

const SectionCard = ({ icon, title, subtitle, children }) => (
  <Paper sx={{ mb: 3, overflow: "hidden" }}>
    <Box
      sx={{
        px: 3,
        py: 2.5,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        borderBottom: "1px solid rgba(15,23,42,0.07)",
        bgcolor: "#FAFBFC",
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "10px",
          bgcolor: "#EFF6FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#2563EB",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="subtitle1">{title}</Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
    <Box sx={{ p: 3 }}>{children}</Box>
  </Paper>
);

const Settings = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [notifications, setNotifications] = useState({
    newUser: true,
    newAd: true,
    newEvent: false,
    systemAlerts: true,
    weeklyReport: false,
  });
  const [profile, setProfile] = useState({
    name: "Адміністратор",
    email: "admin@diaspora.ua",
    language: "uk",
  });
  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: "60",
  });

  const showSuccess = (message) =>
    setSnackbar({ open: true, message: message, severity: "success" });

  const handleProfileSave = (e) => {
    e.preventDefault();
    showSuccess("Профіль оновлено успішно");
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    showSuccess("Пароль змінено успішно");
  };

  const handleNotifSave = () => showSuccess("Налаштування сповіщень збережено");
  const handleSecuritySave = () =>
    showSuccess("Налаштування безпеки збережено");

  return (
    <Box sx={{ maxWidth: 780 }}>
      <PageHeader
        title="Налаштування"
        subtitle="Керуйте профілем, безпекою та налаштуваннями системи"
        breadcrumbs={[
          { label: "Панель", to: "/dashboard" },
          { label: "Налаштування" },
        ]}
      />

      {/* Profile */}
      <SectionCard
        icon={
          <span className="material-icons" style={{ fontSize: 18 }}>
            person_outline
          </span>
        }
        title="Профіль адміністратора"
        subtitle="Ваші особисті дані та мова інтерфейсу"
      >
        <Box
          component="form"
          onSubmit={handleProfileSave}
          sx={{ display: "flex", flexDirection: "column", gap: 0 }}
        >
          {/* Avatar row */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, mb: 3 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: "#EFF6FF",
                color: "#2563EB",
                fontSize: "1.4rem",
                fontWeight: 700,
                border: "3px solid #DBEAFE",
              }}
            >
              {profile.name?.[0] ?? "А"}
            </Avatar>
            <Box>
              <Button variant="outlined" size="small" sx={{ mr: 1 }}>
                Змінити фото
              </Button>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mt: 0.5 }}
              >
                JPG, PNG — до 2MB
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Ім'я"
                fullWidth
                value={profile.name}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, name: e.target.value }))
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={profile.email}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, email: e.target.value }))
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Мова інтерфейсу</InputLabel>
                <Select
                  value={profile.language}
                  label="Мова інтерфейсу"
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, language: e.target.value }))
                  }
                >
                  <MenuItem value="uk">🇺🇦 Українська</MenuItem>
                  <MenuItem value="fr">🇫🇷 Français</MenuItem>
                  <MenuItem value="en">🇬🇧 English</MenuItem>
                  <MenuItem value="de">🇩🇪 Deutsch</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveOutlinedIcon />}
            >
              Зберегти профіль
            </Button>
          </Box>
        </Box>
      </SectionCard>

      {/* Password */}
      <SectionCard
        icon={<LockOutlinedIcon sx={{ fontSize: 18 }} />}
        title="Зміна пароля"
        subtitle="Використовуйте надійний пароль (мінімум 8 символів)"
      >
        <Box component="form" onSubmit={handlePasswordSave}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Поточний пароль"
                type="password"
                fullWidth
                required
                autoComplete="current-password"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Новий пароль"
                type="password"
                fullWidth
                required
                inputProps={{ minLength: 8 }}
                helperText="Мінімум 8 символів"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Підтвердити пароль"
                type="password"
                fullWidth
                required
              />
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<LockOutlinedIcon />}
            >
              Змінити пароль
            </Button>
          </Box>
        </Box>
      </SectionCard>

      {/* Notifications */}
      <SectionCard
        icon={<NotificationsOutlinedIcon sx={{ fontSize: 18 }} />}
        title="Сповіщення"
        subtitle="Виберіть, про що ви хочете отримувати сповіщення"
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {[
            {
              key: "newUser",
              label: "Новий користувач зареєстровано",
              desc: "Email-сповіщення при реєстрації",
            },
            {
              key: "newAd",
              label: "Нове оголошення опубліковано",
              desc: "Сповіщення при публікації оголошення",
            },
            {
              key: "newEvent",
              label: "Нова подія додана",
              desc: "Сповіщення при додаванні події",
            },
            {
              key: "systemAlerts",
              label: "Системні сповіщення",
              desc: "Помилки та попередження системи",
            },
            {
              key: "weeklyReport",
              label: "Щотижневий звіт",
              desc: "Статистика за тиждень на email",
            },
          ].map(({ key, label, desc }) => (
            <Box
              key={key}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1.5,
                borderBottom: "1px solid rgba(15,23,42,0.05)",
                "&:last-child": { borderBottom: "none" },
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {desc}
                </Typography>
              </Box>
              <Switch
                checked={notifications[key]}
                onChange={(e) =>
                  setNotifications((n) => ({ ...n, [key]: e.target.checked }))
                }
                size="small"
              />
            </Box>
          ))}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2.5 }}>
          <Button
            variant="contained"
            startIcon={<SaveOutlinedIcon />}
            onClick={handleNotifSave}
          >
            Зберегти
          </Button>
        </Box>
      </SectionCard>

      {/* Security */}
      <SectionCard
        icon={<SecurityOutlinedIcon sx={{ fontSize: 18 }} />}
        title="Безпека"
        subtitle="Двофакторна автентифікація та управління сесіями"
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              bgcolor: "#F8FAFC",
              borderRadius: 2,
              border: "1px solid rgba(15,23,42,0.07)",
            }}
          >
            <Box>
              <Typography variant="body2" fontWeight={600}>
                Двофакторна автентифікація (2FA)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Додатковий рівень захисту для вашого акаунта
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {security.twoFactor && (
                <Chip
                  label="Активно"
                  size="small"
                  sx={{
                    bgcolor: "#ECFDF5",
                    color: "#065F46",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                  }}
                />
              )}
              <Switch
                checked={security.twoFactor}
                onChange={(e) =>
                  setSecurity((s) => ({ ...s, twoFactor: e.target.checked }))
                }
              />
            </Box>
          </Box>

          <Box sx={{ maxWidth: 280 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Тайм-аут сесії</InputLabel>
              <Select
                value={security.sessionTimeout}
                label="Тайм-аут сесії"
                onChange={(e) =>
                  setSecurity((s) => ({ ...s, sessionTimeout: e.target.value }))
                }
              >
                <MenuItem value="15">15 хвилин</MenuItem>
                <MenuItem value="30">30 хвилин</MenuItem>
                <MenuItem value="60">1 година</MenuItem>
                <MenuItem value="240">4 години</MenuItem>
                <MenuItem value="0">Без обмежень</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Alert severity="info" sx={{ borderRadius: 2 }}>
            Останній вхід: сьогодні о 09:42 з IP 185.234.xx.xx (Париж, Франція)
          </Alert>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              startIcon={<SaveOutlinedIcon />}
              onClick={handleSecuritySave}
            >
              Зберегти
            </Button>
          </Box>
        </Box>
      </SectionCard>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;
