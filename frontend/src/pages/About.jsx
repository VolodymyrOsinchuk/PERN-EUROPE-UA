import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const TEAM = [
  {
    name: "Олена Ковальчук",
    role: "Засновниця & CEO",
    city: "Берлін",
    avatar: "О",
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    name: "Михайло Бондаренко",
    role: "Технічний директор",
    city: "Варшава",
    avatar: "М",
    color: "#10B981",
    bg: "#ECFDF5",
  },
  {
    name: "Наталія Шевченко",
    role: "Редактор контенту",
    city: "Париж",
    avatar: "Н",
    color: "#F59E0B",
    bg: "#FFF7ED",
  },
  {
    name: "Василь Петренко",
    role: "Менеджер спільноти",
    city: "Прага",
    avatar: "В",
    color: "#8B5CF6",
    bg: "#F5F3FF",
  },
];

const VALUES = [
  {
    icon: "🤝",
    title: "Солідарність",
    desc: "Ми підтримуємо один одного, ділимося досвідом та знаннями, щоб кожен міг адаптуватися швидше.",
  },
  {
    icon: "🔍",
    title: "Прозорість",
    desc: "Вся інформація перевірена та актуальна. Ми не розміщуємо рекламу та не продаємо дані.",
  },
  {
    icon: "🌍",
    title: "Інклюзивність",
    desc: "Платформа для всіх українців незалежно від регіону, статусу чи рівня знань мови країни перебування.",
  },
  {
    icon: "💪",
    title: "Незалежність",
    desc: "Некомерційний проект, що розвивається завдяки волонтерам та підтримці спільноти.",
  },
];

const MILESTONES = [
  {
    year: "2022",
    text: "Заснування платформи після початку повномасштабного вторгнення",
  },
  {
    year: "2023",
    text: "Запуск форуму та системи оголошень. Перші 5 000 користувачів",
  },
  {
    year: "2024",
    text: "Розширення до 8 країн Європи. Мобільний додаток у розробці",
  },
  {
    year: "2025",
    text: "Партнерство з українськими громадськими організаціями в ЄС",
  },
];

