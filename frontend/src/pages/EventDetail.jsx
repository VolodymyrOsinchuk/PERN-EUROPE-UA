import { useLoaderData, Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Chip,
  Divider,
  Grid,
  Avatar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { useAuthContext } from "../context/AuthContext";

/* ── Design tokens ── */
const F_BODY = "'Plus Jakarta Sans', sans-serif";
const F_DISPLAY = "'Playfair Display', serif";
const BLUE = "#0057B8";
const GOLD = "#FFD700";

const TYPE_COLORS = {
  "Культурний захід": { bg: "#f5f3ff", text: "#6d28d9" },
  Мистецтво: { bg: "#fdf4ff", text: "#7e22ce" },
  Фестиваль: { bg: "#fff7ed", text: "#9a3412" },
  Концерт: { bg: "#ecfdf5", text: "#065f46" },
};

/* ── Loader ── */
export async function loader({ params }) {
  try {
    const { data } = await customFetch.get(`/events/${params.id}`);
    return { event: data };
  } catch (error) {
    toast.error(error?.response?.data?.message || "Помилка завантаження події");
    return { event: null };
  }
}

/* ── Info row helper ── */
function InfoRow({ icon, label, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        p: 2,
        borderRadius: "12px",
        bgcolor: "#f8fafc",
        border: "1px solid #f1f5f9",
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "10px",
          bgcolor: "#eff6ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Box sx={{ color: BLUE }}>{icon}</Box>
      </Box>
      <Box>
        <Typography
          sx={{
            fontFamily: F_BODY,
            fontSize: "0.7rem",
            color: "#94a3b8",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            mb: 0.25,
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontFamily: F_BODY,
            fontWeight: 600,
            fontSize: "0.9rem",
            color: "#0f172a",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

/* ── Main Component ── */
export default function EventDetail() {
  const { event } = useLoaderData();
  const { user } = useAuthContext();

  if (!event) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              fontFamily: F_DISPLAY,
              fontSize: "1.4rem",
              color: "#94a3b8",
              mb: 2,
            }}
          >
            Подію не знайдено
          </Typography>
          <Button
            component={Link}
            to="/events"
            startIcon={<ArrowBackIcon />}
            sx={{
              fontFamily: F_BODY,
              fontWeight: 700,
              textTransform: "none",
              color: BLUE,
            }}
          >
            До афіші подій
          </Button>
        </Box>
      </Box>
    );
  }

  const typeClr = TYPE_COLORS[event.type] || { bg: "#f1f5f9", text: "#64748b" };
  const isPast = new Date(event.date) < new Date();
  const isOwner =
    user && (user.id === event.createdBy || user.role === "admin");

  const authorInitials = event.authorName
    ? event.authorName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* ── Hero header ── */}
      <Box
        sx={{
          background: isPast
            ? "linear-gradient(135deg, #64748b 0%, #334155 100%)"
            : "linear-gradient(135deg, #0057B8 0%, #003d82 55%, #002255 100%)",
          py: { xs: 6, md: 8 },
          position: "relative",
          overflow: "hidden",
        }}
      >
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
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, transparent, ${GOLD} 30%, ${GOLD} 70%, transparent)`,
            opacity: isPast ? 0.3 : 0.7,
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative" }}>
          <Button
            component={Link}
            to="/events"
            startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
            sx={{
              fontFamily: F_BODY,
              fontWeight: 600,
              textTransform: "none",
              color: "rgba(255,255,255,.7)",
              fontSize: "0.85rem",
              mb: 3,
              p: 0,
              "&:hover": { color: "#fff", bgcolor: "transparent" },
            }}
          >
            До афіші подій
          </Button>

          <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
            <Chip
              label={event.type || "Подія"}
              size="small"
              sx={{
                bgcolor: "rgba(255,255,255,.15)",
                color: "#fff",
                fontFamily: F_BODY,
                fontWeight: 700,
                fontSize: "0.72rem",
                border: "1px solid rgba(255,255,255,.2)",
              }}
            />
            <Chip
              label={isPast ? "Завершена" : "Заплановано"}
              size="small"
              sx={{
                bgcolor: isPast ? "rgba(0,0,0,.25)" : "rgba(16,185,129,.25)",
                color: "#fff",
                fontFamily: F_BODY,
                fontWeight: 700,
                fontSize: "0.72rem",
                border: `1px solid ${isPast ? "rgba(255,255,255,.1)" : "rgba(16,185,129,.4)"}`,
              }}
            />
          </Box>

          <Typography
            sx={{
              fontFamily: F_DISPLAY,
              fontWeight: 700,
              fontSize: { xs: "1.8rem", md: "2.6rem" },
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              mb: 2,
              maxWidth: 800,
            }}
          >
            {event.title}
          </Typography>

          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {[
              event.date && {
                icon: <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />,
                text: new Date(event.date).toLocaleDateString("uk-UA", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }),
              },
              event.location && {
                icon: <LocationOnOutlinedIcon sx={{ fontSize: 14 }} />,
                text: event.location,
              },
            ]
              .filter(Boolean)
              .map((item, i) => (
                <Box
                  key={i}
                  sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
                >
                  <Box sx={{ color: "rgba(255,255,255,.5)" }}>{item.icon}</Box>
                  <Typography
                    sx={{
                      fontFamily: F_BODY,
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,.75)",
                    }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={4}>
          {/* ── Main content ── */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1.5px solid #e2e8f0",
                p: { xs: 3, md: 4 },
                mb: 3,
                boxShadow: "0 4px 24px rgba(0,87,184,.06)",
              }}
            >
              <Box sx={{ mb: 2.5 }}>
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: BLUE,
                    mb: 0.5,
                  }}
                >
                  Про подію
                </Typography>
                <Box
                  sx={{
                    width: 40,
                    height: 3,
                    background: `linear-gradient(90deg, ${BLUE}, ${GOLD})`,
                    borderRadius: "99px",
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontFamily: F_BODY,
                  fontSize: "0.95rem",
                  color: "#334155",
                  lineHeight: 1.8,
                  whiteSpace: "pre-wrap",
                }}
              >
                {event.description}
              </Typography>
            </Paper>

            {/* Author */}
            {event.authorName && (
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  border: "1.5px solid #e2e8f0",
                  p: 3,
                  boxShadow: "0 4px 24px rgba(0,87,184,.06)",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    color: "#0f172a",
                    mb: 2,
                  }}
                >
                  Організатор
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      bgcolor: "#eff6ff",
                      color: BLUE,
                      fontWeight: 700,
                      fontSize: "0.9rem",
                    }}
                  >
                    {authorInitials}
                  </Avatar>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: F_BODY,
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: "#0f172a",
                      }}
                    >
                      {event.authorName}
                    </Typography>
                    {event.authorEmail && (
                      <Typography
                        sx={{
                          fontFamily: F_BODY,
                          fontSize: "0.78rem",
                          color: "#94a3b8",
                        }}
                      >
                        {event.authorEmail}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Paper>
            )}
          </Grid>

          {/* ── Sidebar ── */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1.5px solid #e2e8f0",
                p: 3,
                mb: 3,
                boxShadow: "0 4px 24px rgba(0,87,184,.06)",
              }}
            >
              <Typography
                sx={{
                  fontFamily: F_BODY,
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: "#0f172a",
                  mb: 2.5,
                }}
              >
                Деталі події
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {event.date && (
                  <InfoRow
                    icon={<CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} />}
                    label="Дата"
                    value={new Date(event.date).toLocaleDateString("uk-UA", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  />
                )}
                {event.location && (
                  <InfoRow
                    icon={<LocationOnOutlinedIcon sx={{ fontSize: 16 }} />}
                    label="Місце"
                    value={event.location}
                  />
                )}
                {event.type && (
                  <InfoRow
                    icon={<CategoryOutlinedIcon sx={{ fontSize: 16 }} />}
                    label="Тип"
                    value={event.type}
                  />
                )}
                {event.authorName && (
                  <InfoRow
                    icon={<PersonOutlinedIcon sx={{ fontSize: 16 }} />}
                    label="Організатор"
                    value={event.authorName}
                  />
                )}
              </Box>
            </Paper>

            {/* CTA */}
            {!isPast ? (
              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  fontFamily: F_BODY,
                  fontWeight: 700,
                  textTransform: "none",
                  bgcolor: BLUE,
                  borderRadius: "14px",
                  py: 1.5,
                  fontSize: "0.95rem",
                  boxShadow: "0 4px 14px rgba(0,87,184,.35)",
                  "&:hover": {
                    bgcolor: "#003d82",
                    transform: "translateY(-1px)",
                    boxShadow: "0 6px 20px rgba(0,87,184,.45)",
                  },
                  transition: "all 0.25s ease",
                  mb: 2,
                }}
              >
                Зареєструватися на подію
              </Button>
            ) : (
              <Box
                sx={{
                  p: 2,
                  borderRadius: "14px",
                  bgcolor: "#f1f5f9",
                  textAlign: "center",
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "#64748b",
                  }}
                >
                  Подія вже завершена
                </Typography>
              </Box>
            )}

            {/* Owner actions */}
            {isOwner && (
              <Button
                fullWidth
                variant="outlined"
                component={Link}
                to={`/profile/events/edit/${event.id}`}
                startIcon={<EditOutlinedIcon />}
                sx={{
                  fontFamily: F_BODY,
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: "14px",
                  py: 1.3,
                  borderColor: "#e2e8f0",
                  color: "#64748b",
                  "&:hover": { borderColor: BLUE, color: BLUE },
                }}
              >
                Редагувати подію
              </Button>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
