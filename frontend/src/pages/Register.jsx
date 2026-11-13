import { Fragment, useEffect, useState } from "react";
import { Link, Form, redirect, useNavigation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Divider,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stepper,
  Step,
  StepLabel,
  Chip,
} from "@mui/material";
import customFetch from "../utils/customFetch";
import { FormRow, FormRowSelect, CitySelectField } from "../components";
import { toast } from "react-toastify";
import { GetCountries } from "react-country-state-city";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const dataForm = Object.fromEntries(formData);
  dataForm.agreeToTerms = dataForm.agreeToTerms === "on";
  try {
    await customFetch.post("/auth/register", dataForm);
    toast.success("Реєстрація пройшла успішно! Перевірте email.");
    return redirect("/login");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Сталася помилка");
    return error;
  }
};

const fontBody = "'Plus Jakarta Sans', sans-serif";
const fontDisplay = "'Playfair Display', serif";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    fontFamily: fontBody,
    bgcolor: "#f8fafc",
    "&:hover fieldset": { borderColor: "#0057B8" },
    "&.Mui-focused fieldset": { borderColor: "#0057B8", borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#0057B8" },
  "& .MuiInputLabel-root": { fontFamily: fontBody },
};

const PERKS = [
  { icon: "article", label: "Доступ до всіх публікацій" },
  { icon: "event", label: "Реєстрація на події" },
  { icon: "campaign", label: "Власні оголошення" },
  { icon: "forum", label: "Участь у форумі" },
];

