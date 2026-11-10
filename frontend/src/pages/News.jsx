import { useEffect, useMemo, useState } from "react";
import { useLoaderData, Link } from "react-router-dom";
import { HeroSection } from "../components";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

const fontBody = "'Plus Jakarta Sans', sans-serif";
const fontDisplay = "'Playfair Display', serif";

const LOCAL_SOURCE = "Редакція";
const PAGE_SIZE = 9;

const SOURCE_COLORS = {
  [LOCAL_SOURCE]: { bg: "#eff6ff", text: "#1d4ed8" },
  default: { bg: "#ecfdf5", text: "#065f46" },
};

// ── Loader: новини з бази (як і раніше) ──
export async function loader() {
  try {
    const { data } = await customFetch.get("/news");
    return { news: data, error: null };
  } catch (error) {
    toast.error("Помилка завантаження новин");
    return { news: [], error: error?.message };
  }
}

// Приводимо обидва типи новин до одного формату
function normalizeLocal(item) {
  return {
    key: `db-${item.id}`,
    title: item.title,
    summary: item.content,
    date: item.date,
    source: LOCAL_SOURCE,
    importance: item.importance,
    href: `/news/${item.id}`,
    external: false,
  };
}

function normalizeExternal(item) {
  return {
    key: `ext-${item.link}`,
    title: item.title,
    summary: item.summary,
    date: item.date,
    source: item.source,
    importance: "medium",
    href: item.link,
    external: true,
  };
}

// Правильна форма слова: 1 новина, 2 новини, 5 новин
function pluralNews(n) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "новина";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "новини";
  return "новин";
}

