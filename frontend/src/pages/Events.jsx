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
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

const fontBody = "'Plus Jakarta Sans', sans-serif";
const fontDisplay = "'Playfair Display', serif";

const TYPE_COLORS = {
  "Культурний захід": { bg: "#f5f3ff", text: "#6d28d9" },
  Мистецтво: { bg: "#fdf4ff", text: "#7e22ce" },
  Фестиваль: { bg: "#fff7ed", text: "#9a3412" },
  Концерт: { bg: "#ecfdf5", text: "#065f46" },
};

const BG_GRADIENTS = [
  "linear-gradient(135deg, #0057B8 0%, #003d82 100%)",
  "linear-gradient(135deg, #FFD700 0%, #f59e0b 100%)",
  "linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%)",
  "linear-gradient(135deg, #065f46 0%, #022c22 100%)",
];

// ── Loader — vraies données API ──
export async function loader() {
  try {
    const { data } = await customFetch.get("/events");
    return { events: data, error: null };
  } catch (error) {
    toast.error("Помилка завантаження подій");
    return { events: [], error: error?.message };
  }
}

export default function Events() {
  const { events: allEvents } = useLoaderData();
  const [eventType, setEventType] = useState("");
  const [search, setSearch] = useState("");

  const filtered = allEvents.filter((e) => {
    const matchType =
      !eventType || e.type === eventType || e.category === eventType;
    const matchSearch =
      !search || e.title?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  // Extraire les types uniques depuis les données réelles
  const availableTypes = [
    ...new Set(allEvents.map((e) => e.type || e.category).filter(Boolean)),
  ];

  return (
    <>
      <HeroSection
        title="Афіша подій"
        typedStrings={["Культурні заходи"]}
        subtitle="Концерти, виставки, фестивалі та зустрічі — події для всієї діаспори"
        buttonText="Додати подію"
        buttonLink="/profile"
        size="sm"
      />

      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          {/* Filters */}
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
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Пошук за назвою..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: "12px",
                      fontFamily: fontBody,
                      bgcolor: "#f8fafc",
                    },
                  }}
                />
              </Grid>
              {availableTypes.length > 0 && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ fontFamily: fontBody }}>
                      Тип події
                    </InputLabel>
                    <Select
                      value={eventType}
                      label="Тип події"
                      onChange={(e) => setEventType(e.target.value)}
                      sx={{
                        borderRadius: "12px",
                        fontFamily: fontBody,
                        bgcolor: "#f8fafc",
                      }}
                    >
                      <MenuItem value="">Всі типи</MenuItem>
                      {availableTypes.map((t) => (
                        <MenuItem key={t} value={t}>
                          {t}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>
          </Box>

          {/* Count */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              sx={{
                fontFamily: fontBody,
                fontSize: "0.875rem",
                color: "#64748b",
                fontWeight: 500,
              }}
            >
              {filtered.length} подій знайдено
            </Typography>
          </Box>

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
                Подій не знайдено
              </Typography>
              <Typography
                sx={{
                  fontFamily: fontBody,
                  fontSize: "0.875rem",
                  color: "#cbd5e1",
                }}
              >
                Спробуйте змінити фільтри
              </Typography>
            </Box>
          )}

          {/* Grid */}
          <Grid container spacing={3}>
            {filtered.map((event, i) => {
              const typeClr = TYPE_COLORS[event.type || event.category] || {
                bg: "#f1f5f9",
                text: "#475569",
              };
              const isUpcoming =
                event.date && new Date(event.date) > new Date();

              return (
                <Grid
                  key={event.id ?? i}
                  size={{ xs: 12, sm: 6, md: 4 }}
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
                      borderRadius: "20px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 1px 4px rgba(0,0,0,.04)",
                      overflow: "hidden",
                      transition: "transform 0.25s ease, box-shadow 0.25s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 16px 48px rgba(0,87,184,.12)",
                      },
                    }}
                  >
                    {/* Banner */}
                    <Box
                      sx={{
                        height: 120,
                        background: BG_GRADIENTS[i % BG_GRADIENTS.length],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        p: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: fontDisplay,
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          color: "rgba(255,255,255,.9)",
                          textAlign: "center",
                          lineHeight: 1.35,
                        }}
                      >
                        {event.title}
                      </Typography>
                      <Chip
                        label={isUpcoming ? "Заплановано" : "Минула"}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          bgcolor: isUpcoming
                            ? "rgba(255,255,255,.2)"
                            : "rgba(0,0,0,.25)",
                          color: "#fff",
                          fontFamily: fontBody,
                          fontWeight: 700,
                          fontSize: "0.65rem",
                          backdropFilter: "blur(6px)",
                          border: "1px solid rgba(255,255,255,.25)",
                        }}
                      />
                    </Box>

                    <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
                      {(event.type || event.category) && (
                        <Chip
                          label={event.type || event.category}
                          size="small"
                          sx={{
                            bgcolor: typeClr.bg,
                            color: typeClr.text,
                            fontFamily: fontBody,
                            fontWeight: 700,
                            fontSize: "0.7rem",
                            mb: 2,
                          }}
                        />
                      )}

                      {event.description && (
                        <Typography
                          sx={{
                            fontFamily: fontBody,
                            fontSize: "0.85rem",
                            color: "#64748b",
                            lineHeight: 1.7,
                            mb: 2,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {event.description}
                        </Typography>
                      )}

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.8,
                        }}
                      >
                        {event.date && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <CalendarTodayOutlinedIcon
                              sx={{ fontSize: 14, color: "#94a3b8" }}
                            />
                            <Typography
                              sx={{
                                fontFamily: fontBody,
                                fontSize: "0.8rem",
                                color: "#64748b",
                                fontWeight: 500,
                              }}
                            >
                              {new Date(event.date).toLocaleDateString(
                                "uk-UA",
                                {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                },
                              )}
                            </Typography>
                          </Box>
                        )}
                        {event.location && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <LocationOnOutlinedIcon
                              sx={{ fontSize: 14, color: "#94a3b8" }}
                            />
                            <Typography
                              sx={{
                                fontFamily: fontBody,
                                fontSize: "0.8rem",
                                color: "#64748b",
                                fontWeight: 500,
                              }}
                            >
                              {event.location}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </CardContent>

                    <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0, gap: 1 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        disabled={!isUpcoming}
                        sx={{
                          fontFamily: fontBody,
                          fontWeight: 700,
                          textTransform: "none",
                          bgcolor: isUpcoming ? "#0057B8" : "#94a3b8",
                          borderRadius: "10px",
                          fontSize: "0.8rem",
                          "&:hover": { bgcolor: "#003d82" },
                          boxShadow: "none",
                        }}
                      >
                        {isUpcoming ? "Зареєструватися" : "Завершена"}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>
    </>
  );
}
