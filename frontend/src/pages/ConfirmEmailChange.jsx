// frontend/src/pages/ConfirmEmailChange.jsx
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import customFetch from "../utils/customFetch";

const F_BODY = "'Plus Jakarta Sans', sans-serif";
const F_DISPLAY = "'Playfair Display', serif";
const BLUE = "#0057B8";

export default function ConfirmEmailChange() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  // Захист від подвійного виклику в режимі розробки (StrictMode)
  const requested = useRef(false);

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;

    customFetch
      .post(`/auth/confirm-email-change/${token}`)
      .then(({ data }) => {
        setStatus("success");
        setMessage(data.message || "Нову адресу підтверджено");
      })
      .catch((error) => {
        setStatus("error");
        setMessage(
          error?.response?.data?.message || "Не вдалося підтвердити адресу",
        );
      });
  }, [token]);

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
      <Paper
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 4,
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
          textAlign: "center",
        }}
      >
        {status === "loading" && (
          <>
            <CircularProgress sx={{ color: BLUE, mb: 2 }} />
            <Typography sx={{ fontFamily: F_BODY, color: "#64748b" }}>
              Підтверджуємо нову адресу...
            </Typography>
          </>
        )}

        {status !== "loading" && (
          <>
            <Typography
              sx={{
                fontFamily: F_DISPLAY,
                fontWeight: 700,
                fontSize: "1.6rem",
                color: "#0f172a",
                mb: 1,
              }}
            >
              {status === "success"
                ? "Адресу підтверджено ✓"
                : "Не вдалося підтвердити"}
            </Typography>
            <Typography
              sx={{
                fontFamily: F_BODY,
                fontSize: "0.9rem",
                color: "#64748b",
                mb: 3,
              }}
            >
              {message}
            </Typography>
            <Button
              component={Link}
              to="/profile"
              fullWidth
              sx={{
                fontFamily: F_BODY,
                fontWeight: 700,
                textTransform: "none",
                bgcolor: BLUE,
                color: "#fff",
                borderRadius: "12px",
                py: 1.5,
                "&:hover": { bgcolor: "#003d82" },
              }}
            >
              Перейти до профілю
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}
