import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import { HeroSection } from "../components";
import { SectionsGrid } from "../components";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExternalNews from "../components/ExternalNews";

const STATS = [
  { value: "12 000+", label: "Українців", icon: "🇺🇦" },
  { value: "8", label: "Країн", icon: "🌍" },
  { value: "3 400+", label: "Оголошень", icon: "📋" },
  { value: "600+", label: "Подій", icon: "🎉" },
];

const fontBody = "'Plus Jakarta Sans', sans-serif";
const fontDisplay = "'Playfair Display', serif";

export default function Home() {
  return (
    <Box>
      {/* ── HERO ── */}
      <HeroSection
        typedStrings={["Українці в Європі"]}
        subtitle="Ваш провідник у житті за кордоном — новини, оголошення, спільнота"
        buttonText="Приєднатися безкоштовно"
        buttonLink="/register"
        secondaryButtonText="Переглянути оголошення"
        secondaryButtonLink="/ads"
        badge="🇺🇦 Платформа для діаспори"
      />

      {/* ── Stats strip ── */}
      <Box
        sx={{
          bgcolor: "#fff",
          borderBottom: "1px solid #f1f5f9",
          py: { xs: 4, md: 5 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={0} justifyContent="center">
            {STATS.map((s, i) => (
              <Grid
                size={{ xs: 6, sm: 3 }}
                key={s.label}
                sx={{
                  textAlign: "center",
                  py: 2,
                  px: 3,
                  borderRight:
                    i < STATS.length - 1 ? { sm: "1px solid #f1f5f9" } : "none",
                }}
              >
                <Typography sx={{ fontSize: "1.8rem", mb: 0.5 }}>
                  {s.icon}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: fontDisplay,
                    fontWeight: 700,
                    fontSize: { xs: "1.6rem", md: "2rem" },
                    color: "#0057B8",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.value}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: fontBody,
                    fontSize: "0.8rem",
                    color: "#64748b",
                    fontWeight: 500,
                  }}
                >
                  {s.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Quick search ── */}
      <Box sx={{ bgcolor: "#f8fafc", py: { xs: 5, md: 7 } }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              fontFamily: fontBody,
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#0057B8",
              mb: 1.5,
            }}
          >
            Знайти потрібне
          </Typography>
          <Typography
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: { xs: "1.8rem", md: "2.5rem" },
              color: "#0f172a",
              letterSpacing: "-0.02em",
              mb: 4,
            }}
          >
            Все для вашого комфорту за кордоном
          </Typography>

          <Paper
            elevation={0}
            sx={{
              display: "flex",
              gap: 0,
              border: "1.5px solid #e2e8f0",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(0,87,184,.08)",
              bgcolor: "#fff",
            }}
          >
            <Box
              component="input"
              placeholder="Пошук послуг, подій або інформації..."
              sx={{
                flex: 1,
                border: "none",
                outline: "none",
                padding: "16px 20px",
                fontFamily: fontBody,
                fontSize: "0.95rem",
                color: "#0f172a",
                bgcolor: "transparent",
                "&::placeholder": { color: "#94a3b8" },
              }}
            />
            <Button
              sx={{
                fontFamily: fontBody,
                fontWeight: 700,
                textTransform: "none",
                bgcolor: "#0057B8",
                color: "#fff",
                borderRadius: 0,
                px: 3.5,
                fontSize: "0.9rem",
                flexShrink: 0,
                "&:hover": { bgcolor: "#003d82" },
              }}
            >
              Пошук
            </Button>
          </Paper>
        </Container>
      </Box>

      {/* ── Main sections ── */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 5 }}>
            <Typography
              sx={{
                fontFamily: fontBody,
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#0057B8",
                mb: 1,
              }}
            >
              Розділи
            </Typography>
            <Typography
              sx={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: { xs: "1.8rem", md: "2.4rem" },
                color: "#0f172a",
                letterSpacing: "-0.02em",
              }}
            >
              Основні категорії
            </Typography>
            <Box
              sx={{
                width: 48,
                height: 4,
                background: "linear-gradient(90deg, #0057B8, #FFD700)",
                borderRadius: "99px",
                mt: 1.5,
              }}
            />
          </Box>
          <SectionsGrid />
        </Container>
      </Box>

      {/* ── Latest news (з API) ── */}
      <ExternalNews
        limit={3}
        eyebrow="Актуально"
        title="Останні новини"
        showAllHref="/news"
        hideWhenEmpty
      />

      {/* ── CTA Banner ── */}
      <Box
        sx={{
          py: { xs: 7, md: 10 },
          background: "linear-gradient(135deg, #FFD700 0%, #f5c400 100%)",
          textAlign: "center",
        }}
      >
        <Container maxWidth="sm">
          <Typography
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 900,
              fontSize: { xs: "1.8rem", md: "2.4rem" },
              color: "#003d82",
              letterSpacing: "-0.02em",
              mb: 2,
            }}
          >
            Про нас
          </Typography>
          <Typography
            sx={{
              fontFamily: fontBody,
              fontSize: "1rem",
              color: "#003d82",
              opacity: 0.8,
              lineHeight: 1.7,
              mb: 4,
            }}
          >
            "Українці в Європі" — онлайн-платформа для об'єднання та підтримки
            української діаспори. Допомагаємо адаптуватися до життя за кордоном,
            зберігаючи зв'язок з рідною культурою.
          </Typography>
          <Button
            component={Link}
            to="/about"
            endIcon={<ArrowForwardIcon />}
            sx={{
              fontFamily: fontBody,
              fontWeight: 700,
              textTransform: "none",
              bgcolor: "#003d82",
              color: "#fff",
              borderRadius: "12px",
              px: 4,
              py: 1.5,
              fontSize: "0.95rem",
              boxShadow: "0 6px 20px rgba(0,61,130,.3)",
              "&:hover": {
                bgcolor: "#002255",
                transform: "translateY(-2px)",
                boxShadow: "0 10px 28px rgba(0,61,130,.4)",
              },
              transition: "all 0.25s ease",
            }}
          >
            Дізнатися більше
          </Button>
        </Container>
      </Box>
    </Box>
  );
}
