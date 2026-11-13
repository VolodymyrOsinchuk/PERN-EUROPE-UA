import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
  Divider,
  Stack,
  Avatar,
} from "@mui/material";

import { Link } from "react-router-dom";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { HeroSection } from "../components";

// ============================================
// DESIGN SYSTEM
// ============================================

const COLORS = {
  navy: "#0B1F38",
  blue: "#0757A6",
  blueLight: "#EFF6FF",
  gold: "#E5B83F",
  goldLight: "#FFF8E7",
  background: "#F7F9FC",
  white: "#FFFFFF",
  text: "#172B43",
  muted: "#718096",
  border: "#E8EDF3",
  green: "#15966B",
};

const FONT_DISPLAY = "'Playfair Display', Georgia, serif";
const FONT_BODY = "'Plus Jakarta Sans', sans-serif";

const sectionTitleSx = {
  fontFamily: FONT_DISPLAY,
  fontWeight: 700,
  fontSize: {
    xs: "2rem",
    sm: "2.5rem",
    md: "3rem",
  },
  lineHeight: 1.2,
  letterSpacing: "-0.035em",
  color: COLORS.navy,
};

const sectionLabelSx = {
  fontFamily: FONT_BODY,
  fontSize: ".72rem",
  fontWeight: 800,
  letterSpacing: ".15em",
  textTransform: "uppercase",
  color: COLORS.blue,
};

// ============================================
// TEAM
// ============================================

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
    color: "#D69A22",
    bg: "#FFF7E8",
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

// ============================================
// VALUES
// ============================================

const VALUES = [
  {
    number: "01",
    icon: <GroupsOutlinedIcon />,
    title: "Солідарність",
    desc: "Ми підтримуємо один одного, ділимося досвідом та знаннями, щоб кожен міг адаптуватися швидше.",
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    number: "02",
    icon: <VerifiedOutlinedIcon />,
    title: "Прозорість",
    desc: "Ми прагнемо надавати перевірену інформацію, чесно комунікувати та відповідально ставитися до довіри спільноти.",
    color: "#15966B",
    bg: "#ECFDF5",
  },
  {
    number: "03",
    icon: <PublicOutlinedIcon />,
    title: "Інклюзивність",
    desc: "Платформа для українців незалежно від країни перебування, життєвого досвіду чи рівня знання місцевої мови.",
    color: "#D69A22",
    bg: "#FFF8E7",
  },
  {
    number: "04",
    icon: <FavoriteBorderRoundedIcon />,
    title: "Незалежність",
    desc: "Ми розвиваємо спільноту, орієнтуючись на її потреби, взаємодопомогу та довгострокову цінність.",
    color: "#8B5CF6",
    bg: "#F5F3FF",
  },
];

// ============================================
// TIMELINE
// ============================================

const MILESTONES = [
  {
    year: "2022",
    title: "Початок історії",
    text: "Заснування платформи після початку повномасштабного вторгнення.",
  },
  {
    year: "2023",
    title: "Розвиток спільноти",
    text: "Запуск форуму та системи оголошень. Перші 5 000 користувачів.",
  },
  {
    year: "2024",
    title: "Європейське розширення",
    text: "Розширення до 8 країн Європи. Мобільний додаток у розробці.",
  },
  {
    year: "2025",
    title: "Нові партнерства",
    text: "Партнерство з українськими громадськими організаціями в ЄС.",
  },
];

// ============================================
// REUSABLE SECTION HEADING
// ============================================

