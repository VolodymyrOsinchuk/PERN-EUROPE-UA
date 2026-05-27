import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  CircularProgress,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  useLoaderData,
  Form,
  redirect,
  Link,
  useNavigation,
} from "react-router-dom";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

/* ── Loader / Action ── */
export const loader = async ({ params }) => {
  try {
    const { data } = await customFetch.get(`/adv/${params.id}`);
    return data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Помилка завантаження оголошення",
    );
    return {};
  }
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  try {
    await customFetch.put(`/adv/${params.id}`, Object.fromEntries(formData));
    toast.success("Оголошення оновлено успішно");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Помилка оновлення");
    return { error: error?.response?.data?.message };
  }
  /* Redirect based on where the user came from */
  const referer = request.headers.get("Referer") || "";
  return redirect(referer.includes("/profile") ? "/profile" : "/dashboard/ads");
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

/* ── Section with colored accent bar ── */
function EditSection({ icon, title, children }) {
  return (
    <Box sx={{ mb: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
        <Box
          sx={{
            width: 4,
            height: 24,
            borderRadius: "99px",
            background: `linear-gradient(180deg, ${BLUE}, ${GOLD})`,
          }}
        />
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            bgcolor: "#eff6ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            className="material-icons"
            style={{ fontSize: 18, color: BLUE }}
          >
            {icon}
          </span>
        </Box>
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
      </Box>
      {children}
    </Box>
  );
}

export default function EditAdPage() {
  const ad = useLoaderData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  /* Context: profile vs dashboard */
  const isProfile =
    typeof window !== "undefined" &&
    window.location.pathname.includes("/profile/");
  const cancelHref = isProfile ? "/profile" : "/dashboard/ads";

  if (!ad?.title) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              fontFamily: F_DISPLAY,
              fontSize: "1.4rem",
              color: "#94a3b8",
              mb: 2,
            }}
          >
            Оголошення не знайдено
          </Typography>
          <Button
            component={Link}
            to={cancelHref}
            sx={{
              fontFamily: F_BODY,
              fontWeight: 600,
              textTransform: "none",
              color: BLUE,
            }}
          >
            ← Назад
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* ── Header ── */}
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
            maxWidth: 960,
            mx: "auto",
            px: { xs: 2, md: 4 },
            position: "relative",
          }}
        >
          <Button
            component={Link}
            to={cancelHref}
            startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
            sx={{
              fontFamily: F_BODY,
              fontWeight: 600,
              textTransform: "none",
              color: "rgba(255,255,255,.7)",
              mb: 3,
              p: 0,
              "&:hover": { color: "#fff", bgcolor: "transparent" },
            }}
          >
            {isProfile ? "Назад до профілю" : "Назад до оголошень"}
          </Button>

          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                sx={{
                  fontFamily: F_DISPLAY,
                  fontWeight: 700,
                  fontSize: { xs: "1.6rem", md: "2rem" },
                  color: "#fff",
                  letterSpacing: "-0.02em",
                  mb: 0.5,
                }}
              >
                Редагувати оголошення
              </Typography>
              <Typography
                sx={{
                  fontFamily: F_BODY,
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,.6)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: 500,
                }}
              >
                {ad.title}
              </Typography>
            </Box>
            <Chip
              label={`ID: ${ad.id}`}
              sx={{
                fontFamily: F_BODY,
                fontWeight: 700,
                fontSize: "0.72rem",
                bgcolor: "rgba(255,255,255,.12)",
                color: "rgba(255,255,255,.7)",
                border: "1px solid rgba(255,255,255,.2)",
                alignSelf: "flex-start",
                mt: 0.5,
              }}
            />
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
        <Form method="post">
          <Paper
            elevation={0}
            sx={{
              borderRadius: "20px",
              border: "1.5px solid #e2e8f0",
              p: { xs: 3, md: 5 },
              boxShadow: "0 4px 24px rgba(0,87,184,.06)",
            }}
          >
            {/* ── Section 1: Basic info ── */}
            <EditSection icon="edit_note" title="Основна інформація">
              <Grid container spacing={2.5}>
                <Grid size={12}>
                  <TextField
                    name="title"
                    label="Заголовок"
                    required
                    fullWidth
                    defaultValue={ad.title}
                    sx={inputSx}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    name="description"
                    label="Опис"
                    required
                    fullWidth
                    multiline
                    rows={5}
                    defaultValue={ad.description}
                    inputProps={{ minLength: 10, maxLength: 5000 }}
                    helperText="Від 10 до 5 000 символів"
                    sx={inputSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    name="price"
                    label="Ціна (€)"
                    type="number"
                    fullWidth
                    defaultValue={ad.price}
                    inputProps={{ min: 0, step: 0.01 }}
                    sx={inputSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth sx={inputSx}>
                    <InputLabel sx={{ fontFamily: F_BODY }}>Статус</InputLabel>
                    <Select
                      name="status"
                      label="Статус"
                      defaultValue={ad.status || "Active"}
                      sx={{
                        borderRadius: "12px",
                        fontFamily: F_BODY,
                        bgcolor: "#f8fafc",
                        "& fieldset": { borderColor: "#e2e8f0" },
                        "&:hover fieldset": { borderColor: BLUE },
                        "&.Mui-focused fieldset": { borderColor: BLUE },
                      }}
                    >
                      <MenuItem value="Active">Активне</MenuItem>
                      <MenuItem value="Inactive">Неактивне</MenuItem>
                      <MenuItem value="Sold">Продано</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </EditSection>

            <Divider sx={{ my: 4, borderColor: "#f1f5f9" }} />

            {/* ── Section 2: Location ── */}
            <EditSection icon="location_on" title="Місцезнаходження">
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    name="country"
                    label="Країна"
                    fullWidth
                    defaultValue={ad.country}
                    sx={inputSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    name="state"
                    label="Регіон"
                    fullWidth
                    defaultValue={ad.state}
                    sx={inputSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    name="city"
                    label="Місто"
                    fullWidth
                    defaultValue={ad.city}
                    sx={inputSx}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    name="location"
                    label="Точна адреса або квартал"
                    fullWidth
                    defaultValue={ad.location}
                    sx={inputSx}
                  />
                </Grid>
              </Grid>
            </EditSection>

            <Divider sx={{ my: 4, borderColor: "#f1f5f9" }} />

            {/* ── Section 3: Contacts ── */}
            <EditSection icon="contact_phone" title="Контактна інформація">
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    defaultValue={ad.email}
                    sx={inputSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    name="phone"
                    label="Телефон"
                    type="tel"
                    fullWidth
                    defaultValue={ad.phone || ""}
                    helperText="Формат: +33612345678"
                    sx={inputSx}
                  />
                </Grid>
              </Grid>
            </EditSection>

            {/* ── Action buttons ── */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                mt: 5,
                pt: 4,
                borderTop: "1px solid #f1f5f9",
              }}
            >
              <Button
                variant="outlined"
                component={Link}
                to={cancelHref}
                disabled={isSubmitting}
                startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
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
                disabled={isSubmitting}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={16} sx={{ color: "#fff" }} />
                  ) : (
                    <SaveOutlinedIcon />
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
                {isSubmitting ? "Збереження..." : "Зберегти зміни"}
              </Button>
            </Box>
          </Paper>
        </Form>
      </Box>
    </Box>
  );
}
