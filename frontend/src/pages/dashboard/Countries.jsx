// frontend/src/pages/dashboard/Countries.jsx
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { PageHeader } from "../../components";
import customFetch from "../../utils/customFetch";
import { invalidatePublishedCountries } from "../../hooks/usePublishedCountries";
import { toast } from "react-toastify";

const STALE_DAYS = 180;

// Назви категорій для відображення (ключі збігаються з бекендом)
const CATEGORY_LABELS = {
  government: "Офіційна інформація",
  residence: "Проживання та документи",
  benefits: "Допомога та виплати",
  work: "Робота",
  health: "Медицина",
  education: "Освіта",
  family: "Сім'я",
  transport: "Транспорт",
  finance: "Фінанси",
  consulate: "Посольство та консульства",
};

const EMPTY_LINK = {
  category: "government",
  title: "",
  url: "",
  description: "",
  sortOrder: 0,
};

const errorText = (error) =>
  error?.response?.data?.message || "Сталася помилка";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("uk-UA") : "—";

const isStale = (value) =>
  !value || Date.now() - new Date(value).getTime() > STALE_DAYS * 86400000;

/* ─────────────── Посилання ─────────────── */

function LinkRow({ link, categories, onReload }) {
  const [draft, setDraft] = useState({
    category: link.category,
    title: link.title,
    url: link.url,
    description: link.description || "",
    sortOrder: link.sortOrder,
  });
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) =>
    setDraft((d) => ({ ...d, [key]: e.target.value }));

  const save = async () => {
    setBusy(true);
    try {
      await customFetch.put(`/countries/links/${link.id}`, {
        ...draft,
        sortOrder: Number(draft.sortOrder) || 0,
      });
      toast.success("Посилання збережено");
      onReload();
    } catch (error) {
      toast.error(errorText(error));
    } finally {
      setBusy(false);
    }
  };

  const verifyToday = async () => {
    setBusy(true);
    try {
      await customFetch.patch(`/countries/links/${link.id}/verify`);
      toast.success("Дату перевірки оновлено");
      onReload();
    } catch (error) {
      toast.error(errorText(error));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Видалити посилання «${link.title}»?`)) return;
    setBusy(true);
    try {
      await customFetch.delete(`/countries/links/${link.id}`);
      toast.success("Посилання видалено");
      onReload();
    } catch (error) {
      toast.error(errorText(error));
      setBusy(false);
    }
  };

  const stale = isStale(link.lastVerifiedAt);

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Stack
        direction="row"
        sx={{ mb: 1.5, justifyContent: "space-between", alignItems: "center" }}
      >
        <Stack direction="row" gap={1} sx={{ alignItems: "center" }}>
          <Typography variant="caption" color="text.secondary">
            Перевірено: {formatDate(link.lastVerifiedAt)}
          </Typography>
          {stale && (
            <Chip
              size="small"
              color="warning"
              label={`Старше ${STALE_DAYS} днів`}
            />
          )}
        </Stack>
        <Stack direction="row" gap={0.5}>
          <Tooltip title="Перевірено сьогодні">
            <span>
              <IconButton size="small" onClick={verifyToday} disabled={busy}>
                <VerifiedOutlinedIcon fontSize="small" color="success" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Видалити">
            <span>
              <IconButton size="small" onClick={remove} disabled={busy}>
                <DeleteIcon fontSize="small" color="error" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Категорія"
            value={draft.category}
            onChange={set("category")}
          >
            {categories.map((key) => (
              <MenuItem key={key} value={key}>
                {CATEGORY_LABELS[key] || key}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Назва"
            value={draft.title}
            onChange={set("title")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Порядок"
            value={draft.sortOrder}
            onChange={set("sortOrder")}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            size="small"
            label="Посилання (https://...)"
            value={draft.url}
            onChange={set("url")}
            helperText="Зміна адреси вважається новою перевіркою джерела"
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            size="small"
            multiline
            minRows={2}
            label="Опис"
            value={draft.description}
            onChange={set("description")}
          />
        </Grid>
        <Grid size={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            size="small"
            variant="contained"
            startIcon={<SaveOutlinedIcon />}
            onClick={save}
            disabled={busy}
          >
            Зберегти посилання
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

function NewLinkForm({ countryCode, categories, onReload }) {
  const [draft, setDraft] = useState(EMPTY_LINK);
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) =>
    setDraft((d) => ({ ...d, [key]: e.target.value }));

  const add = async () => {
    setBusy(true);
    try {
      await customFetch.post(`/countries/${countryCode}/links`, {
        ...draft,
        sortOrder: Number(draft.sortOrder) || 0,
      });
      toast.success("Посилання додано");
      setDraft(EMPTY_LINK);
      onReload();
    } catch (error) {
      toast.error(errorText(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, borderRadius: 2, bgcolor: "#f8fafc" }}
    >
      <Typography fontWeight={700} mb={1.5}>
        Нове посилання
      </Typography>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Категорія"
            value={draft.category}
            onChange={set("category")}
          >
            {categories.map((key) => (
              <MenuItem key={key} value={key}>
                {CATEGORY_LABELS[key] || key}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Назва"
            value={draft.title}
            onChange={set("title")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Порядок"
            value={draft.sortOrder}
            onChange={set("sortOrder")}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            size="small"
            label="Посилання (https://...)"
            value={draft.url}
            onChange={set("url")}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            size="small"
            multiline
            minRows={2}
            label="Опис"
            value={draft.description}
            onChange={set("description")}
          />
        </Grid>
        <Grid size={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={add}
            disabled={busy || !draft.title || !draft.url}
          >
            Додати посилання
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

/* ─────────────── Країна ─────────────── */

function CountryForm({ country, onReload }) {
  const [form, setForm] = useState({
    name: country.name,
    flag: country.flag || "",
    disclaimer: country.disclaimer || "",
    isPublished: country.isPublished,
  });
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    setBusy(true);
    try {
      await customFetch.put(`/countries/${country.code}`, form);
      toast.success("Країну збережено");
      onReload();
    } catch (error) {
      toast.error(errorText(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Stack direction="row" mb={2} sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight={700}>
          {country.code} · {country.name}
        </Typography>
        <Chip
          size="small"
          label={form.isPublished ? "Опубліковано" : "Чернетка"}
          color={form.isPublished ? "success" : "default"}
        />
      </Stack>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 8 }}>
          <TextField
            fullWidth
            size="small"
            label="Назва"
            value={form.name}
            onChange={set("name")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            size="small"
            label="Прапор (емодзі)"
            value={form.flag}
            onChange={set("flag")}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            fullWidth
            size="small"
            multiline
            minRows={2}
            label="Застереження на сторінці країни"
            value={form.disclaimer}
            onChange={set("disclaimer")}
          />
        </Grid>
        <Grid size={12}>
          <FormControlLabel
            control={
              <Switch
                checked={form.isPublished}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isPublished: e.target.checked }))
                }
              />
            }
            label="Показувати на сайті"
          />
        </Grid>
        <Grid size={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            startIcon={<SaveOutlinedIcon />}
            onClick={save}
            disabled={busy}
          >
            Зберегти країну
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

/* ─────────────── Сторінка ─────────────── */

export default function Countries() {
  const [countries, setCountries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCode, setSelectedCode] = useState(null);
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");

  const load = async () => {
    invalidatePublishedCountries();
    try {
      const { data } = await customFetch.get("/countries/admin/all");
      setCountries(data.countries);
      setCategories(data.categories);
    } catch (error) {
      toast.error(errorText(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const selected = countries.find((c) => c.code === selectedCode) || null;

  const createCountry = async () => {
    try {
      const code = newCode.trim().toUpperCase();
      await customFetch.post("/countries", {
        code,
        name: newName.trim(),
        isPublished: false,
      });
      toast.success("Країну створено як чернетку");
      setNewCode("");
      setNewName("");
      setSelectedCode(code);
      await load();
    } catch (error) {
      toast.error(errorText(error));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Країни"
        subtitle="Сторінки країн і посилання на офіційні джерела"
        breadcrumbs={[
          { label: "Панель", to: "/dashboard" },
          { label: "Країни" },
        ]}
      />

      <Grid container spacing={3}>
        {/* Список країн */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2, borderRadius: 3, mb: 2 }}>
            <Stack gap={1.5}>
              {countries.length === 0 && (
                <Typography color="text.secondary">Країн ще немає</Typography>
              )}
              {countries.map((c) => (
                <Box
                  key={c.code}
                  onClick={() => setSelectedCode(c.code)}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor:
                      c.code === selectedCode ? "primary.main" : "#e2e8f0",
                    bgcolor:
                      c.code === selectedCode ? "#EFF6FF" : "transparent",
                  }}
                >
                  <Stack
                    direction="row"
                    sx={{ justifyContent: "space-between" }}
                  >
                    <Typography fontWeight={600}>
                      {c.flag ? `${c.flag} ` : ""}
                      {c.name}
                    </Typography>
                    <Chip
                      size="small"
                      label={c.isPublished ? "Публічна" : "Чернетка"}
                      color={c.isPublished ? "success" : "default"}
                    />
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {c.code} · посилань: {c.links?.length || 0}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography fontWeight={700} mb={1}>
              Нова країна
            </Typography>
            <Stack gap={1.5}>
              <TextField
                size="small"
                label="Код (2 літери, напр. DE)"
                value={newCode}
                onChange={(e) =>
                  setNewCode(e.target.value.slice(0, 2).toUpperCase())
                }
                slotProps={{
                  htmlInput: {
                    maxLength: 2,
                  },
                }}
              />
              <TextField
                size="small"
                label="Назва"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={createCountry}
                disabled={newCode.length !== 2 || !newName.trim()}
              >
                Створити
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Редактор */}
        <Grid size={{ xs: 12, md: 8 }}>
          {!selected ? (
            <Alert severity="info">
              Виберіть країну зі списку або створіть нову.
            </Alert>
          ) : (
            <>
              <CountryForm
                key={`country-${selected.code}-${selected.updatedAt}`}
                country={selected}
                onReload={load}
              />

              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight={700} mb={2}>
                  Посилання
                </Typography>

                <Stack gap={2} mb={3}>
                  {(selected.links || []).length === 0 && (
                    <Typography color="text.secondary">
                      Посилань ще немає
                    </Typography>
                  )}
                  {(selected.links || []).map((link) => (
                    <LinkRow
                      key={`${link.id}-${link.updatedAt}`}
                      link={link}
                      categories={categories}
                      onReload={load}
                    />
                  ))}
                </Stack>

                <NewLinkForm
                  countryCode={selected.code}
                  categories={categories}
                  onReload={load}
                />
              </Paper>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