function SectionHeading({ eyebrow, title, description, align = "left" }) {
  return (
    <Box
      sx={{
        textAlign: align,
        maxWidth: align === "center" ? 680 : 650,
        mx: align === "center" ? "auto" : 0,
      }}
    >
      {eyebrow && <Typography sx={sectionLabelSx}>{eyebrow}</Typography>}

      <Typography
        component="h2"
        sx={{
          ...sectionTitleSx,
          mt: 1.5,
          mb: description ? 2 : 0,
        }}
      >
        {title}
      </Typography>

      {description && (
        <Typography
          sx={{
            fontFamily: FONT_BODY,
            color: COLORS.muted,
            fontSize: {
              xs: ".92rem",
              md: "1rem",
            },
            lineHeight: 1.9,
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
}

// ============================================
// MAIN ABOUT PAGE
// ============================================

const About = () => {
  return (
    <Box
      sx={{
        background: COLORS.white,
        overflow: "hidden",
        fontFamily: FONT_BODY,

        "& *": {
          boxSizing: "border-box",
        },
      }}
    >
      {/* ====================================== */}
      {/* HERO */}
      {/* ====================================== */}

      <HeroSection
        title="Українці в Європі"
        badge="НАША ІСТОРІЯ · НАШІ ЦІННОСТІ"
        typedStrings={[
          "Ми об'єднуємо українців Європи",
          "Разом створюємо сильну спільноту",
          "Україна залишається в серці",
        ]}
        subtitle="Платформа, що допомагає українцям за кордоном знаходити підтримку, корисну інформацію та відчувати себе частиною великої спільноти."
        size="lg"
      />

      {/* ====================================== */}
      {/* MISSION */}
      {/* ====================================== */}

      <Box
        component="section"
        sx={{
          py: {
            xs: 8,
            md: 13,
          },
          background: COLORS.white,
        }}
      >
        <Container maxWidth="lg">
          <Grid
            container
            spacing={{
              xs: 5,
              md: 9,
            }}
            alignItems="center"
          >
            {/* LEFT SIDE */}

            <Grid size={{ xs: 12, md: 6 }}>
              <SectionHeading
                eyebrow="НАША МІСІЯ"
                title="Відстань не повинна розділяти."
              />

              <Typography
                sx={{
                  fontFamily: FONT_BODY,
                  fontSize: {
                    xs: ".95rem",
                    md: "1rem",
                  },
                  lineHeight: 2,
                  color: COLORS.muted,
                  mt: 3,
                  mb: 2.5,
                }}
              >
                Переїзд в іншу країну — це новий етап життя, який часто
                супроводжується невизначеністю. Мова, документи, пошук роботи чи
                житла — ці завдання набагато простіші, коли поруч є люди, які
                вже пройшли цей шлях.
              </Typography>

              <Typography
                sx={{
                  fontFamily: FONT_BODY,
                  fontSize: {
                    xs: ".95rem",
                    md: "1rem",
                  },
                  lineHeight: 2,
                  color: COLORS.muted,
                  mb: 4,
                }}
              >
                Ми створюємо простір, де українці можуть знаходити відповіді,
                ділитися досвідом, допомагати один одному та зберігати зв'язок
                зі своєю культурою.
              </Typography>

              {/* MISSION POINTS */}

              <Stack spacing={2}>
                {[
                  "Корисна інформація для життя в Європі",
                  "Простір для спілкування та взаємодопомоги",
                  "Підтримка українців у різних країнах",
                  "Збереження української ідентичності",
                ].map((item) => (
                  <Box
                    key={item}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.5,
                    }}
                  >
                    <CheckCircleRoundedIcon
                      sx={{
                        color: COLORS.green,
                        fontSize: 21,
                        mt: "2px",
                        flexShrink: 0,
                      }}
                    />

                    <Typography
                      sx={{
                        fontFamily: FONT_BODY,
                        fontSize: ".9rem",
                        fontWeight: 600,
                        color: COLORS.text,
                        lineHeight: 1.7,
                      }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>

            {/* RIGHT SIDE — TIMELINE */}

            <Grid size={{ xs: 12, md: 6 }}>
              {/* PREMIUM TIMELINE CARD */}

              <Paper
                elevation={0}
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "24px",
                  border: `1px solid ${COLORS.border}`,
                  p: {
                    xs: 3,
                    sm: 4,
                    md: 4.5,
                  },
                  background:
                    "linear-gradient(145deg, #FFFFFF 0%, #F8FAFD 100%)",
                  boxShadow: "0 18px 55px rgba(11,31,56,.06)",
                }}
              >
                {/* DECORATION */}

                <Box
                  sx={{
                    position: "absolute",
                    width: 180,
                    height: 180,
                    borderRadius: "50%",
                    background: COLORS.goldLight,
                    opacity: 0.6,
                    top: -110,
                    right: -70,
                    pointerEvents: "none",
                  }}
                />

                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 4,
                      gap: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: FONT_DISPLAY,
                        fontSize: "1.55rem",
                        fontWeight: 700,
                        color: COLORS.navy,
                      }}
                    >
                      Наша історія
                    </Typography>

                    <Chip
                      label="2022 — 2025"
                      size="small"
                      sx={{
                        bgcolor: COLORS.goldLight,
                        color: "#916C12",
                        fontFamily: FONT_BODY,
                        fontWeight: 700,
                        fontSize: ".7rem",
                        borderRadius: "8px",
                      }}
                    />
                  </Box>

                  {/* TIMELINE */}

                  <Box
                    sx={{
                      position: "relative",
                      pl: 0.5,

                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: 17,
                        top: 15,
                        bottom: 25,
                        width: 2,
                        background:
                          "linear-gradient(to bottom, #E5B83F, #DCE6F2)",
                      },
                    }}
                  >
                    {MILESTONES.map((item, index) => (
                      <Box
                        key={item.year}
                        sx={{
                          display: "flex",
                          gap: 2.5,
                          position: "relative",
                          pb: index !== MILESTONES.length - 1 ? 4 : 0,
                        }}
                      >
                        {/* TIMELINE DOT */}

                        <Box
                          sx={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            background:
                              index === MILESTONES.length - 1
                                ? COLORS.goldLight
                                : COLORS.blueLight,
                            border: `2px solid ${
                              index === MILESTONES.length - 1
                                ? COLORS.gold
                                : "#D7E7FA"
                            }`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            position: "relative",
                            zIndex: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor:
                                index === MILESTONES.length - 1
                                  ? COLORS.gold
                                  : COLORS.blue,
                            }}
                          />
                        </Box>

                        {/* TIMELINE CONTENT */}

                        <Box sx={{ pt: 0.2 }}>
                          <Typography
                            sx={{
                              fontFamily: FONT_BODY,
                              color: COLORS.blue,
                              fontWeight: 800,
                              fontSize: ".73rem",
                              letterSpacing: ".08em",
                              mb: 0.5,
                            }}
                          >
                            {item.year}
                          </Typography>

                          <Typography
                            sx={{
                              fontFamily: FONT_BODY,
                              color: COLORS.navy,
                              fontWeight: 700,
                              fontSize: ".95rem",
                              mb: 0.7,
                            }}
                          >
                            {item.title}
                          </Typography>

                          <Typography
                            sx={{
                              fontFamily: FONT_BODY,
                              color: COLORS.muted,
                              fontSize: ".83rem",
                              lineHeight: 1.8,
                            }}
                          >
                            {item.text}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ====================================== */}
      {/* VALUES SECTION */}
      {/* ====================================== */}

      <Box
        component="section"
        sx={{
          py: {
            xs: 8,
            md: 13,
          },
          background: COLORS.background,
          position: "relative",
        }}
      >
        <Container maxWidth="lg">
          {/* SECTION HEADER */}

          <Box sx={{ mb: 7 }}>
            <SectionHeading
              eyebrow="НАШІ ПРИНЦИПИ"
              title="Цінності, які нас об'єднують"
              description="Ми будуємо не просто інформаційну платформу. Ми створюємо середовище довіри, взаємоповаги та підтримки."
              align="center"
            />
          </Box>

          {/* VALUE CARDS */}

          <Grid container spacing={3}>
            {VALUES.map((value) => (
              <Grid key={value.title} size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    position: "relative",
                    height: "100%",
                    minHeight: 280,
                    p: {
                      xs: 3,
                      md: 3.5,
                    },

                    borderRadius: "20px",
                    border: `1px solid ${COLORS.border}`,
                    background: COLORS.white,

                    transition:
                      "transform .3s ease, box-shadow .3s ease, border-color .3s ease",

                    "&:hover": {
                      transform: "translateY(-7px)",
                      borderColor: `${value.color}55`,
                      boxShadow: "0 20px 45px rgba(11,31,56,.08)",
                    },

                    "&:hover .value-icon": {
                      transform: "scale(1.08) rotate(-5deg)",
                    },
                  }}
                >
                  {/* NUMBER */}

                  <Typography
                    sx={{
                      position: "absolute",
                      top: 22,
                      right: 24,
                      fontFamily: FONT_DISPLAY,
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#CBD5E1",
                    }}
                  >
                    {value.number}
                  </Typography>

                  {/* ICON */}

                  <Box
                    className="value-icon"
                    sx={{
                      width: 58,
                      height: 58,
                      borderRadius: "17px",
                      bgcolor: value.bg,
                      color: value.color,

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      mb: 3,

                      transition: "transform .3s ease",

                      "& svg": {
                        fontSize: 28,
                      },
                    }}
                  >
                    {value.icon}
                  </Box>

                  {/* TITLE */}

                  <Typography
                    component="h3"
                    sx={{
                      fontFamily: FONT_DISPLAY,
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      color: COLORS.navy,
                      mb: 1.5,
                    }}
                  >
                    {value.title}
                  </Typography>

                  {/* DESCRIPTION */}

                  <Typography
                    sx={{
                      fontFamily: FONT_BODY,
                      fontSize: ".82rem",
                      lineHeight: 1.9,
                      color: COLORS.muted,
                    }}
                  >
                    {value.desc}
                  </Typography>

                  {/* BOTTOM ACCENT */}

                  <Box
                    sx={{
                      width: 34,
                      height: 3,
                      borderRadius: 5,
                      bgcolor: value.color,
                      mt: 3,
                      opacity: 0.75,
                    }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ====================================== */}
      {/* TEAM SECTION */}
      {/* ====================================== */}

      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 13 },
          background: COLORS.white,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 7 }}>
            <SectionHeading
              eyebrow="ЛЮДИ ЗА ПРОЄКТОМ"
              title="Наша команда"
              description="Люди, об'єднані спільною метою — допомагати українцям будувати нове життя в Європі."
              align="center"
            />
          </Box>

          <Grid container spacing={3}>
            {TEAM.map((member, index) => (
              <Grid key={member.name} size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: 3,
                    borderRadius: "22px",
                    border: `1px solid ${COLORS.border}`,
                    background: "#FFFFFF",
                    textAlign: "center",
                    transition: "all .3s ease",

                    "&:hover": {
                      transform: "translateY(-7px)",
                      boxShadow: "0 20px 45px rgba(11,31,56,.09)",
                      borderColor: `${member.color}55`,
                    },
                  }}
                >
                  {/* AVATAR */}

                  <Box
                    sx={{
                      position: "relative",
                      width: 94,
                      height: 94,
                      mx: "auto",
                      mb: 3,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 88,
                        height: 88,
                        bgcolor: member.bg,
                        color: member.color,
                        fontFamily: FONT_DISPLAY,
                        fontWeight: 700,
                        fontSize: "2.2rem",
                        border: `3px solid ${COLORS.white}`,
                        boxShadow: "0 5px 20px rgba(11,31,56,.08)",
                      }}
                    >
                      {member.avatar}
                    </Avatar>

                    <Box
                      sx={{
                        position: "absolute",
                        width: 19,
                        height: 19,
                        borderRadius: "50%",
                        bgcolor: COLORS.green,
                        border: "3px solid white",
                        bottom: 4,
                        right: 4,
                      }}
                    />
                  </Box>

                  {/* MEMBER INFO */}

                  <Typography
                    component="h3"
                    sx={{
                      fontFamily: FONT_DISPLAY,
                      fontWeight: 700,
                      fontSize: "1.12rem",
                      color: COLORS.navy,
                      mb: 1,
                    }}
                  >
                    {member.name}
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: FONT_BODY,
                      fontSize: ".78rem",
                      color: COLORS.muted,
                      lineHeight: 1.7,
                      minHeight: 42,
                      mb: 2,
                    }}
                  >
                    {member.role}
                  </Typography>

                  <Divider
                    sx={{
                      mb: 2,
                      borderColor: COLORS.border,
                    }}
                  />

                  <Chip
                    icon={
                      <LocationOnOutlinedIcon
                        sx={{
                          fontSize: "15px !important",
                        }}
                      />
                    }
                    label={member.city}
                    size="small"
                    sx={{
                      bgcolor: COLORS.background,
                      color: COLORS.text,
                      fontFamily: FONT_BODY,
                      fontSize: ".72rem",
                      fontWeight: 600,
                      borderRadius: "8px",
                      "& .MuiChip-icon": {
                        color: COLORS.blue,
                      },
                    }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* TEAM NOTE */}

          <Box
            sx={{
              mt: 5,
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <GroupsOutlinedIcon
              sx={{
                fontSize: 19,
                color: COLORS.blue,
              }}
            />

            <Typography
              sx={{
                fontFamily: FONT_BODY,
                fontSize: ".82rem",
                color: COLORS.muted,
              }}
            >
              За розвитком платформи стоїть спільнота небайдужих людей.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ====================================== */}
      {/* FINAL CTA */}
      {/* ====================================== */}

      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          px: { xs: 2, md: 3 },
          background: COLORS.background,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: {
                xs: "22px",
                md: "30px",
              },
              background:
                "linear-gradient(125deg, #071B33 0%, #003D82 65%, #0757A6 100%)",
              px: { xs: 3, sm: 5, md: 8 },
              py: { xs: 6, md: 8 },
              textAlign: "center",
              boxShadow: "0 24px 60px rgba(0,61,130,.16)",
            }}
          >
            {/* DECORATIVE ELEMENTS */}

            <Box
              sx={{
                position: "absolute",
                width: 350,
                height: 350,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,.08)",
                top: -200,
                right: -100,
                pointerEvents: "none",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                width: 240,
                height: 240,
                borderRadius: "50%",
                border: "1px solid rgba(255,215,0,.15)",
                bottom: -170,
                left: -70,
                pointerEvents: "none",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                width: 260,
                height: 260,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255,215,0,.12), transparent 70%)",
                top: "20%",
                left: "50%",
                transform: "translateX(-50%)",
                pointerEvents: "none",
              }}
            />

            {/* CONTENT */}

            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                maxWidth: 730,
                mx: "auto",
              }}
            >
              <Chip
                icon={
                  <FavoriteBorderRoundedIcon
                    sx={{
                      fontSize: "15px !important",
                    }}
                  />
                }
                label="БУДЬ ЧАСТИНОЮ СПІЛЬНОТИ"
                sx={{
                  mb: 3,
                  color: "#FFD700",
                  bgcolor: "rgba(255,215,0,.10)",
                  border: "1px solid rgba(255,215,0,.25)",
                  fontFamily: FONT_BODY,
                  fontSize: ".68rem",
                  fontWeight: 800,
                  letterSpacing: ".09em",
                  "& .MuiChip-icon": {
                    color: "#FFD700",
                  },
                }}
              />

              <Typography
                component="h2"
                sx={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  fontSize: {
                    xs: "2rem",
                    sm: "2.6rem",
                    md: "3.4rem",
                  },
                  lineHeight: 1.2,
                  letterSpacing: "-.035em",
                  mb: 2.5,
                }}
              >
                Разом ми можемо
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    color: "#FFD700",
                  }}
                >
                  набагато більше.
                </Box>
              </Typography>

              <Typography
                sx={{
                  fontFamily: FONT_BODY,
                  fontSize: {
                    xs: ".9rem",
                    md: "1rem",
                  },
                  lineHeight: 1.9,
                  color: "rgba(255,255,255,.75)",
                  maxWidth: 570,
                  mx: "auto",
                  mb: 4,
                }}
              >
                Приєднуйтеся до української спільноти в Європі. Діліться
                досвідом, знаходьте підтримку та допомагайте іншим.
              </Typography>

              {/* CTA BUTTONS */}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    bgcolor: "#FFD700",
                    color: "#07366B",
                    fontFamily: FONT_BODY,
                    fontWeight: 800,
                    textTransform: "none",
                    borderRadius: "12px",
                    px: 3.5,
                    py: 1.5,
                    boxShadow: "0 8px 25px rgba(255,215,0,.22)",
                    "&:hover": {
                      bgcolor: "#FFE36A",
                      transform: "translateY(-3px)",
                      boxShadow: "0 12px 30px rgba(255,215,0,.3)",
                    },
                    transition: "all .25s ease",
                  }}
                >
                  Зареєструватися
                </Button>

                <Button
                  component={Link}
                  to="/contact"
                  variant="outlined"
                  size="large"
                  sx={{
                    color: "#FFFFFF",
                    borderColor: "rgba(255,255,255,.4)",
                    fontFamily: FONT_BODY,
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: "12px",
                    px: 3.5,
                    py: 1.5,
                    "&:hover": {
                      borderColor: "#FFFFFF",
                      bgcolor: "rgba(255,255,255,.08)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all .25s ease",
                  }}
                >
                  Написати нам
                </Button>
              </Box>

              {/* FOOTNOTE */}

              <Typography
                sx={{
                  mt: 4,
                  fontFamily: FONT_BODY,
                  fontSize: ".72rem",
                  color: "rgba(255,255,255,.5)",
                  letterSpacing: ".03em",
                }}
              >
                Українці в Європі · Разом сильніші
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default About;
