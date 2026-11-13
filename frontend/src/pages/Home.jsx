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
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { HeroSection } from "../components";
import { SectionsGrid } from "../components";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import ExternalNews from "../components/ExternalNews";
import customFetch from "../utils/customFetch";

// ── Stats (завантажуються з публічного API) ─────────────────
const STATS_DEF = [
  { key: "users", label: "Українців", icon: "🇺🇦", fallback: "—" },
  { key: "countries", label: "Країн", icon: "🌍", fallback: "—" },
  { key: "ads", label: "Оголошень", icon: "📋", fallback: "—" },
  { key: "events", label: "Подій", icon: "🎉", fallback: "—" },
];

const fontBody = "'Plus Jakarta Sans', sans-serif";
const fontDisplay = "'Playfair Display', serif";

export default function Home() {
  const [stats, setStats] = useState({
    users: null,
    countries: null,
    ads: null,
    events: null,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/ads?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await customFetch.get("/public/stats");
        setStats({
          users: data.users ?? null,
          countries: data.countries ?? null,
          ads: data.ads ?? null,
          events: data.events ?? null,
        });
      } catch (error) {
        console.error("Помилка завантаження статистики:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const fmt = (n) => (n == null ? "—" : n.toLocaleString("uk-UA") + "+");

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
            {STATS_DEF.map((s, i) => (
              <Grid
                size={{ xs: 6, sm: 3 }}
                key={s.label}
                sx={{
                  textAlign: "center",
                  py: 2,
                  px: 3,
                  borderRight:
                    i < STATS_DEF.length - 1
                      ? { sm: "1px solid #f1f5f9" }
                      : "none",
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
                  {loading ? "—" : fmt(stats[s.key])}
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

      {/* ── Quick Search ── */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          py: { xs: 8, md: 12 },
          px: 2,
          background:
            "linear-gradient(135deg, #f8fbff 0%, #eef5ff 55%, #f8fafc 100%)",
          "&::before": {
            content: '""',
            position: "absolute",
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "rgba(0,87,184,0.045)",
            top: -190,
            right: "-5%",
            pointerEvents: "none",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(0,87,184,0.035)",
            bottom: -180,
            left: "-5%",
            pointerEvents: "none",
          },
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: { xs: 3, md: 3.5 },
            }}
          >
            {/* Heading */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography
                sx={{
                  fontFamily: fontBody,
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#0057B8",
                }}
              >
                ВАШЕ ЖИТТЯ ЗА КОРДОНОМ — ПРОСТІШЕ
              </Typography>

              <Typography
                sx={{
                  fontFamily: fontDisplay,
                  fontWeight: 800,
                  fontSize: {
                    xs: "2rem",
                    sm: "2.5rem",
                    md: "3.1rem",
                  },
                  lineHeight: 1.15,
                  letterSpacing: "-0.045em",
                  color: "#10233f",
                  maxWidth: 750,
                  mx: "auto",
                }}
              >
                Усе необхідне для комфортного життя за кордоном.
              </Typography>

              <Typography
                sx={{
                  fontFamily: fontBody,
                  fontSize: { xs: "0.95rem", md: "1.05rem" },
                  lineHeight: 1.8,
                  color: "#64748b",
                  maxWidth: 590,
                  mx: "auto",
                }}
              >
                Знаходьте легко послуги, події та корисну інформацію для
                спрощення вашого щоденного життя за кордоном.
              </Typography>
            </Box>

            {/* Search Form */}
            <Box
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{
                display: "flex",
                width: "100%",
                maxWidth: 650,
                p: 0.8,
                gap: 1,
                backgroundColor: "#fff",
                border: "1px solid #dce6f2",
                borderRadius: "18px",
                boxShadow: "0 12px 40px rgba(15, 45, 85, 0.09)",
                transition: "all 0.25s ease",
                "&:focus-within": {
                  borderColor: "#0057B8",
                  boxShadow: "0 14px 45px rgba(0,87,184,0.15)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  pl: 2,
                  color: "#0057B8",
                }}
              >
                <SearchIcon sx={{ fontSize: 23 }} />
              </Box>

              <Box
                component="input"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Що ви шукаєте сьогодні?"
                sx={{
                  flex: 1,
                  minWidth: 0,
                  border: "none",
                  outline: "none",
                  bgcolor: "transparent",
                  fontFamily: fontBody,
                  fontSize: { xs: "0.85rem", md: "0.95rem" },
                  color: "#10233f",
                  px: 1,
                  py: 1.7,
                  "&::placeholder": {
                    color: "#94a3b8",
                    opacity: 1,
                  },
                  "&::-webkit-search-cancel-button": {
                    cursor: "pointer",
                  },
                }}
              />

              <Button
                type="submit"
                disableElevation
                sx={{
                  flexShrink: 0,
                  borderRadius: "13px",
                  px: { xs: 2, sm: 3.5 },
                  py: 1.5,
                  fontFamily: fontBody,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  textTransform: "none",
                  color: "#fff",
                  background: "linear-gradient(135deg, #0066cc, #004b9b)",
                  boxShadow: "0 4px 12px rgba(0,87,184,0.2)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: "linear-gradient(135deg, #0057b8, #003d82)",
                    boxShadow: "0 7px 18px rgba(0,87,184,0.28)",
                    transform: "translateY(-1px)",
                  },
                  "&:active": {
                    transform: "scale(0.97)",
                  },
                }}
              >
                <Box
                  component="span"
                  sx={{ display: { xs: "none", sm: "inline" } }}
                >
                  Знайти
                </Box>
                <SearchIcon
                  sx={{
                    display: { xs: "inline-flex", sm: "none" },
                    fontSize: 21,
                  }}
                />
              </Button>
            </Box>

            {/* Search suggestions */}
            <Typography
              sx={{
                fontFamily: fontBody,
                fontSize: "0.78rem",
                color: "#8492a6",
                letterSpacing: "0.01em",
              }}
            >
              Наприклад: житло · робота · документи · послуги · події
            </Typography>
          </Box>
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
