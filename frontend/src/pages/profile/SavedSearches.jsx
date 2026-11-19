import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

const PRESET_NAMES = {
  "1_week": "1 тиждень",
  "1_month": "1 місяць",
};

export default function SavedSearches() {
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    query: "",
    categoryId: "",
    minPrice: "",
    maxPrice: "",
    country: "",
    state: "",
    city: "",
  });

  const [categories, setCategories] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await customFetch.get("/saved-searches");
      setSearches(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Не вдалося завантажити збережені пошуки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    customFetch
      .get("/categories")
      .then(({ data }) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const handleChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const createSearch = async () => {
    try {
      await customFetch.post("/saved-searches", {
        name: form.name || null,
        query: form.query || null,
        categoryId: form.categoryId || null,
        minPrice: form.minPrice || null,
        maxPrice: form.maxPrice || null,
        country: form.country || null,
        state: form.state || null,
        city: form.city || null,
      });
      toast.success("Пошук збережено");
      setOpen(false);
      setForm({
        name: "",
        query: "",
        categoryId: "",
        minPrice: "",
        maxPrice: "",
        country: "",
        state: "",
        city: "",
      });
      await load();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Не вдалося зберегти пошук",
      );
    }
  };

  const toggleSearch = async (id, currentlyActive) => {
    setBusyId(id);
    try {
      await customFetch.patch(`/saved-searches/${id}/toggle`);
      await load();
      toast.success(
        currentlyActive ? "Пошук деактивовано" : "Пошук активовано",
      );
    } catch {
      toast.error("Не оновилося");
    } finally {
      setBusyId(null);
    }
  };

  const deleteSearch = async (id) => {
    if (!window.confirm("Видалити цей збережений пошук?")) return;
    setBusyId(id);
    try {
      await customFetch.delete(`/saved-searches/${id}`);
      await load();
      toast.success("Пошук видалено");
    } catch {
      toast.error("Не вдалося видалити");
    } finally {
      setBusyId(null);
    }
  };

  const matches = (ad) => {
    // Это клиентская оценочная функция; фактические совпадения приходят
    // через споивещения сервера.
    return true;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 4 }}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={700}>
          Збережені пошуки
        </Typography>
        <Button
          variant="contained"
          startIcon={<ToggleOnIcon />}
          onClick={() => setOpen(true)}
          sx={{ bgcolor: "#0057B8", fontWeight: 600, textTransform: "none" }}
        >
          Зберегти поточний пошук
        </Button>
      </Stack>

      {searches.length === 0 && (
        <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
          <Typography color="text.secondary">
            У вас немає збережених пошуків. Ми повідомимо, якщо з'явиться
            нове оголошення, що відповідає вашим критеріям.
          </Typography>
        </Stack>
      )}

      <Stack spacing={2}>
        {searches.map((s) => {
          const active = s.isActive;
          const busy = busyId === s.id;
          return (
            <Paper
              key={s.id}
              sx={{ p: 3, borderRadius: 3, position: "relative" }}
            >
              <Stack direction="row" justifyContent="space-between" gap={2}>
                <Box>
                  <Typography
                    fontWeight={700}
                    sx={{ mb: 0.5, display: "block" }}
                  >
                    {s.name || "Без назви"}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {s.query && (
                      <Chip
                        size="small"
                        label={`Пошук: "${s.query}"`}
                        sx={{ fontSize: "0.72rem" }}
                      />
                    )}
                    {s.categoryId && (
                      <Chip
                        size="small"
                        label="Категорія"
                        sx={{ fontSize: "0.72rem", bgcolor: "#eff6ff" }}
                      />
                    )}
                    {[s.minPrice, s.maxPrice]
                      .filter(Boolean)
                      .length > 0 && (
                      <Chip
                        size="small"
                        label={`Ціна ${
                          s.minPrice ? "від " + s.minPrice : ""
                        }${s.maxPrice ? " до " + s.maxPrice : ""} €`}
                        sx={{ fontSize: "0.72rem" }}
                      />
                    )}
                    {[s.country, s.state, s.city]
                      .filter(Boolean)
                      .length > 0 && (
                      <Chip
                        size="small"
                        label={`Місце: ${[s.country, s.state, s.city].filter(Boolean).join(", ")}`}
                        sx={{ fontSize: "0.72rem" }}
                      />
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {active ? "Активно — ви отримаєте сповіщення" : "Вимкнено"}
                    {s.lastNotifiedAt
                      ? ` · останнє сповіщення ${new Date(s.lastNotifiedAt).toLocaleDateString("uk-UA")}`
                      : ""}
                  </Typography>
                </Box>
                <Stack direction="row" gap={1} alignItems="center">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={active}
                        onChange={() => toggleSearch(s.id, active)}
                        disabled={busy}
                        sx={{ width: 42 }}
                      />
                    }
                    label={active ? "Активно" : "Вимкнено"}
                    labelPlacement="start"
                    sx={{ ml: -1 }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => deleteSearch(s.id)}
                    disabled={busy}
                    sx={{ color: busy ? "#94a3b8" : "#ef4444" }}
                  >
                    <Tooltip title="Видалити">
                      <DeleteIcon fontSize="small" />
                    </Tooltip>
                  </IconButton>
                </Stack>
              </Stack>
            </Paper>
          );
        })}
      </Stack>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Зберегти пошук</DialogTitle>
        <DialogContent sx={{ py: 0 }}>
          <Stack spacing={2} sx={{ p: 1 }}>
            <TextField
              fullWidth
              label="Назва (за бажанням)"
              value={form.name}
              onChange={handleChange("name")}
            />
            <TextField
              fullWidth
              label="Ключове слово / опис"
              value={form.query}
              onChange={handleChange("query")}
            />
            <FormControl fullWidth>
              <InputLabel>Категорія</InputLabel>
              <Select
                value={form.categoryId}
                onChange={handleChange("categoryId")}
                label="Категорія"
              >
                <MenuItem value="">Всі категорії</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                size="small"
                label="Ціна від (€)"
                type="number"
                value={form.minPrice}
                onChange={handleChange("minPrice")}
                sx={{ flex: 1 }}
              />
              <TextField
                size="small"
                label="Ціна до (€)"
                type="number"
                value={form.maxPrice}
                onChange={handleChange("maxPrice")}
                sx={{ flex: 1 }}
              />
            </Box>
            <TextField
              fullWidth
              label="Країна"
              value={form.country}
              onChange={handleChange("country")}
            />
            <TextField
              fullWidth
              label="Регіон / область"
              value={form.state}
              onChange={handleChange("state")}
            />
            <TextField
              fullWidth
              label="Місто"
              value={form.city}
              onChange={handleChange("city")}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpen(false)}>Скасувати</Button>
          <Button variant="contained" onClick={createSearch}>
            Зберегти
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
