import { Fragment, useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Divider,
  IconButton,
  Chip,
  Alert,
  InputAdornment,
} from "@mui/material";
import {
  Form,
  useLoaderData,
  useNavigation,
  useActionData,
  redirect,
  Link,
} from "react-router-dom";
import { useDropzone } from "react-dropzone";
import {
  GetCountries,
  GetCity,
  GetState,
  GetPhonecodes,
} from "react-country-state-city";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import EuroIcon from "@mui/icons-material/Euro";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import PageHeader from "../PageHeader";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/categories");
    return data;
  } catch (error) {
    toast.error("Помилка завантаження категорій");
    return [];
  }
};

export const action = async ({ request }) => {
  const formData = new FormData();
  const data = await request.formData();
  for (const [key, value] of data.entries()) {
    if (key !== "photos") formData.append(key, value);
  }
  data.getAll("photos").forEach((photo) => formData.append("photos", photo));

  try {
    const response = await customFetch.post("/adv", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (response.status === 201) {
      toast.success(response.data.message);
      return redirect("/profile");
    }
  } catch (error) {
    toast.error(error?.response?.data?.msg || "Помилка публікації");
    return error;
  }
};

// ── Section wrapper ───────────────────────────────────────
const Section = ({ title, children }) => (
  <Box sx={{ mb: 0 }}>
    <Typography
      variant="caption"
      sx={{
        color: "#94A3B8",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        fontSize: "0.65rem",
        display: "block",
        mb: 2,
      }}
    >
      {title}
    </Typography>
    {children}
  </Box>
);

// ── Main component ────────────────────────────────────────
const CreateAdPage = () => {
  const categories = useLoaderData();
  const navigation = useNavigation();
  const actionData = useActionData();
  const isSubmitting = navigation.state === "submitting";

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [phoneCode, setPhoneCode] = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch countries (Europe only)
  useEffect(() => {
    setLoading(true);
    GetCountries()
      .then((r) => setCountries(r.filter((c) => c.region === "Europe")))
      .catch(() => toast.error("Помилка завантаження країн"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;
    setLoading(true);
    const countryObj = countries.find((c) => c.name === selectedCountry);
    if (countryObj) {
      Promise.all([GetState(countryObj.id), GetPhonecodes(countryObj.id)])
        .then(([statesList, code]) => {
          setStates(statesList);
          if (code) setPhoneCode(code);
        })
        .finally(() => setLoading(false));
    }
    setSelectedState("");
    setCities([]);
  }, [selectedCountry, countries]);

  useEffect(() => {
    if (!selectedCountry || !selectedState) return;
    setLoading(true);
    const countryObj = countries.find((c) => c.name === selectedCountry);
    const stateObj = states.find((s) => s.name === selectedState);
    if (countryObj && stateObj) {
      GetCity(countryObj.id, stateObj.id)
        .then(setCities)
        .finally(() => setLoading(false));
    }
    setSelectedCity("");
  }, [selectedState, selectedCountry, countries, states]);

  const handleRemoveImage = useCallback(
    (index) => setPreviewImages((prev) => prev.filter((_, i) => i !== index)),
    [],
  );

  const onDrop = useCallback((acceptedFiles) => {
    const maxSize = 5 * 1024 * 1024;
    const valid = acceptedFiles.filter((f) => {
      if (f.size > maxSize) {
        toast.error(`${f.name} > 5MB`);
        return false;
      }
      return true;
    });
    if (valid.length > 0) {
      setPreviewImages((prev) => {
        const next = [...prev, ...valid.map((f) => URL.createObjectURL(f))];
        if (next.length > 5) {
          toast.warning("Максимум 5 фото");
          return next.slice(0, 5);
        }
        return next;
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    onDrop,
    multiple: true,
    maxFiles: 5,
  });

  const subcategories = useMemo(() => {
    if (!Array.isArray(categories) || !selectedCategoryId) return [];
    return (
      categories.find((c) => c.id === selectedCategoryId)?.SubCategories || []
    );
  }, [categories, selectedCategoryId]);

  const isFormValid =
    selectedCategoryId &&
    selectedSubCategoryId &&
    selectedCountry &&
    selectedState &&
    selectedCity;

  return (
    <Fragment>
      <PageHeader
        title="Нове оголошення"
        subtitle="Заповніть усі обов'язкові поля та опублікуйте оголошення"
        breadcrumbs={[
          { label: "Панель", to: "/dashboard" },
          { label: "Оголошення", to: "/dashboard/posts" },
          { label: "Нове оголошення" },
        ]}
      />

      <Paper sx={{ p: { xs: 2.5, sm: 3.5 }, maxWidth: 860 }}>
        <Form method="post" encType="multipart/form-data">
          {actionData?.error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {actionData.error}
            </Alert>
          )}

          {/* ── Basic info ── */}
          <Section title="Основна інформація">
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  name="title"
                  label="Заголовок оголошення"
                  fullWidth
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required size="small">
                  <InputLabel>Категорія</InputLabel>
                  <Select
                    name="categoryId"
                    label="Категорія"
                    value={selectedCategoryId}
                    onChange={(e) => {
                      setSelectedCategoryId(e.target.value);
                      setSelectedSubCategoryId("");
                    }}
                  >
                    <MenuItem value="">
                      <em>Виберіть категорію</em>
                    </MenuItem>
                    {Array.isArray(categories) &&
                      categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              {selectedCategoryId && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth required size="small">
                    <InputLabel>Підкатегорія</InputLabel>
                    <Select
                      name="subcategoryId"
                      label="Підкатегорія"
                      value={selectedSubCategoryId}
                      onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                    >
                      <MenuItem value="">
                        <em>Виберіть підкатегорію</em>
                      </MenuItem>
                      {subcategories.map((sub) => (
                        <MenuItem key={sub.id} value={sub.id}>
                          {sub.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              <Grid size={{ xs: 12 }}>
                <TextField
                  name="description"
                  label="Опис"
                  fullWidth
                  required
                  multiline
                  rows={4}
                  inputProps={{ minLength: 10, maxLength: 5000 }}
                  helperText="Від 10 до 5000 символів"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  name="price"
                  label="Ціна (необов'язково)"
                  type="number"
                  fullWidth
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EuroIcon sx={{ fontSize: 16, color: "#94A3B8" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Section>

          <Divider sx={{ my: 3 }} />

          {/* ── Location ── */}
          <Section title="Місцезнаходження">
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth required size="small">
                  <InputLabel>Країна</InputLabel>
                  <Select
                    name="country"
                    label="Країна"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                  >
                    {countries.map((c) => (
                      <MenuItem key={c.id} value={c.name}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {selectedCountry && (
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth required size="small">
                    <InputLabel>Регіон</InputLabel>
                    <Select
                      name="state"
                      label="Регіон"
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                    >
                      {states.map((s) => (
                        <MenuItem key={s.id} value={s.name}>
                          {s.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {selectedState && (
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl
                    fullWidth
                    required
                    size="small"
                    disabled={cities.length === 0}
                  >
                    <InputLabel>Місто</InputLabel>
                    <Select
                      name="city"
                      label="Місто"
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                    >
                      {cities.map((c) => (
                        <MenuItem key={c.id} value={c.name}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {loading && (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={14} />
                    <Typography variant="caption" color="text.secondary">
                      Завантаження...
                    </Typography>
                  </Box>
                </Grid>
              )}

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  name="location"
                  label="Точна адреса або квартал"
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </Section>

          <Divider sx={{ my: 3 }} />

          {/* ── Contact ── */}
          <Section title="Контактна інформація">
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  required
                />
              </Grid>
              <Grid size={{ xs: 4, sm: 2 }}>
                <TextField
                  label="Код"
                  value={phoneCode ? `+${phoneCode}` : ""}
                  disabled
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 8, sm: 4 }}>
                <TextField
                  name="phone"
                  label="Телефон"
                  type="tel"
                  fullWidth
                  required
                  helperText="Формат: 0123456789"
                />
              </Grid>
            </Grid>
          </Section>

          <Divider sx={{ my: 3 }} />

          {/* ── Photos ── */}
          <Section title={`Фотографії (${previewImages.length}/5)`}>
            <Box
              {...getRootProps()}
              sx={{
                border: "2px dashed",
                borderColor: isDragActive ? "#2563EB" : "rgba(15,23,42,0.15)",
                borderRadius: 3,
                p: 4,
                textAlign: "center",
                cursor: "pointer",
                bgcolor: isDragActive ? "#EFF6FF" : "#FAFBFC",
                transition: "all 0.2s",
                "&:hover": { borderColor: "#2563EB", bgcolor: "#EFF6FF" },
              }}
            >
              <input {...getInputProps({ name: "photos" })} />
              <CloudUploadOutlinedIcon
                sx={{
                  fontSize: 36,
                  color: isDragActive ? "#2563EB" : "#94A3B8",
                  mb: 1,
                }}
              />
              <Typography
                variant="body2"
                fontWeight={600}
                color={isDragActive ? "primary" : "text.primary"}
              >
                {isDragActive
                  ? "Відпустіть файли тут..."
                  : "Клікніть або перетягніть фото"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                JPG, PNG, WebP — до 5MB кожен, максимум 5 файлів
              </Typography>
            </Box>

            {previewImages.length > 0 && (
              <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                {previewImages.map((url, i) => (
                  <Box
                    key={i}
                    sx={{
                      position: "relative",
                      width: 100,
                      height: 100,
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "2px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    <img
                      src={url}
                      alt={`preview-${i}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    {i === 0 && (
                      <Chip
                        label="Головна"
                        size="small"
                        sx={{
                          position: "absolute",
                          bottom: 4,
                          left: 4,
                          height: 16,
                          fontSize: "0.6rem",
                          bgcolor: "#2563EB",
                          color: "#fff",
                          fontWeight: 700,
                        }}
                      />
                    )}
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveImage(i)}
                      sx={{
                        position: "absolute",
                        top: 3,
                        right: 3,
                        width: 20,
                        height: 20,
                        bgcolor: "rgba(0,0,0,0.65)",
                        color: "#fff",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.85)" },
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 12 }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Section>

          {/* ── Actions ── */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "flex-end",
              mt: 4,
              pt: 3,
              borderTop: "1px solid rgba(15,23,42,0.07)",
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              component={Link}
              to="/profile"
              disabled={isSubmitting}
            >
              Скасувати
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || !isFormValid}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={15} />
                ) : (
                  <SendOutlinedIcon />
                )
              }
            >
              {isSubmitting ? "Публікація..." : "Опублікувати"}
            </Button>
          </Box>
        </Form>
      </Paper>
    </Fragment>
  );
};

export default CreateAdPage;
