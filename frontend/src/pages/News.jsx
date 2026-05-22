import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { HeroSection } from "../components";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  Container,
  InputAdornment,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

const fontBody = "'Plus Jakarta Sans', sans-serif";
const fontDisplay = "'Playfair Display', serif";

const CATEGORIES = [
  { label: "Всі", key: "all" },
  { label: "Соціальна допомога", key: "Соціальна допомога" },
  { label: "Культура", key: "Культура" },
  { label: "Робота", key: "Робота" },
  { label: "Освіта", key: "Освіта" },
];

const CAT_COLORS = {
  "Соціальна допомога": { bg: "#fef2f2", text: "#991b1b" },
  Культура: { bg: "#f5f3ff", text: "#6d28d9" },
  Робота: { bg: "#ecfdf5", text: "#065f46" },
  Освіта: { bg: "#fff7ed", text: "#9a3412" },
};

// ── Loader — récupère les vraies données depuis l'API ──
export async function loader() {
  try {
    const { data } = await customFetch.get("/news");
    return { news: data, error: null };
  } catch (error) {
    toast.error("Помилка завантаження новин");
    return { news: [], error: error?.message };
  }
}

export default function News() {
  const { news: initialNews } = useLoaderData();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const filtered = initialNews.filter((item) => {
    const matchCat =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchSearch =
      !search || item.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const loadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((v) => v + 6);
      setIsLoadingMore(false);
    }, 400);
  };

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
          {/* Filter bar */}
          <Box
            sx={{
              bgcolor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "20px",
              p: { xs: 2.5, md: 3 },
              mb: 5,
              boxShadow: "0 2px 16px rgba(0,87,184,.05)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <TextField
                placeholder="Пошук новин..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="small"
                sx={{
                  flex: { xs: "1 1 100%", sm: "1 1 280px" },
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
                {CATEGORIES.map((cat) => (
                  <Chip
                    key={cat.key}
                    label={cat.label}
                    clickable
                    onClick={() => setSelectedCategory(cat.key)}
                    sx={{
                      fontFamily: fontBody,
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      borderRadius: "10px",
                      bgcolor:
                        selectedCategory === cat.key ? "#0057B8" : "#f1f5f9",
                      color: selectedCategory === cat.key ? "#fff" : "#64748b",
                      border:
                        selectedCategory === cat.key
                          ? "none"
                          : "1px solid #e2e8f0",
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor:
                          selectedCategory === cat.key ? "#003d82" : "#e8f0fc",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Count */}
          <Typography
            sx={{
              fontFamily: fontBody,
              fontSize: "0.875rem",
              color: "#64748b",
              mb: 3,
              fontWeight: 500,
            }}
          >
            {filtered.length} новин знайдено
          </Typography>

          {/* Empty state */}
          {filtered.length === 0 && (
            <Box sx={{ textAlign: "center", py: 10 }}>
              <Typography
                sx={{
                  fontFamily: fontDisplay,
                  fontSize: "1.4rem",
                  color: "#94a3b8",
                  mb: 1,
                }}
              >
                Новин не знайдено
              </Typography>
              <Typography
                sx={{
                  fontFamily: fontBody,
                  fontSize: "0.875rem",
                  color: "#cbd5e1",
                }}
              >
                Спробуйте змінити фільтри або пошуковий запит
              </Typography>
            </Box>
          )}

          {/* News grid */}
          <Grid container spacing={3}>
            {visible.map((item, i) => {
              const catClr = CAT_COLORS[item.category] || {
                bg: "#f1f5f9",
                text: "#475569",
              };
              return (
                <Grid
                  key={item.id ?? i}
                  size={{ xs: 12, md: 6 }}
                  sx={{
                    animation: "fadeUp 0.5s ease both",
                    animationDelay: `${(i % 6) * 0.08}s`,
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
                        }}
                      >
                        <Chip
                          label={item.category || "Загальне"}
                          size="small"
                          sx={{
                            bgcolor: catClr.bg,
                            color: catClr.text,
                            fontFamily: fontBody,
                            fontWeight: 700,
                            fontSize: "0.72rem",
                          }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
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
                              ? new Date(item.date).toLocaleDateString(
                                  "uk-UA",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )
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
                        {item.content}
                      </Typography>
                    </CardContent>

                    <CardActions
                      sx={{
                        px: 3,
                        pb: 2.5,
                        pt: 0,
                        justifyContent: "space-between",
                      }}
                    >
                      <Button
                        size="small"
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
                      <Button
                        size="small"
                        startIcon={
                          <span
                            className="material-icons"
                            style={{ fontSize: 14 }}
                          >
                            share
                          </span>
                        }
                        sx={{
                          fontFamily: fontBody,
                          fontWeight: 500,
                          textTransform: "none",
                          color: "#94a3b8",
                          fontSize: "0.8rem",
                          "&:hover": {
                            color: "#64748b",
                            bgcolor: "transparent",
                          },
                        }}
                      >
                        Поділитися
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Load more */}
          {hasMore && (
            <Box sx={{ textAlign: "center", mt: 6 }}>
              <Button
                onClick={loadMore}
                disabled={isLoadingMore}
                sx={{
                  fontFamily: fontBody,
                  fontWeight: 700,
                  textTransform: "none",
                  bgcolor: isLoadingMore ? "#f1f5f9" : "#0057B8",
                  color: isLoadingMore ? "#94a3b8" : "#fff",
                  borderRadius: "12px",
                  px: 4,
                  py: 1.4,
                  fontSize: "0.9rem",
                  boxShadow: isLoadingMore
                    ? "none"
                    : "0 4px 14px rgba(0,87,184,.3)",
                  "&:hover": { bgcolor: "#003d82" },
                  transition: "all 0.25s ease",
                }}
              >
                {isLoadingMore ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <CircularProgress size={16} sx={{ color: "#94a3b8" }} />
                    Завантаження...
                  </Box>
                ) : (
                  `Завантажити ще (${filtered.length - visibleCount})`
                )}
              </Button>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}
