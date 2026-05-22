import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Card,
  CardContent,
  CardActions,
  TextField,
  Chip,
  Typography,
  Grid,
  InputAdornment,
} from "@mui/material";
import { HeroSection } from "../components";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

const fontBody = "'Plus Jakarta Sans', sans-serif";
const fontDisplay = "'Playfair Display', serif";

const CATEGORIES_LIST = [
  "Всі публікації",
  "Документи",
  "Робота",
  "Житло",
  "Освіта",
  "Медицина",
  "Культура",
  "Інтеграція",
];

const CAT_COLORS = {
  Документи: { bg: "#eff6ff", text: "#1d4ed8" },
  Робота: { bg: "#ecfdf5", text: "#065f46" },
  Житло: { bg: "#fff7ed", text: "#9a3412" },
  Освіта: { bg: "#f5f3ff", text: "#6d28d9" },
  Медицина: { bg: "#fff1f2", text: "#be123c" },
  Культура: { bg: "#fdf4ff", text: "#7e22ce" },
  Інтеграція: { bg: "#f0fdf4", text: "#166534" },
};

// ── Loader — vraies données API ──
export async function loader() {
  try {
    const { data } = await customFetch.get("/publications");
    return { publications: data, error: null };
  } catch (error) {
    toast.error("Помилка завантаження публікацій");
    return { publications: [], error: error?.message };
  }
}

export default function Publications() {
  const { publications: allPublications } = useLoaderData();
  const [selectedCat, setSelectedCat] = useState("Всі публікації");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const filtered = allPublications.filter((a) => {
    const matchCat =
      selectedCat === "Всі публікації" || a.category === selectedCat;
    const matchSearch =
      !search || a.title?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <>
      <HeroSection
        title="Публікації"
        typedStrings={["Корисні статті"]}
        subtitle="Дослідження та матеріали про життя українців у Європі"
        size="sm"
      />

      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          {/* Search + filters */}
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
            <TextField
              fullWidth
              size="small"
              placeholder="Пошук публікацій..."
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
              {CATEGORIES_LIST.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  clickable
                  onClick={() => setSelectedCat(cat)}
                  sx={{
                    fontFamily: fontBody,
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    borderRadius: "10px",
                    bgcolor: selectedCat === cat ? "#0057B8" : "#f1f5f9",
                    color: selectedCat === cat ? "#fff" : "#64748b",
                    border: selectedCat === cat ? "none" : "1px solid #e2e8f0",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: selectedCat === cat ? "#003d82" : "#e8f0fc",
                    },
                  }}
                />
              ))}
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
            {filtered.length} публікацій знайдено
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
                Публікацій не знайдено
              </Typography>
              <Typography
                sx={{
                  fontFamily: fontBody,
                  fontSize: "0.875rem",
                  color: "#cbd5e1",
                }}
              >
                Спробуйте змінити запит або категорію
              </Typography>
            </Box>
          )}

          {/* Cards grid */}
          <Grid container spacing={3}>
            {visible.map((article, i) => {
              const clr = CAT_COLORS[article.category] || {
                bg: "#f1f5f9",
                text: "#475569",
              };
              return (
                <Grid
                  key={article.id ?? i}
                  size={{ xs: 12, md: 6 }}
                  sx={{
                    animation: "fadeUp 0.5s ease both",
                    animationDelay: `${(i % 4) * 0.08}s`,
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
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 40px rgba(0,87,184,.1)",
                      },
                    }}
                  >
                    <Box sx={{ height: 4, bgcolor: clr.text, opacity: 0.5 }} />
                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        {article.category && (
                          <Chip
                            label={article.category}
                            size="small"
                            sx={{
                              bgcolor: clr.bg,
                              color: clr.text,
                              fontFamily: fontBody,
                              fontWeight: 700,
                              fontSize: "0.72rem",
                            }}
                          />
                        )}
                        {article.readTime && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <AccessTimeIcon
                              sx={{ fontSize: 12, color: "#94a3b8" }}
                            />
                            <Typography
                              sx={{
                                fontFamily: fontBody,
                                fontSize: "0.72rem",
                                color: "#94a3b8",
                              }}
                            >
                              {article.readTime}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      <Typography
                        sx={{
                          fontFamily: fontDisplay,
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          color: "#0f172a",
                          lineHeight: 1.35,
                          mb: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {article.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: fontBody,
                          fontSize: "0.875rem",
                          color: "#64748b",
                          lineHeight: 1.7,
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {article.content}
                      </Typography>

                      {/* Author + date */}
                      {(article.author || article.date) && (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {article.author && (
                            <Box
                              sx={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                bgcolor: clr.bg,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "0.7rem",
                                  fontWeight: 700,
                                  color: clr.text,
                                }}
                              >
                                {article.author
                                  .split(" ")
                                  .map((w) => w[0])
                                  .join("")
                                  .slice(0, 2)}
                              </Typography>
                            </Box>
                          )}
                          <Box>
                            {article.author && (
                              <Typography
                                sx={{
                                  fontFamily: fontBody,
                                  fontWeight: 600,
                                  fontSize: "0.8rem",
                                  color: "#334155",
                                }}
                              >
                                {article.author}
                              </Typography>
                            )}
                            {article.date && (
                              <Typography
                                sx={{
                                  fontFamily: fontBody,
                                  fontSize: "0.72rem",
                                  color: "#94a3b8",
                                }}
                              >
                                {new Date(article.date).toLocaleDateString(
                                  "uk-UA",
                                )}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      )}
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
                        startIcon={<BookmarkBorderIcon sx={{ fontSize: 14 }} />}
                        sx={{
                          fontFamily: fontBody,
                          fontWeight: 500,
                          textTransform: "none",
                          color: "#94a3b8",
                          fontSize: "0.75rem",
                          minWidth: "auto",
                          p: "4px 8px",
                          "&:hover": { color: "#0057B8" },
                        }}
                      >
                        Зберегти
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
                onClick={() => setVisibleCount((v) => v + 6)}
                variant="outlined"
                sx={{
                  fontFamily: fontBody,
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: "12px",
                  px: 4,
                  py: 1.4,
                  fontSize: "0.9rem",
                  borderColor: "#e2e8f0",
                  color: "#334155",
                  "&:hover": {
                    borderColor: "#0057B8",
                    color: "#0057B8",
                    bgcolor: "rgba(0,87,184,.04)",
                  },
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