export default function News() {
  const { news: localNews } = useLoaderData();

  const [externalNews, setExternalNews] = useState([]);
  const [externalLoading, setExternalLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Зовнішні новини завантажуємо окремо, щоб сторінка не блокувалась
  useEffect(() => {
    let cancelled = false;

    customFetch
      .get("/external-news")
      .then(({ data }) => {
        if (!cancelled) setExternalNews(Array.isArray(data) ? data : []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setExternalLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Один список з обох джерел, від новішого до старішого
  const allItems = useMemo(() => {
    const merged = [
      ...(localNews || []).map(normalizeLocal),
      ...externalNews.map(normalizeExternal),
    ];
    return merged.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [localNews, externalNews]);

  // Список джерел для чіпів фільтра
  const sources = useMemo(
    () => [...new Set(allItems.map((i) => i.source))],
    [allItems],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allItems.filter((item) => {
      const matchSource = source === "all" || item.source === source;
      const matchSearch =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.summary?.toLowerCase().includes(q);
      return matchSource && matchSearch;
    });
  }, [allItems, source, search]);

  // Після зміни фільтрів показуємо знову першу сторінку
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, source]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <>
      <HeroSection
        title="Останні новини"
        typedStrings={["Актуальна інформація"]}
        subtitle="Будьте в курсі подій для української спільноти в Європі"
        size="sm"
      />

      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          {/* ── Фільтри ── */}
          <Box
            sx={{
              bgcolor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "20px",
              p: { xs: 2.5, md: 3 },
              mb: 4,
              boxShadow: "0 2px 16px rgba(0,87,184,.05)",
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Пошук новин..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontFamily: fontBody,
                  bgcolor: "#f8fafc",
                  "&:hover fieldset": { borderColor: "#0057B8" },
                  "&.Mui-focused fieldset": { borderColor: "#0057B8" },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {["all", ...sources].map((s) => {
                const isActive = source === s;
                const clr = SOURCE_COLORS[s] || SOURCE_COLORS.default;
                return (
                  <Chip
                    key={s}
                    label={s === "all" ? "Усі джерела" : s}
                    clickable
                    onClick={() => setSource(s)}
                    sx={{
                      fontFamily: fontBody,
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      borderRadius: "10px",
                      bgcolor: isActive ? "#0057B8" : clr.bg,
                      color: isActive ? "#fff" : clr.text,
                      border: isActive ? "none" : "1px solid #e2e8f0",
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: isActive ? "#003d82" : "#e8f0fc",
                      },
                    }}
                  />
                );
              })}
            </Box>
          </Box>

          {/* ── Лічильник ── */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Typography
              sx={{
                fontFamily: fontBody,
                fontSize: "0.875rem",
                color: "#64748b",
                fontWeight: 500,
              }}
            >
              Знайдено {filtered.length} {pluralNews(filtered.length)}
            </Typography>
            {externalLoading && (
              <CircularProgress size={14} sx={{ color: "#94a3b8" }} />
            )}
          </Box>

          {/* ── Список ── */}
          <Grid container spacing={3}>
            {visible.map((item, i) => {
              const clr = SOURCE_COLORS[item.source] || SOURCE_COLORS.default;
              return (
                <Grid
                  key={item.key}
                  size={{ xs: 12, md: 6, lg: 4 }}
                  sx={{
                    animation: "fadeUp 0.5s ease both",
                    animationDelay: `${(i % PAGE_SIZE) * 0.06}s`,
                    "@keyframes fadeUp": {
                      from: { opacity: 0, transform: "translateY(20px)" },
                      to: { opacity: 1, transform: "translateY(0)" },
                    },
                  }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "18px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 1px 4px rgba(0,0,0,.04)",
                      transition: "transform 0.25s ease, box-shadow 0.25s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 36px rgba(0,87,184,.1)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                          gap: 1,
                        }}
                      >
                        <Chip
                          label={item.source}
                          size="small"
                          sx={{
                            bgcolor: clr.bg,
                            color: clr.text,
                            fontFamily: fontBody,
                            fontWeight: 700,
                            fontSize: "0.72rem",
                          }}
                        />
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          {item.importance === "high" && (
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                bgcolor: "#dc2626",
                              }}
                            />
                          )}
                          <Typography
                            sx={{
                              fontFamily: fontBody,
                              fontSize: "0.75rem",
                              color: "#94a3b8",
                            }}
                          >
                            {item.date
                              ? new Date(item.date).toLocaleDateString("uk-UA", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "—"}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography
                        sx={{
                          fontFamily: fontDisplay,
                          fontWeight: 700,
                          fontSize: "1.15rem",
                          color: "#0f172a",
                          lineHeight: 1.35,
                          mb: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.title}
                      </Typography>

                      {item.summary && (
                        <Typography
                          sx={{
                            fontFamily: fontBody,
                            fontSize: "0.875rem",
                            color: "#64748b",
                            lineHeight: 1.7,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {item.summary}
                        </Typography>
                      )}
                    </CardContent>

                    <CardActions sx={{ px: 3, pb: 2.5, pt: 0 }}>
                      {item.external ? (
                        <Button
                          size="small"
                          component="a"
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                          sx={{
                            fontFamily: fontBody,
                            fontWeight: 700,
                            textTransform: "none",
                            color: "#0057B8",
                            fontSize: "0.8rem",
                            p: 0,
                            "&:hover": {
                              bgcolor: "transparent",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          Читати в джерелі
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          component={Link}
                          to={item.href}
                          endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                          sx={{
                            fontFamily: fontBody,
                            fontWeight: 700,
                            textTransform: "none",
                            color: "#0057B8",
                            fontSize: "0.8rem",
                            p: 0,
                            "&:hover": {
                              bgcolor: "transparent",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          Читати далі
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* ── Завантажити ще ── */}
          {hasMore && (
            <Box sx={{ textAlign: "center", mt: 6 }}>
              <Button
                onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                sx={{
                  fontFamily: fontBody,
                  fontWeight: 700,
                  textTransform: "none",
                  bgcolor: "#0057B8",
                  color: "#fff",
                  borderRadius: "12px",
                  px: 4,
                  py: 1.4,
                  fontSize: "0.9rem",
                  boxShadow: "0 4px 14px rgba(0,87,184,.3)",
                  "&:hover": { bgcolor: "#003d82" },
                }}
              >
                Завантажити ще ({filtered.length - visibleCount})
              </Button>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}