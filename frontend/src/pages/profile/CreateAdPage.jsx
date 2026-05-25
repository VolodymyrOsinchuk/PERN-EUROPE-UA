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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  LinearProgress,
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
import { GetCountries, GetCity, GetState } from "react-country-state-city";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import EuroIcon from "@mui/icons-material/Euro";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

/* ── Loader / Action ── */
export const loader = async () => {
  try {
    const { data } = await customFetch.get("/categories");
    return data;
  } catch {
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
    toast.error(error?.response?.data?.message || "Помилка публікації");
    return error;
  }
};

/* ── Design tokens ── */
const F_BODY = "'Plus Jakarta Sans', sans-serif";
const F_DISPLAY = "'Playfair Display', serif";
const BLUE = "#0057B8";
const GOLD = "#FFD700";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    fontFamily: F_BODY,
    bgcolor: "#f8fafc",
    "& fieldset": { borderColor: "#e2e8f0" },
    "&:hover fieldset": { borderColor: BLUE },
    "&.Mui-focused fieldset": { borderColor: BLUE, borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: BLUE },
  "& .MuiInputLabel-root": { fontFamily: F_BODY },
  "& .MuiFormHelperText-root": { fontFamily: F_BODY, fontSize: "0.75rem" },
};

const selectSx = {
  borderRadius: "12px",
  fontFamily: F_BODY,
  bgcolor: "#f8fafc",
  "& fieldset": { borderColor: "#e2e8f0" },
  "&:hover fieldset": { borderColor: BLUE },
  "&.Mui-focused fieldset": { borderColor: BLUE },
};

