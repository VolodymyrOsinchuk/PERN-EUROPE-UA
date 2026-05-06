import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Chip,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";

// ── Stats ─────────────────────────────────────────────────
const STATS = [
  { value: "12 000+", label: "Українців у Європі", icon: "🇺🇦" },
  { value: "8 країн", label: "Охоплення", icon: "🌍" },
  { value: "3 400+", label: "Оголошень", icon: "📋" },
  { value: "600+", label: "Подій щороку", icon: "🎉" },
];

// ── Features ──────────────────────────────────────────────
const FEATURES = [
  {
    icon: <ArticleOutlinedIcon sx={{ fontSize: 28, color: "#2563EB" }} />,
    bg: "#EFF6FF",
    title: "Новини та публікації",
    desc: "Актуальна інформація про зміни в законодавстві, соціальні програми та культурне життя діаспори.",
    href: "/news",
    label: "Читати новини",
  },
  {
    icon: <EventOutlinedIcon sx={{ fontSize: 28, color: "#10B981" }} />,
    bg: "#ECFDF5",
    title: "Афіша подій",
    desc: "Концерти, виставки, фестивалі та зустрічі громади — знайдіть те, що близьке серцю.",
    href: "/events",
    label: "Переглянути афішу",
  },
  {
    icon: <WorkOutlineIcon sx={{ fontSize: 28, color: "#F59E0B" }} />,
    bg: "#FFF7ED",
    title: "Оголошення",
    desc: "Робота, житло, послуги та освіта — дошка оголошень спеціально для українців в Європі.",
    href: "/ads",
    label: "До оголошень",
  },
  {
    icon: <ForumOutlinedIcon sx={{ fontSize: 28, color: "#8B5CF6" }} />,
    bg: "#F5F3FF",
    title: "Форум спільноти",
    desc: "Обговорення, поради та підтримка від людей, які пройшли той самий шлях.",
    href: "/forum",
    label: "Зайти на форум",
  },
];

// ── Categories ────────────────────────────────────────────
const CATEGORIES = [
  { icon: <WorkOutlineIcon sx={{ fontSize: 20 }} />, label: "Робота" },
  { icon: <HomeOutlinedIcon sx={{ fontSize: 20 }} />, label: "Житло" },
  { icon: <SchoolOutlinedIcon sx={{ fontSize: 20 }} />, label: "Освіта" },
  {
    icon: (
      <span className="material-icons" style={{ fontSize: 20 }}>
        local_hospital
      </span>
    ),
    label: "Медицина",
  },
  {
    icon: (
      <span className="material-icons" style={{ fontSize: 20 }}>
        description
      </span>
    ),
    label: "Документи",
  },
  {
    icon: (
      <span className="material-icons" style={{ fontSize: 20 }}>
        support_agent
      </span>
    ),
    label: "Послуги",
  },
];

// ── Testimonials ──────────────────────────────────────────
const TESTIMONIALS = [
  {
    text: "Завдяки цьому сайту я знайшла роботу в Берліні за два тижні. Спільнота тут дуже підтримуюча.",
    name: "Оксана М.",
    city: "Берлін, Німеччина",
    avatar: "О",
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    text: "Форум допоміг мені розібратися з документами для отримання дозволу на проживання у Франції.",
    name: "Андрій К.",
    city: "Париж, Франція",
    avatar: "А",
    color: "#10B981",
    bg: "#ECFDF5",
  },
  {
    text: "Знайшов чудову квартиру через оголошення. Тепер сам розміщую тут свої пропозиції послуг.",
    name: "Тарас Л.",
    city: "Варшава, Польща",
    avatar: "Т",
    color: "#F59E0B",
    bg: "#FFF7ED",
  },
];

