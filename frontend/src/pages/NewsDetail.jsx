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
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useState } from "react";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

/* ── Design tokens — identiques au reste du projet ── */
const F_BODY = "'Plus Jakarta Sans', sans-serif";
const F_DISPLAY = "'Playfair Display', serif";
const BLUE = "#0057B8";
const GOLD = "#FFD700";

const IMPORTANCE_CONFIG = {
  high: { label: "Важливо", bg: "#fef2f2", text: "#991b1b", dot: "#dc2626" },
  medium: {
    label: "Середня важливість",
    bg: "#fff7ed",
    text: "#9a3412",
    dot: "#f97316",
  },
  low: {
    label: "Інформаційно",
    bg: "#f0fdf4",
    text: "#166534",
    dot: "#22c55e",
  },
};

const CAT_COLORS = {
  "Соціальна допомога": { bg: "#fef2f2", text: "#991b1b" },
  Культура: { bg: "#f5f3ff", text: "#6d28d9" },
  Робота: { bg: "#ecfdf5", text: "#065f46" },
  Освіта: { bg: "#fff7ed", text: "#9a3412" },
  Сécurité: { bg: "#fef2f2", text: "#991b1b" },
  Анонс: { bg: "#eff6ff", text: "#1d4ed8" },
};

/* ── Loader ── */
export async function loader({ params }) {
  try {
    const { data } = await customFetch.get(`/news/${params.id}`);
    return { article: data };
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Помилка завантаження новини",
    );
    return { article: null };
  }
}

/* ── Share helper ── */
function shareArticle(title) {
  if (navigator.share) {
    navigator.share({ title, url: window.location.href }).catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Посилання скопійовано!");
  }
}

/* ── Sidebar: related metadata card ── */
function MetaCard({ article }) {
  const imp = IMPORTANCE_CONFIG[article.importance] || IMPORTANCE_CONFIG.medium;
  const catClr = CAT_COLORS[article.category] || {
    bg: "#f1f5f9",
    text: "#64748b",
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "20px",
        border: "1.5px solid #e2e8f0",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,87,184,.07)",
        position: "sticky",
        top: 90,
      }}
    >
      <Box
        sx={{
          height: 5,
          background: `linear-gradient(90deg, ${BLUE}, ${GOLD})`,
        }}
      />
      <Box sx={{ p: 3 }}>
        <Typography
          sx={{
            fontFamily: F_BODY,
            fontWeight: 700,
            fontSize: "0.875rem",
            color: "#0f172a",
            mb: 2.5,
          }}
        >
          Деталі новини
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Date */}
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
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
              <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: BLUE }} />
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
                Дата публікації
              </Typography>
              <Typography
                sx={{
                  fontFamily: F_BODY,
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "#0f172a",
                }}
              >
                {article.date
                  ? new Date(article.date).toLocaleDateString("uk-UA", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "—"}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ borderColor: "#f1f5f9" }} />

          {/* Category */}
          {article.category && (
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  bgcolor: catClr.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <CategoryOutlinedIcon
                  sx={{ fontSize: 16, color: catClr.text }}
                />
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
                    mb: 0.5,
                  }}
                >
                  Категорія
                </Typography>
                <Chip
                  label={article.category}
                  size="small"
                  sx={{
                    bgcolor: catClr.bg,
                    color: catClr.text,
                    fontFamily: F_BODY,
                    fontWeight: 700,
                    fontSize: "0.72rem",
                  }}
                />
              </Box>
            </Box>
          )}

          <Divider sx={{ borderColor: "#f1f5f9" }} />

          {/* Importance */}
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                bgcolor: imp.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: imp.dot,
                  boxShadow: `0 0 0 3px ${imp.bg}`,
                }}
              />
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
                  mb: 0.5,
                }}
              >
                Важливість
              </Typography>
              <Chip
                label={imp.label}
                size="small"
                sx={{
                  bgcolor: imp.bg,
                  color: imp.text,
                  fontFamily: F_BODY,
                  fontWeight: 700,
                  fontSize: "0.72rem",
                }}
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: "#f1f5f9" }} />

        {/* Share */}
        <Button
          fullWidth
          startIcon={<ShareIcon sx={{ fontSize: 16 }} />}
          onClick={() => shareArticle(article.title)}
          sx={{
            fontFamily: F_BODY,
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "12px",
            py: 1.2,
            color: BLUE,
            border: `1.5px solid ${BLUE}`,
            bgcolor: "#eff6ff",
            "&:hover": { bgcolor: "#dbeafe" },
          }}
        >
          Поділитися
        </Button>
      </Box>
    </Paper>
  );
}