/* ── Step section wrapper ── */
function StepSection({ number, title, subtitle, completed, children }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "20px",
        border: `1.5px solid ${completed ? "#a7f3d0" : "#e2e8f0"}`,
        overflow: "hidden",
        boxShadow: completed
          ? "0 4px 20px rgba(16,185,129,.08)"
          : "0 4px 24px rgba(0,87,184,.05)",
        transition: "border-color 0.3s ease",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: { xs: 3, md: 4 },
          py: 2.5,
          borderBottom: `1px solid ${completed ? "#a7f3d0" : "#f1f5f9"}`,
          bgcolor: completed ? "#f0fdf4" : "#fafbfc",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            bgcolor: completed ? "#10b981" : BLUE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background 0.3s ease",
          }}
        >
          {completed ? (
            <CheckCircleIcon sx={{ fontSize: 18, color: "#fff" }} />
          ) : (
            <Typography
              sx={{
                fontFamily: F_BODY,
                fontWeight: 800,
                fontSize: "0.85rem",
                color: "#fff",
              }}
            >
              {number}
            </Typography>
          )}
        </Box>
        <Box>
          <Typography
            sx={{
              fontFamily: F_BODY,
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "#0f172a",
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              sx={{ fontFamily: F_BODY, fontSize: "0.78rem", color: "#64748b" }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      {/* Body */}
      <Box sx={{ p: { xs: 3, md: 4 } }}>{children}</Box>
    </Paper>
  );
}

/* ── Main Component ── */
export default function CreateAdPage() {
  const categories = useLoaderData();
  const navigation = useNavigation();
  const actionData = useActionData();
  const isSubmitting = navigation.state === "submitting";

  /* Location state */
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCatId, setSelectedSubCatId] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [phoneCode, setPhoneCode] = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);

  /* Load European countries */
  useEffect(() => {
    setLocationLoading(true);
    GetCountries()
      .then((all) => setCountries(all.filter((c) => c.region === "Europe")))
      .catch(() => toast.error("Помилка завантаження країн"))
      .finally(() => setLocationLoading(false));
  }, []);

  /* Load states when country changes */
  useEffect(() => {
    if (!selectedCountry) return;
    setLocationLoading(true);
    const countryObj = countries.find((c) => c.name === selectedCountry);
    if (!countryObj) return;

    GetState(countryObj.id)
      .then((statesList) => {
        setStates(statesList);
        if (countryObj.phone_code) setPhoneCode(countryObj.phone_code);
        setSelectedState("");
        setCities([]);
        setSelectedCity("");
      })
      .catch(() => toast.error("Помилка завантаження регіонів"))
      .finally(() => setLocationLoading(false));
  }, [selectedCountry, countries]);

  /* Load cities when state changes */
  useEffect(() => {
    if (!selectedCountry || !selectedState) return;
    setLocationLoading(true);
    const countryObj = countries.find((c) => c.name === selectedCountry);
    const stateObj = states.find((s) => s.name === selectedState);
    if (!countryObj || !stateObj) return;
    GetCity(countryObj.id, stateObj.id)
      .then((list) => {
        setCities(list);
        setSelectedCity("");
      })
      .catch(() => toast.error("Помилка завантаження міст"))
      .finally(() => setLocationLoading(false));
  }, [selectedState, selectedCountry, countries, states]);

  /* Image drop */
  const onDrop = useCallback((acceptedFiles) => {
    const maxSize = 5 * 1024 * 1024;
    const valid = acceptedFiles.filter((f) => {
      if (f.size > maxSize) {
        toast.error(`${f.name} > 5MB`);
        return false;
      }
      return true;
    });
    if (!valid.length) return;
    setPreviewImages((prev) => {
      const next = [
        ...prev,
        ...valid.map((f) => ({ url: URL.createObjectURL(f), file: f })),
      ];
      if (next.length > 5) {
        toast.warning("Максимум 5 фото");
        return next.slice(0, 5);
      }
      return next;
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    onDrop,
    multiple: true,
    maxFiles: 5,
  });

  const removeImage = useCallback((i) => {
    setPreviewImages((prev) => prev.filter((_, idx) => idx !== i));
  }, []);

  const subcategories = useMemo(() => {
    if (!Array.isArray(categories) || !selectedCategoryId) return [];
    return (
      categories.find((c) => c.id === selectedCategoryId)?.SubCategories || []
    );
  }, [categories, selectedCategoryId]);

  /* Step completion checks */
  const step1Done = !!(selectedCategoryId && selectedSubCatId);
  const step2Done = !!(selectedCountry && selectedState && selectedCity);
  const step3Done = true; // contact — optional check
  const step4Done = previewImages.length > 0;

  const canSubmit = step1Done && step2Done;

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* ── Page header ── */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #0057B8 0%, #003d82 55%, #002255 100%)",
          py: { xs: 5, md: 7 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background:
              "linear-gradient(90deg, transparent, #FFD700 30%, #FFD700 70%, transparent)",
            opacity: 0.7,
          }}
        />
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 2, md: 4 },
            position: "relative",
          }}
        >
          <Button
            component={Link}
            to="/profile"
            startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
            sx={{
              fontFamily: F_BODY,
              fontWeight: 600,
              textTransform: "none",
              color: "rgba(255,255,255,.7)",
              fontSize: "0.85rem",
              mb: 3,
              p: 0,
              "&:hover": { color: "#fff", bgcolor: "transparent" },
            }}
          >
            Назад до профілю
          </Button>
          <Typography
            sx={{
              fontFamily: F_DISPLAY,
              fontWeight: 700,
              fontSize: { xs: "1.8rem", md: "2.4rem" },
              color: "#fff",
              letterSpacing: "-0.02em",
              mb: 0.5,
            }}
          >
            Нове оголошення
          </Typography>
          <Typography
            sx={{
              fontFamily: F_BODY,
              fontSize: "0.95rem",
              color: "rgba(255,255,255,.65)",
            }}
          >
            Заповніть всі поля та опублікуйте своє оголошення
          </Typography>
        </Box>
      </Box>

      {/* ── Progress bar ── */}
      <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #f1f5f9" }}>
        <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 4 } }}>
          <Box sx={{ display: "flex", gap: 0, py: 2 }}>
            {[
              { label: "Категорія", done: step1Done },
              { label: "Локація", done: step2Done },
              { label: "Контакти", done: step3Done },
              { label: "Фото", done: step4Done },
            ].map((s, i) => (
              <Box
                key={s.label}
                sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    opacity: s.done ? 1 : 0.5,
                    transition: "opacity 0.3s",
                  }}
                >
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      bgcolor: s.done ? "#10b981" : "#e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.3s",
                    }}
                  >
                    {s.done ? (
                      <CheckCircleIcon sx={{ fontSize: 14, color: "#fff" }} />
                    ) : (
                      <Typography
                        sx={{
                          fontFamily: F_BODY,
                          fontWeight: 700,
                          fontSize: "0.65rem",
                          color: "#94a3b8",
                        }}
                      >
                        {i + 1}
                      </Typography>
                    )}
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: F_BODY,
                      fontWeight: 600,
                      fontSize: "0.78rem",
                      color: s.done ? "#065f46" : "#94a3b8",
                      display: { xs: "none", sm: "block" },
                    }}
                  >
                    {s.label}
                  </Typography>
                </Box>
                {i < 3 && (
                  <Box
                    sx={{
                      flex: 1,
                      height: 2,
                      bgcolor: s.done ? "#10b981" : "#e2e8f0",
                      mx: 1,
                      borderRadius: "99px",
                      transition: "background 0.3s",
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ── Form ── */}
      <Box
        sx={{
          maxWidth: 860,
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: { xs: 4, md: 6 },
        }}
      >
        <Form method="post" encType="multipart/form-data">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {actionData?.error && (
              <Alert
                severity="error"
                sx={{ borderRadius: "12px", fontFamily: F_BODY }}
              >
                {actionData.error}
              </Alert>
            )}

            {/* ── STEP 1: Basic info + category ── */}
            <StepSection
              number={1}
              title="Основна інформація"
              subtitle="Назва, категорія та опис"
              completed={step1Done}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <TextField
                  name="title"
                  label="Заголовок оголошення"
                  required
                  fullWidth
                  placeholder="Наприклад: Шукаю роботу програміста в Берліні"
                  sx={inputSx}
                />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth required>
                      <InputLabel sx={{ fontFamily: F_BODY }}>
                        Категорія
                      </InputLabel>
                      <Select
                        name="categoryId"
                        label="Категорія"
                        value={selectedCategoryId}
                        onChange={(e) => {
                          setSelectedCategoryId(e.target.value);
                          setSelectedSubCatId("");
                        }}
                        sx={selectSx}
                      >
                        <MenuItem
                          value=""
                          sx={{ fontFamily: F_BODY, fontSize: "0.875rem" }}
                        >
                          <em>Виберіть категорію</em>
                        </MenuItem>
                        {Array.isArray(categories) &&
                          categories.map((cat) => (
                            <MenuItem
                              key={cat.id}
                              value={cat.id}
                              sx={{ fontFamily: F_BODY, fontSize: "0.875rem" }}
                            >
                              {cat.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {selectedCategoryId && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth required>
                        <InputLabel sx={{ fontFamily: F_BODY }}>
                          Підкатегорія
                        </InputLabel>
                        <Select
                          name="subcategoryId"
                          label="Підкатегорія"
                          value={selectedSubCatId}
                          onChange={(e) => setSelectedSubCatId(e.target.value)}
                          sx={selectSx}
                        >
                          <MenuItem
                            value=""
                            sx={{ fontFamily: F_BODY, fontSize: "0.875rem" }}
                          >
                            <em>Виберіть підкатегорію</em>
                          </MenuItem>
                          {subcategories.map((sub) => (
                            <MenuItem
                              key={sub.id}
                              value={sub.id}
                              sx={{ fontFamily: F_BODY, fontSize: "0.875rem" }}
                            >
                              {sub.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
                </Grid>

                <TextField
                  name="description"
                  label="Опис"
                  required
                  fullWidth
                  multiline
                  rows={4}
                  inputProps={{ minLength: 10, maxLength: 5000 }}
                  helperText="Від 10 до 5 000 символів. Будьте конкретними — це підвищує довіру."
                  sx={inputSx}
                />

                <Box sx={{ maxWidth: 220 }}>
                  <TextField
                    name="price"
                    label="Ціна (необов'язково)"
                    type="number"
                    fullWidth
                    inputProps={{ min: 0, step: 0.01 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EuroIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputSx}
                  />
                </Box>
              </Box>
            </StepSection>

            {/* ── STEP 2: Location ── */}
            <StepSection
              number={2}
              title="Місцезнаходження"
              subtitle="Виберіть країну, регіон та місто"
              completed={step2Done}
            >
              {locationLoading && (
                <LinearProgress
                  sx={{
                    mb: 2,
                    borderRadius: "99px",
                    bgcolor: "#eff6ff",
                    "& .MuiLinearProgress-bar": { bgcolor: BLUE },
                  }}
                />
              )}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth required>
                    <InputLabel sx={{ fontFamily: F_BODY }}>Країна</InputLabel>
                    <Select
                      name="country"
                      label="Країна"
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      sx={selectSx}
                      disabled={locationLoading && countries.length === 0}
                    >
                      {countries.map((c) => (
                        <MenuItem
                          key={c.id}
                          value={c.name}
                          sx={{ fontFamily: F_BODY, fontSize: "0.875rem" }}
                        >
                          {c.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {selectedCountry && (
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormControl fullWidth required disabled={locationLoading}>
                      <InputLabel sx={{ fontFamily: F_BODY }}>
                        Регіон
                      </InputLabel>
                      <Select
                        name="state"
                        label="Регіон"
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        sx={selectSx}
                      >
                        {states.map((s) => (
                          <MenuItem
                            key={s.id}
                            value={s.name}
                            sx={{ fontFamily: F_BODY, fontSize: "0.875rem" }}
                          >
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
                      disabled={locationLoading || cities.length === 0}
                    >
                      <InputLabel sx={{ fontFamily: F_BODY }}>Місто</InputLabel>
                      <Select
                        name="city"
                        label="Місто"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        sx={selectSx}
                      >
                        {cities.map((c) => (
                          <MenuItem
                            key={c.id}
                            value={c.name}
                            sx={{ fontFamily: F_BODY, fontSize: "0.875rem" }}
                          >
                            {c.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    name="location"
                    label="Точна адреса або квартал"
                    required
                    fullWidth
                    placeholder="вул. Головна, 12 або центр міста"
                    sx={inputSx}
                  />
                </Grid>
              </Grid>
            </StepSection>

            {/* ── STEP 3: Contact ── */}
            <StepSection
              number={3}
              title="Контактна інформація"
              subtitle="Як з вами зв'язатися"
              completed={step3Done}
            >
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    required
                    fullWidth
                    sx={inputSx}
                  />
                </Grid>
                <Grid size={{ xs: 4, sm: 2 }}>
                  <TextField
                    label="Код"
                    value={phoneCode ? `+${phoneCode}` : ""}
                    disabled
                    fullWidth
                    sx={{
                      ...inputSx,
                      "& .MuiOutlinedInput-root": {
                        ...inputSx["& .MuiOutlinedInput-root"],
                        bgcolor: "#f1f5f9",
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 8, sm: 4 }}>
                  <TextField
                    name="phone"
                    label="Телефон"
                    type="tel"
                    required
                    fullWidth
                    helperText="Формат: 0123456789"
                    sx={inputSx}
                  />
                </Grid>
              </Grid>
            </StepSection>

            {/* ── STEP 4: Photos ── */}
            <StepSection
              number={4}
              title={`Фотографії (${previewImages.length}/5)`}
              subtitle="Гарні фото підвищують кількість відгуків na 3×"
              completed={step4Done}
            >
              {/* Dropzone */}
              <Box
                {...getRootProps()}
                sx={{
                  border: "2px dashed",
                  borderColor: isDragActive ? BLUE : "#e2e8f0",
                  borderRadius: "16px",
                  p: { xs: 4, md: 5 },
                  textAlign: "center",
                  cursor: "pointer",
                  bgcolor: isDragActive ? "#eff6ff" : "#fafbfc",
                  transition: "all 0.2s ease",
                  "&:hover": { borderColor: BLUE, bgcolor: "#eff6ff" },
                }}
              >
                <input {...getInputProps({ name: "photos" })} />
                <CloudUploadOutlinedIcon
                  sx={{
                    fontSize: 40,
                    mb: 1.5,
                    color: isDragActive ? BLUE : "#94a3b8",
                    transition: "color 0.2s",
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: isDragActive ? BLUE : "#334155",
                    mb: 0.5,
                  }}
                >
                  {isDragActive
                    ? "Відпустіть тут..."
                    : "Клікніть або перетягніть фото"}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontSize: "0.8rem",
                    color: "#94a3b8",
                  }}
                >
                  JPG, PNG, WebP — до 5 MB кожен · максимум 5 файлів
                </Typography>
              </Box>

              {/* Preview grid */}
              {previewImages.length > 0 && (
                <Box
                  sx={{ mt: 2.5, display: "flex", flexWrap: "wrap", gap: 1.5 }}
                >
                  {previewImages.map(({ url }, i) => (
                    <Box
                      key={i}
                      sx={{
                        position: "relative",
                        width: 96,
                        height: 96,
                        borderRadius: "12px",
                        overflow: "hidden",
                        border:
                          i === 0 ? `2px solid ${BLUE}` : "2px solid #e2e8f0",
                        boxShadow:
                          i === 0 ? "0 4px 12px rgba(0,87,184,.2)" : "none",
                      }}
                    >
                      <Box
                        component="img"
                        src={url}
                        alt={`preview-${i}`}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      {/* Main badge */}
                      {i === 0 && (
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 5,
                            left: 5,
                            px: 0.75,
                            py: 0.25,
                            borderRadius: "5px",
                            bgcolor: BLUE,
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: F_BODY,
                              fontWeight: 700,
                              fontSize: "0.6rem",
                              color: "#fff",
                            }}
                          >
                            Головна
                          </Typography>
                        </Box>
                      )}
                      {/* Remove */}
                      <IconButton
                        size="small"
                        onClick={() => removeImage(i)}
                        sx={{
                          position: "absolute",
                          top: 3,
                          right: 3,
                          width: 20,
                          height: 20,
                          bgcolor: "rgba(0,0,0,.6)",
                          color: "#fff",
                          "&:hover": { bgcolor: "rgba(239,68,68,.9)" },
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 11 }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </StepSection>

            {/* ── Submit bar ── */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                pt: 2,
                pb: 4,
              }}
            >
              <Button
                variant="outlined"
                component={Link}
                to="/profile"
                disabled={isSubmitting}
                sx={{
                  fontFamily: F_BODY,
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: "12px",
                  px: 3,
                  py: 1.3,
                  borderColor: "#e2e8f0",
                  color: "#64748b",
                  "&:hover": { borderColor: "#0f172a", color: "#0f172a" },
                }}
              >
                Скасувати
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || !canSubmit}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={16} sx={{ color: "#fff" }} />
                  ) : (
                    <SendOutlinedIcon />
                  )
                }
                sx={{
                  fontFamily: F_BODY,
                  fontWeight: 700,
                  textTransform: "none",
                  bgcolor: BLUE,
                  borderRadius: "12px",
                  px: 4,
                  py: 1.3,
                  fontSize: "0.95rem",
                  boxShadow: "0 4px 14px rgba(0,87,184,.35)",
                  "&:hover": {
                    bgcolor: "#003d82",
                    transform: "translateY(-1px)",
                    boxShadow: "0 6px 20px rgba(0,87,184,.45)",
                  },
                  "&:disabled": { bgcolor: "#94a3b8", boxShadow: "none" },
                  transition: "all 0.25s ease",
                }}
              >
                {isSubmitting ? "Публікація..." : "Опублікувати оголошення"}
              </Button>
            </Box>
          </Box>
        </Form>
      </Box>
    </Box>
  );
}
