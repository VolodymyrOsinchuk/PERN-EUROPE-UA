import { Button, Typography, Box } from "@mui/material";
import { Link, useRouteError } from "react-router-dom";

const F_BODY = "'Plus Jakarta Sans', sans-serif";
const F_DISPLAY = "'Playfair Display', serif";
const BLUE = "#0057B8";
const GOLD = "#FFD700";

export default function ErrorPage() {
  const error = useRouteError();
  const is404 = error?.status === 404;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8fafc 0%, #e8f0fc 100%)",
        px: 3,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background circles */}
      <Box
        sx={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,87,184,.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -80,
          left: -80,
          width: 380,
          height: 380,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,215,0,.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Dot grid */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(0,87,184,.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: 520,
          animation: "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both",
          "@keyframes fadeUp": {
            from: { opacity: 0, transform: "translateY(28px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        {/* Ukrainian flag mini logo */}
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "14px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            mx: "auto",
            mb: 4,
            boxShadow: "0 6px 20px rgba(0,87,184,.25)",
          }}
        >
          <Box sx={{ flex: 1, bgcolor: BLUE }} />
          <Box sx={{ flex: 1, bgcolor: GOLD }} />
        </Box>

        {/* Error code */}
        {is404 ? (
          <Typography
            sx={{
              fontFamily: F_DISPLAY,
              fontWeight: 900,
              fontSize: { xs: "7rem", md: "10rem" },
              lineHeight: 1,
              letterSpacing: "-0.05em",
              background: `linear-gradient(135deg, ${BLUE} 0%, ${GOLD} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              mb: 2,
              animation: "float 3.5s ease-in-out infinite",
              "@keyframes float": {
                "0%, 100%": { transform: "translateY(0)" },
                "50%": { transform: "translateY(-12px)" },
              },
            }}
          >
            404
          </Typography>
        ) : (
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "#fef2f2",
              border: "2px solid #fecaca",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
            }}
          >
            <span
              className="material-icons"
              style={{ fontSize: 36, color: "#ef4444" }}
            >
              error_outline
            </span>
          </Box>
        )}

        {/* Gold accent line */}
        <Box
          sx={{
            width: 56,
            height: 4,
            background: `linear-gradient(90deg, ${BLUE}, ${GOLD})`,
            borderRadius: "99px",
            mx: "auto",
            mb: 3,
          }}
        />

        {/* Title */}
        <Typography
          sx={{
            fontFamily: F_DISPLAY,
            fontWeight: 700,
            fontSize: { xs: "1.6rem", md: "2rem" },
            color: "#0f172a",
            letterSpacing: "-0.02em",
            mb: 2,
          }}
        >
          {is404 ? "Сторінку не знайдено" : "Щось пішло не так"}
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            fontFamily: F_BODY,
            fontSize: "0.975rem",
            color: "#64748b",
            lineHeight: 1.75,
            mb: 4,
            maxWidth: 420,
            mx: "auto",
          }}
        >
          {is404
            ? "На жаль, сторінка, яку ви шукаєте, не існує або була переміщена. Можливо, ви перейшли за застарілим посиланням."
            : "Виникла непередбачена помилка. Спробуйте оновити сторінку або повернутися на головну."}
        </Typography>

        {/* Error detail (dev) */}
        {error?.statusText && (
          <Box
            sx={{
              mb: 3,
              px: 2.5,
              py: 1.5,
              borderRadius: "10px",
              bgcolor: "#f8fafc",
              border: "1px solid #e2e8f0",
              display: "inline-block",
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Courier New', monospace",
                fontSize: "0.78rem",
                color: "#94a3b8",
              }}
            >
              {error.statusText}
            </Typography>
          </Box>
        )}

        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            component={Link}
            to="/"
            startIcon={
              <span className="material-icons" style={{ fontSize: 18 }}>
                home
              </span>
            }
            sx={{
              fontFamily: F_BODY,
              fontWeight: 700,
              textTransform: "none",
              bgcolor: BLUE,
              color: "#fff",
              borderRadius: "12px",
              px: 3.5,
              py: 1.3,
              fontSize: "0.9rem",
              boxShadow: "0 4px 14px rgba(0,87,184,.35)",
              "&:hover": {
                bgcolor: "#003d82",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(0,87,184,.45)",
              },
              transition: "all 0.25s ease",
            }}
          >
            На головну
          </Button>

          <Button
            onClick={() => window.history.back()}
            startIcon={
              <span className="material-icons" style={{ fontSize: 18 }}>
                arrow_back
              </span>
            }
            sx={{
              fontFamily: F_BODY,
              fontWeight: 700,
              textTransform: "none",
              color: "#64748b",
              borderRadius: "12px",
              px: 3.5,
              py: 1.3,
              fontSize: "0.9rem",
              border: "1.5px solid #e2e8f0",
              bgcolor: "#fff",
              "&:hover": {
                borderColor: BLUE,
                color: BLUE,
                bgcolor: "#eff6ff",
              },
              transition: "all 0.2s",
            }}
          >
            Назад
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