const Landing = () => {
  return (
    <Box>
      {/* ── HERO ──────────────────────────────────────────── */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #0057B8 0%, #003d82 60%, #002a5c 100%)",
          color: "white",
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 10 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            bgcolor: "rgba(255,215,0,0.06)",
            top: -100,
            right: -100,
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            bgcolor: "rgba(255,215,0,0.04)",
            bottom: -50,
            left: -50,
            pointerEvents: "none",
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative" }}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip
                label="🇺🇦 Платформа для українців в Європі"
                sx={{
                  bgcolor: "rgba(255,215,0,0.15)",
                  color: "#FFD700",
                  fontWeight: 600,
                  mb: 3,
                  borderRadius: "99px",
                  border: "1px solid rgba(255,215,0,0.3)",
                }}
              />
              <Typography
                variant="h2"
                fontWeight={800}
                sx={{
                  letterSpacing: "-0.03em",
                  lineHeight: 1.15,
                  mb: 3,
                  fontSize: { xs: "2.2rem", md: "3.2rem" },
                }}
              >
                Ваш дім далеко{" "}
                <Box component="span" sx={{ color: "#FFD700" }}>
                  від дому
                </Box>
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  opacity: 0.85,
                  fontWeight: 400,
                  lineHeight: 1.6,
                  mb: 4,
                  maxWidth: 520,
                  fontSize: { xs: "1rem", md: "1.1rem" },
                }}
              >
                Об'єднуємо українців по всій Європі. Новини, оголошення, події
                та підтримка спільноти — все в одному місці.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/register"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: "#FFD700",
                    color: "#003d82",
                    fontWeight: 700,
                    px: 3.5,
                    "&:hover": { bgcolor: "#FFC300" },
                    boxShadow: "0 8px 24px rgba(255,215,0,0.3)",
                  }}
                >
                  Приєднатися безкоштовно
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  to="/ads"
                  sx={{
                    borderColor: "rgba(255,255,255,0.4)",
                    color: "white",
                    fontWeight: 600,
                    px: 3.5,
                    "&:hover": {
                      borderColor: "white",
                      bgcolor: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  Переглянути оголошення
                </Button>
              </Box>
            </Grid>

            {/* Stats side */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Grid container spacing={2}>
                {STATS.map((s) => (
                  <Grid key={s.label} size={{ xs: 6 }}>
                    <Paper
                      sx={{
                        p: 2.5,
                        bgcolor: "rgba(255,255,255,0.08)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 3,
                        textAlign: "center",
                        color: "white",
                      }}
                    >
                      <Typography fontSize="1.8rem" mb={0.5}>
                        {s.icon}
                      </Typography>
                      <Typography
                        variant="h5"
                        fontWeight={800}
                        sx={{ color: "#FFD700", letterSpacing: "-0.02em" }}
                      >
                        {s.value}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.75 }}>
                        {s.label}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── FEATURES ───────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#F8FAFC" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{ letterSpacing: "-0.02em", mb: 1.5 }}
            >
              Все що вам потрібно
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 500, mx: "auto" }}
            >
              Єдина платформа для інформації, спілкування та підтримки для
              українців у Європі
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {FEATURES.map((f) => (
              <Grid key={f.title} size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  sx={{
                    p: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: f.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2.5,
                    }}
                  >
                    {f.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {f.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ flexGrow: 1, lineHeight: 1.7 }}
                  >
                    {f.desc}
                  </Typography>
                  <Button
                    component={Link}
                    to={f.href}
                    size="small"
                    endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                    sx={{ mt: 2.5, alignSelf: "flex-start", fontWeight: 600 }}
                  >
                    {f.label}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CATEGORIES ─────────────────────────────────────── */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "white" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{ letterSpacing: "-0.02em", mb: 1 }}
            >
              Популярні категорії
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Знайдіть те, що вам потрібно
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {CATEGORIES.map((c) => (
              <Chip
                key={c.label}
                icon={c.icon}
                label={c.label}
                component={Link}
                to="/ads"
                clickable
                sx={{
                  px: 2,
                  py: 2.5,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  bgcolor: "#F8FAFC",
                  border: "1px solid rgba(15,23,42,0.08)",
                  "&:hover": {
                    bgcolor: "#EFF6FF",
                    borderColor: "#2563EB",
                    color: "#2563EB",
                  },
                }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── TESTIMONIALS ───────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#F8FAFC" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{ letterSpacing: "-0.02em", mb: 1 }}
            >
              Що кажуть наші користувачі
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {TESTIMONIALS.map((t) => (
              <Grid key={t.name} size={{ xs: 12, md: 4 }}>
                <Paper
                  sx={{
                    p: 3.5,
                    borderRadius: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.8,
                      flexGrow: 1,
                      mb: 3,
                      fontStyle: "italic",
                      color: "#334155",
                    }}
                  >
                    "{t.text}"
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: t.bg,
                        color: t.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                      }}
                    >
                      {t.avatar}
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={700}>
                        {t.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t.city}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CTA FINAL ──────────────────────────────────────── */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
          textAlign: "center",
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{ color: "#003d82", letterSpacing: "-0.02em", mb: 2 }}
          >
            Приєднуйтесь до нас сьогодні
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#003d82", opacity: 0.8, mb: 4, lineHeight: 1.7 }}
          >
            Безкоштовна реєстрація. Миттєвий доступ до спільноти, оголошень та
            корисних ресурсів.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/register"
              sx={{
                bgcolor: "#003d82",
                color: "white",
                fontWeight: 700,
                px: 4,
                "&:hover": { bgcolor: "#002a5c" },
              }}
            >
              Зареєструватися безкоштовно
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/about"
              sx={{
                borderColor: "#003d82",
                color: "#003d82",
                fontWeight: 600,
                px: 4,
                "&:hover": { bgcolor: "rgba(0,61,130,0.08)" },
              }}
            >
              Дізнатися більше
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
