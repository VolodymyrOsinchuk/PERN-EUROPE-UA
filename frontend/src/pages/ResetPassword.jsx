import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
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

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Невірний або відсутній токен посилання.");
      return;
    }

    if (password.length < 8 || password.length > 255) {
      setError("Пароль має містити від 8 до 255 символів.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Паролі не співпадають.");
      return;
    }

    setLoading(true);

    try {
      await customFetch.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
      toast.success("Пароль успішно змінено!");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Посилання недійсне або термін його дії минув"
      );
      toast.error(error || "Не вдалося змінити пароль");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #e8f0fc 100%)",
          p: 3,
        }}
      >
        <Paper sx={{ p: 4, borderRadius: "20px", border: "1px solid #e2e8f0" }}>
          <Typography
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: "1.5rem",
              color: "#0f172a",
              mb: 1,
              textAlign: "center",
            }}
          >
            Пароль оновлено ✓
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
            Ви можете увійти за допомогою нового пароля.
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
            Увійти
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8fafc 0%, #e8f0fc 100%)",
        p: 3,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 420 }}>
        <Paper sx={{ p: 4, borderRadius: "20px", border: "1px solid #e2e8f0" }}>
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
            Новий пароль
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
            Створіть новий пароль для свого акаунта.
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2, borderRadius: "12px", fontFamily: fontBody }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              name="password"
              label="Новий пароль"
              type="password"
              required
              fullWidth
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="Мінімум 8 символів"
              sx={inputSx}
            />
            <TextField
              name="confirmPassword"
              label="Підтвердіть пароль"
              type="password"
              required
              fullWidth
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "Збереження..." : "Зберегти новий пароль"}
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Link
              to="/login"
              sx={{
                color: "#0057B8",
                fontWeight: 700,
                textDecoration: "none",
                fontSize: "0.85rem",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              ← Повернутися до входу
            </Link>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
