import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Alert,
  Divider,
  CircularProgress,
} from "@mui/material";
import { PageHeader } from "../../components";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

const PRESET_LABELS = {
  "1_week": "1 тиждень",
  "1_month": "1 місяць",
  custom: "Власна тривалість",
};

const ACTION_LABELS = {
  archive: "Архівувати",
  hide: "Приховати (неактивне)",
  delete: "Видалити назавжди",
};

export default function AdExpirationSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    customFetch
      .get("/admin/ad-expiration-settings")
      .then(({ data }) => setSettings(data))
      .catch((err) =>
        toast.error(
          err?.response?.data?.message || "Помилка завантаження налаштувань",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await customFetch.put(
        "/admin/ad-expiration-settings",
        settings,
      );
      setSettings(data);
      toast.success("Налаштування збережено");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Помилка збереження");
    } finally {
      setSaving(false);
    }
  };

  const handleRunNow = async () => {
    setRunning(true);
    try {
      const { data } = await customFetch.post(
        "/admin/ad-expiration-settings/run-now",
      );
      if (data.skipped) {
        toast.info("Функцію вимкнено — нічого не оброблено");
      } else {
        toast.success(`Оброблено ${data.processed} з ${data.total} оголошень`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Помилка виконання");
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!settings) {
    return <Alert severity="error">Не вдалося завантажити налаштування</Alert>;
  }

  return (
    <Box>
      <PageHeader
        title="Закінчення терміну дії оголошень"
        subtitle="Автоматична обробка прострочених оголошень"
        breadcrumbs={[
          { label: "Панель", to: "/dashboard" },
          { label: "Налаштування", to: "/dashboard/settings" },
          { label: "Термін дії оголошень" },
        ]}
      />

      <Paper sx={{ p: { xs: 3, md: 4 }, maxWidth: 640, borderRadius: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              Автоматична обробка
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Якщо вимкнено, прострочені оголошення залишаються активними
            </Typography>
          </Box>
          <Switch
            checked={settings.enabled}
            onChange={(e) =>
              setSettings((s) => ({ ...s, enabled: e.target.checked }))
            }
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Тривалість до закінчення терміну</InputLabel>
          <Select
            label="Тривалість до закінчення терміну"
            value={settings.durationPreset}
            onChange={(e) =>
              setSettings((s) => ({ ...s, durationPreset: e.target.value }))
            }
            disabled={!settings.enabled}
          >
            {Object.entries(PRESET_LABELS).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {settings.durationPreset === "custom" && (
          <TextField
            fullWidth
            type="number"
            label="Кількість днів"
            value={settings.durationDays}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                durationDays: parseInt(e.target.value, 10) || 1,
              }))
            }
            inputProps={{ min: 1, max: 365 }}
            disabled={!settings.enabled}
            sx={{ mb: 3 }}
          />
        )}

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Дія при закінченні терміну</InputLabel>
          <Select
            label="Дія при закінченні терміну"
            value={settings.action}
            onChange={(e) =>
              setSettings((s) => ({ ...s, action: e.target.value }))
            }
            disabled={!settings.enabled}
          >
            {Object.entries(ACTION_LABELS).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {settings.action === "delete" && settings.enabled && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Видалені оголошення не можна відновити. Фото будуть видалені з
            Cloudinary.
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? "Збереження..." : "Зберегти"}
          </Button>
          <Button
            variant="outlined"
            onClick={handleRunNow}
            disabled={running || !settings.enabled}
          >
            {running ? "Виконання..." : "Запустити зараз (тест)"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
