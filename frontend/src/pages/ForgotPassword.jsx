import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Alert,
} from "@mui/material";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

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

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await customFetch.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success(
        "Якщо акаунт існує, ми надіслали інструкції на його пошту."
      );
    } catch (err) {
      setError(err?.response?.data?.message || "Помилка сервера");
      toast.error(error || "Не вдалося надіслати листа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(135deg, #f8fafc 0%, #e8f0fc 100%)",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 420 }}>
        <Paper
          sx={{ p: 4, borderRadius: "20px", border: "1px solid #e2e8f0" }}
        >
          <Typography
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: "2rem",
              color: "#0f172a",
              mb: 0.5,
              textAlign: "center",
            }}
          >
            Відновлення пароля
          </Typography>
          <Typography
            sx={{
              fontFamily: fontBody,
              fontSize: "0.9rem",
              color: "#64748b",
              mb: 3,
              textAlign: "center",
            }}
          >
            Введіть свою електронну пошту, і ми надішлемо інструкції зі
            скидання пароля.
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2, borderRadius: "12px", fontFamily: fontBody }}
            >
              {error}
            </Alert>
          )}

          {!sent && (
            <>
              <form onSubmit={handleSubmit}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  required
                  fullWidth
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={inputSx}
                />
                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                  sx={{
                    fontFamily: fontBody,
                    fontWeight: 700,
                    textTransform: "none",
                    bgcolor: "#0057B8",
                    color: "#fff",
                    borderRadius: "12px",
                    py: 1.5,
                    fontSize: "0.95rem",
                    mt: 1,
                    "&:disabled": { bgcolor: "#94a3b8" },
                  }}
                >
                  {loading ? "Надсилання..." : "Надіслати інструкції"}
                </Button>
              </form>
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography
                  sx={{
                    fontFamily: fontBody,
                    fontSize: "0.85rem",
                    color: "#64748b",
                    mb: 1,
                  }}
                >
                  Пам'ятаєте пароль?
                </Typography>
                <Link
                  to="/login"
                  sx={{
                    color: "#0057B8",
                    fontWeight: 700,
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Увійти
                </Link>
              </Box>
            </>
          )}

          {sent && (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Typography
                sx={{
                  fontFamily: fontDisplay,
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  color: "#0f172a",
                  mb: 1,
                }}
              >
                Лист надіслано ✓
              </Typography>
              <Typography
                sx={{
                  fontFamily: fontBody,
                  fontSize: "0.9rem",
                  color: "#64748b",
                  mb: 3,
                  lineHeight: 1.6,
                }}
              >
                Перевірте свою поштову скриньку. У листі буде посилання для
                створення нового пароля.
              </Typography>
              <Button
                component={Link}
                to="/login"
                fullWidth
                sx={{
                  fontFamily: fontBody,
                  fontWeight: 700,
                  textTransform: "none",
                  bgcolor: "#0057B8",
                  color: "#fff",
                  borderRadius: "12px",
                  py: 1.5,
                  fontSize: "0.95rem",
                  "&:hover": { bgcolor: "#003d82" },
                }}
              >
                Повернутися до входу
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