/* ── Main Component ── */
export default function NewsDetail() {
  const { article } = useLoaderData();
  const [saved, setSaved] = useState(false);

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
            Новину не знайдено
          </Typography>
          <Button
            component={Link}
            to="/news"
            startIcon={<ArrowBackIcon />}
            sx={{
              fontFamily: F_BODY,
              fontWeight: 700,
              textTransform: "none",
              color: BLUE,
            }}
          >
            Назад до новин
          </Button>
        </Box>
      </Box>
    );
  }

  const imp = IMPORTANCE_CONFIG[article.importance] || IMPORTANCE_CONFIG.medium;
  const catClr = CAT_COLORS[article.category] || {
    bg: "#f1f5f9",
    text: "#64748b",
  };

  /* Split content into paragraphs for better readability */
  const paragraphs = article.content
    ? article.content.split(/\n\n+/).filter(Boolean)
    : [article.content];

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
        {/* Dot grid */}
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
        {/* Gold top bar */}
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
          {/* Back button */}
          <Button
            component={Link}
            to="/news"
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
            Назад до новин
          </Button>

          {/* Chips row */}
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              mb: 2,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
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
            {article.importance === "high" && (
              <Chip
                label="⚡ Важлива новина"
                size="small"
                sx={{
                  bgcolor: "rgba(239,68,68,.25)",
                  color: "#fca5a5",
                  fontFamily: F_BODY,
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  border: "1px solid rgba(239,68,68,.3)",
                }}
              />
            )}
          </Box>

          {/* Title */}
          <Typography
            sx={{
              fontFamily: F_DISPLAY,
              fontWeight: 700,
              fontSize: { xs: "1.6rem", md: "2.4rem" },
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1.25,
              mb: 3,
              maxWidth: 820,
            }}
          >
            {article.title}
          </Typography>

          {/* Meta row */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <CalendarTodayOutlinedIcon
                sx={{ fontSize: 14, color: "rgba(255,255,255,.5)" }}
              />
              <Typography
                sx={{
                  fontFamily: F_BODY,
                  fontSize: "0.82rem",
                  color: "rgba(255,255,255,.7)",
                }}
              >
                {article.date
                  ? new Date(article.date).toLocaleDateString("uk-UA", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "—"}
              </Typography>
            </Box>

            {/* Importance dot */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  bgcolor: imp.dot,
                }}
              />
              <Typography
                sx={{
                  fontFamily: F_BODY,
                  fontSize: "0.82rem",
                  color: "rgba(255,255,255,.6)",
                }}
              >
                {imp.label}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Body ── */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={4}>
          {/* ── Main article column ── */}
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
              {/* Category colour accent bar */}
              <Box
                sx={{
                  height: 4,
                  bgcolor: catClr.text,
                  opacity: 0.5,
                  borderRadius: "99px",
                  mb: 4,
                }}
              />

              {/* Content paragraphs */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {paragraphs.map((para, i) => (
                  <Typography
                    key={i}
                    sx={{
                      fontFamily: F_BODY,
                      fontSize: "1rem",
                      color: "#334155",
                      lineHeight: 1.9,
                    }}
                  >
                    {para}
                  </Typography>
                ))}
              </Box>
            </Paper>

            {/* ── Action bar ── */}
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
                Ця новина була корисною?
              </Typography>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Tooltip title={saved ? "Збережено" : "Зберегти"}>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSaved((v) => !v);
                      if (!saved) toast.success("Новину збережено!");
                    }}
                    sx={{
                      border: "1.5px solid",
                      borderColor: saved ? BLUE : "#e2e8f0",
                      borderRadius: "10px",
                      color: saved ? BLUE : "#94a3b8",
                      bgcolor: saved ? "#eff6ff" : "#fff",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: BLUE,
                        color: BLUE,
                        bgcolor: "#eff6ff",
                      },
                    }}
                  >
                    {saved ? (
                      <BookmarkIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <BookmarkBorderIcon sx={{ fontSize: 18 }} />
                    )}
                  </IconButton>
                </Tooltip>

                <Button
                  startIcon={<ShareIcon sx={{ fontSize: 15 }} />}
                  onClick={() => shareArticle(article.title)}
                  sx={{
                    fontFamily: F_BODY,
                    fontWeight: 600,
                    textTransform: "none",
                    color: "#64748b",
                    fontSize: "0.82rem",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "10px",
                    px: 2,
                    "&:hover": {
                      color: BLUE,
                      borderColor: BLUE,
                      bgcolor: "#eff6ff",
                    },
                  }}
                >
                  Поділитися
                </Button>
              </Box>
            </Paper>

            {/* ── Back to news list ── */}
            <Box sx={{ mt: 3 }}>
              <Button
                component={Link}
                to="/news"
                startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
                sx={{
                  fontFamily: F_BODY,
                  fontWeight: 700,
                  textTransform: "none",
                  color: "#64748b",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "12px",
                  px: 3,
                  py: 1.2,
                  bgcolor: "#fff",
                  "&:hover": {
                    borderColor: BLUE,
                    color: BLUE,
                    bgcolor: "#eff6ff",
                  },
                }}
              >
                Усі новини
              </Button>
            </Box>
          </Grid>

          {/* ── Sidebar ── */}
          <Grid size={{ xs: 12, md: 4 }}>
            <MetaCard article={article} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