export default function Register() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [europeanCountries, setEuropeanCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  useEffect(() => {
    GetCountries()
      .then((all) =>
        setEuropeanCountries(all.filter((c) => c.region === "Europe")),
      )
      .catch(() => toast.error("Помилка завантаження країн"));
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(135deg, #f8fafc 0%, #e8f0fc 100%)",
      }}
    >
      {/* ── Left panel ── */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          flex: "0 0 400px",
          flexDirection: "column",
          justifyContent: "center",
          background:
            "linear-gradient(160deg, #0057B8 0%, #003d82 55%, #002255 100%)",
          p: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,215,0,.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
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

        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "14px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              mb: 3,
              boxShadow: "0 8px 24px rgba(0,0,0,.3)",
            }}
          >
            <Box sx={{ flex: 1, bgcolor: "#0057B8" }} />
            <Box sx={{ flex: 1, bgcolor: "#FFD700" }} />
          </Box>

          <Typography
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 900,
              fontSize: "1.8rem",
              color: "#fff",
              letterSpacing: "-0.02em",
              mb: 1,
            }}
          >
            Приєднуйтесь до спільноти
          </Typography>
          <Box
            sx={{
              width: 40,
              height: 3,
              background: "linear-gradient(90deg, #FFD700, rgba(255,215,0,.3))",
              borderRadius: "99px",
              mb: 3,
            }}
          />
          <Typography
            sx={{
              fontFamily: fontBody,
              fontSize: "0.9rem",
              color: "rgba(255,255,255,.7)",
              lineHeight: 1.7,
              mb: 4,
            }}
          >
            Безкоштовна реєстрація дає вам доступ до всіх можливостей платформи
            для українців в Європі.
          </Typography>

          {PERKS.map((p) => (
            <Box
              key={p.label}
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  bgcolor: "rgba(255,215,0,.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  className="material-icons"
                  style={{ fontSize: 16, color: "#FFD700" }}
                >
                  {p.icon}
                </span>
              </Box>
              <Typography
                sx={{
                  fontFamily: fontBody,
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,.8)",
                  fontWeight: 500,
                }}
              >
                {p.label}
              </Typography>
            </Box>
          ))}

          <Box
            sx={{
              mt: 4,
              p: 2.5,
              bgcolor: "rgba(255,215,0,.08)",
              borderRadius: "14px",
              border: "1px solid rgba(255,215,0,.2)",
            }}
          >
            <Chip
              label="Безкоштовно назавжди"
              sx={{
                bgcolor: "rgba(255,215,0,.15)",
                color: "#FFD700",
                fontFamily: fontBody,
                fontWeight: 700,
                fontSize: "0.75rem",
                border: "1px solid rgba(255,215,0,.3)",
                mb: 1,
              }}
            />
            <Typography
              sx={{
                fontFamily: fontBody,
                fontSize: "0.8rem",
                color: "rgba(255,255,255,.6)",
                lineHeight: 1.6,
              }}
            >
              Без прихованих платежів. Базовий доступ завжди безкоштовний.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Right: form ── */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, md: 5 },
          overflowY: "auto",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 520, py: 3 }}>
          {/* Mobile logo */}
          <Box
            sx={{
              display: { xs: "flex", lg: "none" },
              alignItems: "center",
              gap: 1.5,
              mb: 5,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ flex: 1, bgcolor: "#0057B8" }} />
              <Box sx={{ flex: 1, bgcolor: "#FFD700" }} />
            </Box>
            <Typography
              sx={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: "1rem",
                color: "#0057B8",
              }}
            >
              Українці в Європі
            </Typography>
          </Box>

          <Typography
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: "2rem",
              color: "#0f172a",
              letterSpacing: "-0.02em",
              mb: 0.5,
            }}
          >
            Створити акаунт
          </Typography>
          <Typography
            sx={{
              fontFamily: fontBody,
              fontSize: "0.9rem",
              color: "#64748b",
              mb: 4,
            }}
          >
            Вже маєте акаунт?{" "}
            <Box
              component={Link}
              to="/login"
              sx={{
                color: "#0057B8",
                fontWeight: 700,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Увійти
            </Box>
          </Typography>

          <Form method="post">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {/* Name row */}
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <TextField
                  name="firstName"
                  label="Ім'я"
                  required
                  fullWidth
                  sx={inputSx}
                />
                <TextField
                  name="lastName"
                  label="Прізвище"
                  required
                  fullWidth
                  sx={inputSx}
                />
              </Box>

              <TextField
                name="email"
                label="Email"
                type="email"
                required
                fullWidth
                sx={inputSx}
              />
              <TextField
                name="password"
                label="Пароль"
                type="password"
                required
                fullWidth
                helperText="Мінімум 8 символів"
                sx={inputSx}
              />

              {/* Country */}
              <FormControl fullWidth sx={inputSx}>
                <InputLabel>Країна проживання</InputLabel>
                <Select
                  name="country"
                  label="Країна проживання"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                >
                  {europeanCountries.map((c) => (
                    <MenuItem
                      key={c.id}
                      value={c.name}
                      sx={{ fontFamily: fontBody, fontSize: "0.875rem" }}
                    >
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <CitySelectField
                country={selectedCountry}
                name="city"
                label="Місто"
                placeholder="Оберіть місто або введіть..."
                sx={inputSx}
              />

              {/* Terms */}
              <FormControlLabel
                control={
                  <Checkbox
                    name="agreeToTerms"
                    required
                    sx={{
                      color: "#94a3b8",
                      "&.Mui-checked": { color: "#0057B8" },
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontFamily: fontBody,
                      fontSize: "0.85rem",
                      color: "#64748b",
                    }}
                  >
                    Я погоджуюся з{" "}
                    <Box
                      component={Link}
                      to="/policy"
                      sx={{
                        color: "#0057B8",
                        fontWeight: 600,
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      умовами використання та політикою конфіденційності
                    </Box>
                  </Typography>
                }
              />

              <Button
                type="submit"
                fullWidth
                disabled={isSubmitting}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  fontFamily: fontBody,
                  fontWeight: 700,
                  textTransform: "none",
                  bgcolor: "#0057B8",
                  color: "#fff",
                  borderRadius: "12px",
                  py: 1.5,
                  fontSize: "0.95rem",
                  boxShadow: "0 4px 14px rgba(0,87,184,.35)",
                  "&:hover": {
                    bgcolor: "#003d82",
                    boxShadow: "0 6px 20px rgba(0,87,184,.45)",
                    transform: "translateY(-1px)",
                  },
                  "&:disabled": { bgcolor: "#94a3b8" },
                  transition: "all 0.25s ease",
                }}
              >
                {isSubmitting ? "Реєстрація..." : "Зареєструватися безкоштовно"}
              </Button>
            </Box>
          </Form>
        </Box>
      </Box>
    </Box>
  );
}
