// frontend/src/pages/dashboard/PublicationForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { PageHeader } from "../../components";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import COUNTRIES_DATA from "../../data/countries.json";
import { getPublishableCountries } from "../../data/validateCountries";
import { CATEGORY_LABELS } from "../../data/publicationCategories";

const INITIAL = {
  title: "",
  category: "",
  countryCode: "",
  readTime: "",
  sourceName: "",
  sourceUrl: "",
  content: "",
  publish: false,
  sourceChecked: false,
};

const toFormState = (pub) =>
  pub
    ? {
        title: pub.title || "",
        category: pub.category || "",
        countryCode: pub.countryCode || "",
        readTime: pub.readTime || "",
        sourceName: pub.sourceName || "",
        sourceUrl: pub.sourceUrl || "",
        content: pub.content || "",
        publish: pub.status === "published",
        sourceChecked: false, // завжди заново: підтвердження має бути свіжим
      }
    : INITIAL;

export default function PublicationForm({
  mode = "create",
  publication = null,
  returnTo = "/dashboard/posts",
  isStaff = false,
}) {
  const navigate = useNavigate();
  const isEdit = mode === "edit";

  const [form, setForm] = useState(() => toFormState(publication));

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const publishable = new Set(
    getPublishableCountries(COUNTRIES_DATA).map((c) => c.code),
  );
  const countries = COUNTRIES_DATA.countries;

  const set = (field) => (e) => {
    const value =
      e.target.type === "checkbox"
        ? e.target.checked
        : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (form.title.trim().length < 3) e.title = "Мінімум 3 символи";
    if (!form.category) e.category = "Оберіть категорію";
    if (form.content.trim().length < 10) e.content = "Мінімум 10 символів";
    if (form.sourceUrl) {
      try {
        if (new URL(form.sourceUrl).protocol !== "https:") throw new Error();
      } catch {
        e.sourceUrl = "Потрібна https-адреса";
      }
    }
    if (form.publish && form.sourceUrl && !form.sourceChecked) {
      e.sourceChecked =
        "Щоб опублікувати зі джерелом, підтвердіть його перевірку";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async (extra = {}) => {
    if (!validate()) return;

    setSaving(true);

    try {
      const payload = {
        ...form,
        countryCode: form.countryCode || null,
        sourceName: form.sourceName || null,
        sourceUrl: form.sourceUrl || null,
        readTime: form.readTime || null,
        publish: isStaff ? form.publish : false,
        sourceChecked: isStaff ? form.sourceChecked : false,
        submit: !!extra.submit,
      };

      if (isEdit) {
        await customFetch.put(`/publications/${publication.id}`, payload);
      } else {
        await customFetch.post("/publications", payload);
      }

      toast.success(
        extra.submit
          ? "Надіслано на перевірку"
          : isStaff && form.publish
            ? "Публікацію опубліковано"
            : "Чернетку збережено",
      );

      navigate(returnTo);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Помилка збереження");
    } finally {
      setSaving(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    save();
  };

  useEffect(() => {
    setForm(toFormState(publication));
  }, [publication]);

  const selectedCountry = countries.find((c) => c.code === form.countryCode);
  const countryReady = selectedCountry && publishable.has(selectedCountry.code);

  return (
    <Box>
      <PageHeader
        title={isEdit ? "Редагування публікації" : "Нова публікація"}
        subtitle="Стаття з прив'язкою до країни і джерела"
        breadcrumbs={[
          { label: "Панель", to: "/dashboard" },
          { label: "Публікації", to: "/dashboard/posts" },
          { label: isEdit ? "Редагування" : "Нова" },
        ]}
      />

      <Paper
        component="form"
        onSubmit={onSubmit}
        sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, maxWidth: 760 }}
      >
        <Stack spacing={2.5}>
          <TextField
            label="Заголовок"
            value={form.title}
            onChange={set("title")}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            required
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl fullWidth required error={!!errors.category}>
              <InputLabel>Категорія</InputLabel>
              <Select
                label="Категорія"
                value={form.category}
                onChange={set("category")}
              >
                {CATEGORY_LABELS.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <FormHelperText>{errors.category}</FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Країна</InputLabel>
              <Select
                label="Країна"
                value={form.countryCode}
                onChange={set("countryCode")}
              >
                <MenuItem value="">
                  <em>Загальна стаття (без країни)</em>
                </MenuItem>
                {countries.map((c) => (
                  <MenuItem key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {!form.countryCode
                  ? "Стаття з'явиться лише в загальному списку"
                  : countryReady
                    ? "Сторінка країни відкрита, стаття з'явиться на ній"
                    : "Сторінка країни ще не перевірена, тому на ній стаття поки не видна"}
              </FormHelperText>
            </FormControl>
          </Stack>

          <TextField
            label="Час читання"
            placeholder="напр. 8 хв"
            value={form.readTime}
            onChange={set("readTime")}
            sx={{ maxWidth: 220 }}
          />

          <Typography variant="subtitle2" sx={{ mt: 1 }}>
            Джерело
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Назва джерела"
              placeholder="напр. Service-Public.fr"
              value={form.sourceName}
              onChange={set("sourceName")}
              fullWidth
            />
            <TextField
              label="Посилання на джерело"
              placeholder="https://..."
              value={form.sourceUrl}
              onChange={set("sourceUrl")}
              error={!!errors.sourceUrl}
              helperText={errors.sourceUrl}
              fullWidth
            />
          </Stack>

          <TextField
            label="Текст"
            value={form.content}
            onChange={set("content")}
            error={!!errors.content}
            helperText={
              errors.content ||
              "Проста українська мова. Цифри, строки й вимоги — лише з джерела."
            }
            multiline
            minRows={10}
            fullWidth
            required
          />

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "#f8fafc",
              border: "1px solid #e2e8f0",
            }}
          >
            {/* Перемикач публікації — тільки для адміністрації */}
            {isStaff && (
              <FormControlLabel
                control={
                  <Switch checked={form.publish} onChange={set("publish")} />
                }
                label={
                  form.publish ? "Опублікувати одразу" : "Зберегти як чернетку"
                }
              />
            )}

            {/* Підтвердження перевірки джерела */}
            {form.sourceUrl && (
              <FormControlLabel
                sx={{ display: "flex", mt: 1 }}
                control={
                  <Checkbox
                    checked={form.sourceChecked}
                    onChange={set("sourceChecked")}
                  />
                }
                label="Я відкрив джерело і переконався, що інформація актуальна"
              />
            )}

            {errors.sourceChecked && (
              <FormHelperText error sx={{ ml: 0 }}>
                {errors.sourceChecked}
              </FormHelperText>
            )}

            {isStaff && form.publish && !form.sourceUrl && (
              <Chip
                size="small"
                color="warning"
                sx={{ mt: 1 }}
                label="Без джерела стаття опублікується без позначки перевірки"
              />
            )}
          </Box>

          <Stack direction="row" spacing={1.5} justifyContent="flex-end">
            <Button
              component={Link}
              to={returnTo}
              color="inherit"
              variant="outlined"
            >
              Скасувати
            </Button>
            {!isStaff && (
              <Button
                variant="outlined"
                disabled={saving}
                onClick={() => save({ submit: true })}
              >
                Надіслати на перевірку
              </Button>
            )}
            <Button type="submit" variant="contained" disabled={saving}>
              {saving
                ? "Збереження..."
                : isStaff && form.publish
                  ? "Опублікувати"
                  : "Зберегти чернетку"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
