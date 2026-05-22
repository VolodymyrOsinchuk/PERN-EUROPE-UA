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
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { useAuthContext } from "../context/AuthContext";

/* ── Design tokens ── */
const F_BODY = "'Plus Jakarta Sans', sans-serif";
const F_DISPLAY = "'Playfair Display', serif";
const BLUE = "#0057B8";
const GOLD = "#FFD700";

const CAT_COLORS = {
  Документи: { bg: "#eff6ff", text: "#1d4ed8" },
  Робота: { bg: "#ecfdf5", text: "#065f46" },
  Житло: { bg: "#fff7ed", text: "#9a3412" },
  Освіта: { bg: "#f5f3ff", text: "#6d28d9" },
  Медицина: { bg: "#fff1f2", text: "#be123c" },
  Культура: { bg: "#fdf4ff", text: "#7e22ce" },
  Інтеграція: { bg: "#f0fdf4", text: "#166534" },
};

/* ── Loader ── */
export async function loader({ params }) {
  try {
    const { data } = await customFetch.get(`/publications/${params.id}`);
    return { article: data };
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Помилка завантаження публікації",
    );
    return { article: null };
  }
}

/* ── Main Component ── */
export default function PublicationDetail() {
  const { article } = useLoaderData();
  const { user } = useAuthContext();

  if (!article) {
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
            Публікацію не знайдено
          </Typography>
          <Button
            component={Link}
            to="/publications"
            startIcon={<ArrowBackIcon />}
            sx={{
              fontFamily: F_BODY,
              fontWeight: 700,
              textTransform: "none",
              color: BLUE,
            }}
          >
            До публікацій
          </Button>
        </Box>
      </Box>
    );
  }

  const clr = CAT_COLORS[article.category] || {
    bg: "#f1f5f9",
    text: "#64748b",
  };
  const isOwner =
    user && (user.id === article.createdBy || user.role === "admin");

  const authorInitials = article.author
    ? article.author
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
          background:
            "linear-gradient(135deg, #0057B8 0%, #003d82 55%, #002255 100%)",
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
            opacity: 0.7,
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative" }}>
          <Button
            component={Link}
            to="/publications"
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
            До публікацій
          </Button>

          {/* Category + read time */}
          <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
            {article.category && (
              <Chip
                label={article.category}
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
            )}
            {article.readTime && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <AccessTimeIcon
                  sx={{ fontSize: 14, color: "rgba(255,255,255,.5)" }}
                />
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,.65)",
                  }}
                >
                  {article.readTime} читання
                </Typography>
              </Box>
            )}
          </Box>

          <Typography
            sx={{
              fontFamily: F_DISPLAY,
              fontWeight: 700,
              fontSize: { xs: "1.8rem", md: "2.6rem" },
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              mb: 2.5,
              maxWidth: 820,
            }}
          >
            {article.title}
          </Typography>

          {/* Author + date in hero */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: "rgba(255,255,255,.15)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.8rem",
                border: "2px solid rgba(255,255,255,.3)",
              }}
            >
              {authorInitials}
            </Avatar>
            <Box>
              <Typography
                sx={{
                  fontFamily: F_BODY,
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: "#fff",
                }}
              >
                {article.author || "Автор"}
              </Typography>
              {article.date && (
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontSize: "0.75rem",
                    color: "rgba(255,255,255,.6)",
                  }}
                >
                  {new Date(article.date).toLocaleDateString("uk-UA", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Typography>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={4}>
          {/* ── Article body ── */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "20px",
                border: "1.5px solid #e2e8f0",
                p: { xs: 3, md: 5 },
                mb: 3,
                boxShadow: "0 4px 24px rgba(0,87,184,.06)",
              }}
            >
              {/* Colour accent bar matching category */}
              <Box
                sx={{
                  height: 4,
                  bgcolor: clr.text,
                  opacity: 0.5,
                  borderRadius: "99px",
                  mb: 4,
                }}
              />

              <Typography
                component="div"
                sx={{
                  fontFamily: F_BODY,
                  fontSize: "1rem",
                  color: "#334155",
                  lineHeight: 1.9,
                  whiteSpace: "pre-wrap",
                  "& p": { mb: 2 },
                }}
              >
                {article.content}
              </Typography>
            </Paper>

            {/* Share / bookmark row */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: "16px",
                border: "1.5px solid #e2e8f0",
                p: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
                boxShadow: "0 2px 12px rgba(0,0,0,.04)",
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
                Поділитися публікацією:
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  size="small"
                  startIcon={<BookmarkBorderIcon sx={{ fontSize: 15 }} />}
                  sx={{
                    fontFamily: F_BODY,
                    fontWeight: 600,
                    textTransform: "none",
                    color: "#64748b",
                    fontSize: "0.8rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    px: 1.5,
                    "&:hover": { color: BLUE, borderColor: BLUE },
                  }}
                >
                  Зберегти
                </Button>
                <Button
                  size="small"
                  startIcon={
                    <span className="material-icons" style={{ fontSize: 15 }}>
                      share
                    </span>
                  }
                  sx={{
                    fontFamily: F_BODY,
                    fontWeight: 600,
                    textTransform: "none",
                    color: "#64748b",
                    fontSize: "0.8rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    px: 1.5,
                    "&:hover": { color: BLUE, borderColor: BLUE },
                  }}
                >
                  Поділитися
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* ── Sidebar ── */}
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Author card */}
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
                Про автора
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: clr.bg,
                    color: clr.text,
                    fontWeight: 700,
                    fontSize: "0.95rem",
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
                    {article.author || "Автор"}
                  </Typography>
                  {article.date && (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <CalendarTodayOutlinedIcon
                        sx={{ fontSize: 12, color: "#94a3b8" }}
                      />
                      <Typography
                        sx={{
                          fontFamily: F_BODY,
                          fontSize: "0.72rem",
                          color: "#94a3b8",
                        }}
                      >
                        {new Date(article.date).toLocaleDateString("uk-UA")}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
              <Divider sx={{ borderColor: "#f1f5f9", mb: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontSize: "0.78rem",
                    color: "#64748b",
                  }}
                >
                  Категорія
                </Typography>
                {article.category && (
                  <Chip
                    label={article.category}
                    size="small"
                    sx={{
                      bgcolor: clr.bg,
                      color: clr.text,
                      fontFamily: F_BODY,
                      fontWeight: 700,
                      fontSize: "0.68rem",
                    }}
                  />
                )}
              </Box>
              {article.readTime && (
                <>
                  <Divider sx={{ borderColor: "#f1f5f9", my: 1.5 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: F_BODY,
                        fontSize: "0.78rem",
                        color: "#64748b",
                      }}
                    >
                      Час читання
                    </Typography>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <AccessTimeIcon sx={{ fontSize: 13, color: "#94a3b8" }} />
                      <Typography
                        sx={{
                          fontFamily: F_BODY,
                          fontWeight: 600,
                          fontSize: "0.78rem",
                          color: "#0f172a",
                        }}
                      >
                        {article.readTime}
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
            </Paper>

            {/* Owner actions */}
            {isOwner && (
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
                    mb: 2,
                  }}
                >
                  Керування
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  component={Link}
                  to={`/profile/publications/edit/${article.id}`}
                  startIcon={<EditOutlinedIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    fontFamily: F_BODY,
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: "12px",
                    py: 1.2,
                    borderColor: BLUE,
                    color: BLUE,
                    bgcolor: "#eff6ff",
                    "&:hover": { bgcolor: "#dbeafe" },
                  }}
                >
                  Редагувати публікацію
                </Button>
              </Paper>
            )}

            {/* Back to list */}
            <Button
              fullWidth
              variant="outlined"
              component={Link}
              to="/publications"
              startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
              sx={{
                fontFamily: F_BODY,
                fontWeight: 700,
                textTransform: "none",
                borderRadius: "12px",
                py: 1.3,
                borderColor: "#e2e8f0",
                color: "#64748b",
                "&:hover": { borderColor: BLUE, color: BLUE },
              }}
            >
              Усі публікації
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