const About = () => {
  return (
    <Box>
      {/* ── HERO ─────────────────────────────────────────── */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0057B8 0%, #003d82 100%)",
          color: "white",
          py: { xs: 8, md: 11 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            bgcolor: "rgba(255,215,0,0.07)",
            pointerEvents: "none",
          }}
        />
        <Container
          maxWidth="md"
          sx={{ position: "relative", textAlign: "center" }}
        >
          <Chip
            label="Про нас"
            sx={{
              bgcolor: "rgba(255,215,0,0.15)",
              color: "#FFD700",
              fontWeight: 600,
              mb: 3,
              border: "1px solid rgba(255,215,0,0.3)",
            }}
          />
          <Typography
            variant="h2"
            fontWeight={800}
            sx={{
              letterSpacing: "-0.03em",
              mb: 2.5,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            Ми об'єднуємо{" "}
            <Box component="span" sx={{ color: "#FFD700" }}>
              українців Європи
            </Box>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.85,
              fontWeight: 400,
              lineHeight: 1.7,
              maxWidth: 560,
              mx: "auto",
            }}
          >
            "Українці в Європі" — некомерційна платформа, створена для допомоги
            українцям, які опинилися за кордоном, зберегти зв'язок зі своєю
            спільнотою та знайти необхідну підтримку.
          </Typography>
        </Container>
      </Box>

      {/* ── MISSION ──────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "white" }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="overline"
                sx={{
                  color: "#2563EB",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                }}
              >
                Наша місія
              </Typography>
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{ letterSpacing: "-0.02em", mb: 3, mt: 1 }}
              >
                Допомогти кожному українцю почуватися вдома
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.8, mb: 3 }}
              >
                Переїзд в іншу країну — це завжди виклик. Мова, документи, пошук
                роботи чи житла — ці завдання набагато простіші, коли поруч є
                люди, які вже через це пройшли.
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.8, mb: 4 }}
              >
                Ми створили платформу, де кожен може знайти відповіді на свої
                питання, поділитися досвідом та відчути підтримку великої
                української родини за кордоном.
              </Typography>
              {[
                "Перевірена та актуальна інформація",
                "Безпечне середовище для спілкування",
                "Доступно на 6 мовах",
                "Без реклами та продажу даних",
              ].map((item) => (
                <Box
                  key={item}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 1.5,
                  }}
                >
                  <CheckCircleOutlineIcon
                    sx={{ color: "#10B981", fontSize: 20 }}
                  />
                  <Typography variant="body2" fontWeight={500}>
                    {item}
                  </Typography>
                </Box>
              ))}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              {/* Timeline */}
              <Paper sx={{ p: 3.5, borderRadius: 3 }}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  gutterBottom
                  sx={{ mb: 3 }}
                >
                  Наша історія
                </Typography>
                {MILESTONES.map((m, i) => (
                  <Box key={m.year}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2.5,
                        pb: i < MILESTONES.length - 1 ? 2.5 : 0,
                      }}
                    >
                      <Box>
                        <Box
                          sx={{
                            width: 52,
                            height: 28,
                            borderRadius: "99px",
                            bgcolor: "#EFF6FF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            mt: 0.3,
                          }}
                        >
                          <Typography
                            variant="caption"
                            fontWeight={800}
                            sx={{ color: "#2563EB", fontSize: "0.7rem" }}
                          >
                            {m.year}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.7 }}
                      >
                        {m.text}
                      </Typography>
                    </Box>
                    {i < MILESTONES.length - 1 && (
                      <Divider sx={{ ml: 7, my: 0.5, opacity: 0.4 }} />
                    )}
                  </Box>
                ))}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── VALUES ───────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#F8FAFC" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{ letterSpacing: "-0.02em", mb: 1 }}
            >
              Наші цінності
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {VALUES.map((v) => (
              <Grid key={v.title} size={{ xs: 12, sm: 6 }}>
                <Paper
                  sx={{
                    p: 3.5,
                    borderRadius: 3,
                    height: "100%",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "translateY(-2px)" },
                  }}
                >
                  <Typography fontSize="2rem" mb={1.5}>
                    {v.icon}
                  </Typography>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {v.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
                  >
                    {v.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── TEAM ─────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "white" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{ letterSpacing: "-0.02em", mb: 1 }}
            >
              Наша команда
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Волонтери, що присвячують час та знання розвитку платформи
            </Typography>
          </Box>
          <Grid container spacing={3} justifyContent="center">
            {TEAM.map((member) => (
              <Grid key={member.name} size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  sx={{
                    p: 3,
                    textAlign: "center",
                    borderRadius: 3,
                    transition: "transform 0.2s",
                    "&:hover": { transform: "translateY(-3px)" },
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      bgcolor: member.bg,
                      color: member.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "1.5rem",
                      mx: "auto",
                      mb: 2,
                      border: `2px solid ${member.color}22`,
                    }}
                  >
                    {member.avatar}
                  </Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {member.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {member.role}
                  </Typography>
                  <Chip
                    label={member.city}
                    size="small"
                    icon={
                      <span className="material-icons" style={{ fontSize: 13 }}>
                        location_on
                      </span>
                    }
                    sx={{ fontSize: "0.7rem", bgcolor: "#F8FAFC" }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CTA ──────────────────────────────────────────── */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
          textAlign: "center",
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ color: "#003d82", letterSpacing: "-0.02em", mb: 2 }}
          >
            Хочете долучитися?
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#003d82", opacity: 0.8, mb: 4 }}
          >
            Ми завжди раді новим волонтерам, партнерам та активним членам
            спільноти.
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
              endIcon={<ArrowForwardIcon />}
            >
              Зареєструватися
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/contact"
              sx={{
                borderColor: "#003d82",
                color: "#003d82",
                fontWeight: 600,
                px: 4,
                "&:hover": { bgcolor: "rgba(0,61,130,0.08)" },
              }}
            >
              Написати нам
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default About;
