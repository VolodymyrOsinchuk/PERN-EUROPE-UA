import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Fab,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import { GridView, HeroSection, ListView } from "../../components";
import { useLoaderData, Link } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import TuneIcon from "@mui/icons-material/Tune";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/adv");
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return [];
  }
};

/* ── Design tokens ── */
const F_BODY = "'Plus Jakarta Sans', sans-serif";
const F_DISPLAY = "'Playfair Display', serif";
const BLUE = "#0057B8";
const GOLD = "#FFD700";

/* ── Category config ── */
const CATEGORIES = [
  { value: "", label: "Всі категорії" },
  { value: "work", label: "Робота", icon: "work" },
  { value: "housing", label: "Житло", icon: "home" },
  { value: "services", label: "Послуги", icon: "build" },
  { value: "education", label: "Освіта", icon: "school" },
  { value: "other", label: "Інше", icon: "more_horiz" },
];

const CAT_COLORS = {
  work: { bg: "#ecfdf5", text: "#065f46", dot: "#10b981" },
  housing: { bg: "#fff7ed", text: "#9a3412", dot: "#f97316" },
  services: { bg: "#eff6ff", text: "#1d4ed8", dot: "#3b82f6" },
  education: { bg: "#f5f3ff", text: "#6d28d9", dot: "#8b5cf6" },
  other: { bg: "#f8fafc", text: "#475569", dot: "#94a3b8" },
};

const QUICK_STATS = [
  { icon: "campaign", label: "Активних оголошень", value: "3 400+" },
  { icon: "location_on", label: "Міст та регіонів", value: "120+" },
  { icon: "category", label: "Категорій", value: "6" },
  { icon: "people", label: "Авторів", value: "1 200+" },
];

export default function Ads() {
  const data = useLoaderData();
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  const handleViewChange = (_, v) => {
    if (v) setViewMode(v);
  };

  /* Client-side filtering */
  const filtered = (data || []).filter((ad) => {
    const matchCat = !category || ad.category?.slug === category;
    const adCity =
      typeof ad.location === "object"
        ? ad.location.city?.toLowerCase()
        : ad.location?.toLowerCase();
    const matchCity = !city || adCity?.includes(city.toLowerCase());
    const matchSearch =
      !search ||
      ad.title?.toLowerCase().includes(search.toLowerCase()) ||
      ad.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchCity && matchSearch;
  });

  const hasFilters = !!(category || city || search);

  const clearFilters = () => {
    setCategory("");
    setCity("");
    setSearch("");
  };

  return (
    <>
      {/* ── Hero ── */}
      <HeroSection
        typedStrings={["Оголошення", "Робота", "Житло", "Послуги"]}
        subtitle="Дошка оголошень для українців в Європі — знайдіть або розмістіть своє"
        buttonText="Розмістити оголошення"
        buttonLink="/profile/create-ad"
        badge="🇺🇦 Дошка оголошень"
        size="sm"
      />

      {/* ── Stats strip ── */}
      <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #f1f5f9", py: 3 }}>
        <Container maxWidth="lg">
          <Grid container>
            {QUICK_STATS.map((s, i) => (
              <Grid
                key={s.label}
                size={{ xs: 6, sm: 3 }}
                sx={{
                  textAlign: "center",
                  py: 1,
                  borderRight:
                    i < QUICK_STATS.length - 1
                      ? { sm: "1px solid #f1f5f9" }
                      : "none",
                }}
              >
                <span
                  className="material-icons"
                  style={{
                    fontSize: 18,
                    color: BLUE,
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  {s.icon}
                </span>
                <Typography
                  sx={{
                    fontFamily: F_DISPLAY,
                    fontWeight: 700,
                    fontSize: { xs: "1.3rem", md: "1.6rem" },
                    color: "#0f172a",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.value}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontSize: "0.72rem",
                    color: "#64748b",
                    fontWeight: 500,
                  }}
                >
                  {s.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 5, md: 7 }, bgcolor: "#f8fafc", minHeight: "60vh" }}>
        <Container maxWidth="lg">
          {/* ── Toolbar ── */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: F_DISPLAY,
                  fontWeight: 700,
                  fontSize: { xs: "1.6rem", md: "2rem" },
                  color: "#0f172a",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                }}
              >
                Дошка оголошень
              </Typography>
              <Typography
                sx={{
                  fontFamily: F_BODY,
                  fontSize: "0.85rem",
                  color: "#64748b",
                  mt: 0.4,
                }}
              >
                {filtered.length} оголошень
                {hasFilters && (
                  <Box
                    component="span"
                    onClick={clearFilters}
                    sx={{
                      ml: 1.5,
                      color: BLUE,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    · Очистити фільтри
                  </Box>
                )}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexShrink: 0,
              }}
            >
              {/* Filter toggle */}
              <Button
                startIcon={<TuneIcon sx={{ fontSize: 16 }} />}
                onClick={() => setShowFilters((v) => !v)}
                sx={{
                  fontFamily: F_BODY,
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "0.875rem",
                  color: showFilters ? BLUE : "#64748b",
                  border: `1.5px solid ${showFilters ? BLUE : "#e2e8f0"}`,
                  borderRadius: "10px",
                  px: 2,
                  py: 0.9,
                  bgcolor: showFilters ? "rgba(0,87,184,.05)" : "#fff",
                  "&:hover": {
                    borderColor: BLUE,
                    color: BLUE,
                    bgcolor: "rgba(0,87,184,.05)",
                  },
                }}
              >
                Фільтри{" "}
                {hasFilters &&
                  `(${[category, city, search].filter(Boolean).length})`}
              </Button>

              {/* View toggle */}
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewChange}
                size="small"
                sx={{
                  bgcolor: "#fff",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "10px",
                  overflow: "hidden",
                  "& .MuiToggleButton-root": {
                    border: "none",
                    borderRadius: 0,
                    px: 1.3,
                    py: 0.8,
                    color: "#94a3b8",
                    transition: "all 0.2s",
                    "&.Mui-selected": {
                      bgcolor: BLUE,
                      color: "#fff",
                      "&:hover": { bgcolor: "#003d82" },
                    },
                    "&:hover": { bgcolor: "#f1f5f9", color: "#334155" },
                  },
                }}
              >
                <ToggleButton value="grid">
                  <GridViewIcon sx={{ fontSize: 18 }} />
                </ToggleButton>
                <ToggleButton value="list">
                  <ViewListIcon sx={{ fontSize: 18 }} />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          {/* ── Filters panel ── */}
          {showFilters && (
            <Paper
              elevation={0}
              sx={{
                bgcolor: "#fff",
                border: "1.5px solid #e2e8f0",
                borderRadius: "18px",
                p: { xs: 2.5, md: 3 },
                mb: 3.5,
                boxShadow: "0 4px 24px rgba(0,87,184,.06)",
                animation: "slideDown 0.25s cubic-bezier(0.16,1,0.3,1) both",
                "@keyframes slideDown": {
                  from: { opacity: 0, transform: "translateY(-10px)" },
                  to: { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              <Grid container spacing={2}>
                {/* Search */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Пошук за назвою або описом..."
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
                        fontFamily: F_BODY,
                        bgcolor: "#f8fafc",
                        "& fieldset": { borderColor: "#e2e8f0" },
                        "&:hover fieldset": { borderColor: BLUE },
                        "&.Mui-focused fieldset": { borderColor: BLUE },
                      },
                    }}
                  />
                </Grid>

                {/* Category */}
                <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ fontFamily: F_BODY }}>
                      Категорія
                    </InputLabel>
                    <Select
                      value={category}
                      label="Категорія"
                      onChange={(e) => setCategory(e.target.value)}
                      sx={{
                        borderRadius: "12px",
                        fontFamily: F_BODY,
                        bgcolor: "#f8fafc",
                        "& fieldset": { borderColor: "#e2e8f0" },
                        "&:hover fieldset": { borderColor: BLUE },
                      }}
                    >
                      {CATEGORIES.map((c) => (
                        <MenuItem
                          key={c.value}
                          value={c.value}
                          sx={{
                            fontFamily: F_BODY,
                            fontSize: "0.875rem",
                            gap: 1.5,
                          }}
                        >
                          {c.icon && (
                            <span
                              className="material-icons"
                              style={{ fontSize: 16, color: "#94a3b8" }}
                            >
                              {c.icon}
                            </span>
                          )}
                          {c.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* City */}
                <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ fontFamily: F_BODY }}>Місто</InputLabel>
                    <Select
                      value={city}
                      label="Місто"
                      onChange={(e) => setCity(e.target.value)}
                      sx={{
                        borderRadius: "12px",
                        fontFamily: F_BODY,
                        bgcolor: "#f8fafc",
                        "& fieldset": { borderColor: "#e2e8f0" },
                        "&:hover fieldset": { borderColor: BLUE },
                      }}
                    >
                      <MenuItem
                        value=""
                        sx={{ fontFamily: F_BODY, fontSize: "0.875rem" }}
                      >
                        Всі міста
                      </MenuItem>
                      {[
                        "Berlin",
                        "Paris",
                        "Warsaw",
                        "Prague",
                        "Vienna",
                        "Amsterdam",
                      ].map((c) => (
                        <MenuItem
                          key={c}
                          value={c.toLowerCase()}
                          sx={{ fontFamily: F_BODY, fontSize: "0.875rem" }}
                        >
                          {c}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Category quick chips */}
              <Box sx={{ mt: 2.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
                {CATEGORIES.map((c) => {
                  const clr = CAT_COLORS[c.value] || {};
                  const isActive = category === c.value;
                  return (
                    <Chip
                      key={c.value}
                      label={c.label}
                      onClick={() => setCategory(c.value)}
                      size="small"
                      sx={{
                        fontFamily: F_BODY,
                        fontWeight: 600,
                        fontSize: "0.78rem",
                        borderRadius: "8px",
                        cursor: "pointer",
                        bgcolor: isActive ? BLUE : c.value ? clr.bg : "#f1f5f9",
                        color: isActive
                          ? "#fff"
                          : c.value
                            ? clr.text
                            : "#64748b",
                        border: isActive ? "none" : "1px solid #e2e8f0",
                        transition: "all 0.2s",
                        "&:hover": {
                          bgcolor: isActive
                            ? "#003d82"
                            : c.value
                              ? clr.bg
                              : "#e8f0fc",
                        },
                      }}
                    />
                  );
                })}
              </Box>
            </Paper>
          )}

          {/* ── Results ── */}
          {filtered.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 12,
                animation: "fadeIn 0.4s ease both",
                "@keyframes fadeIn": {
                  from: { opacity: 0 },
                  to: { opacity: 1 },
                },
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  bgcolor: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <span
                  className="material-icons"
                  style={{ fontSize: 36, color: "#cbd5e1" }}
                >
                  search_off
                </span>
              </Box>
              <Typography
                sx={{
                  fontFamily: F_DISPLAY,
                  fontWeight: 700,
                  fontSize: "1.4rem",
                  color: "#94a3b8",
                  mb: 1,
                }}
              >
                Нічого не знайдено
              </Typography>
              <Typography
                sx={{
                  fontFamily: F_BODY,
                  fontSize: "0.875rem",
                  color: "#cbd5e1",
                  mb: 3,
                }}
              >
                Спробуйте змінити фільтри або пошуковий запит
              </Typography>
              <Button
                onClick={clearFilters}
                sx={{
                  fontFamily: F_BODY,
                  fontWeight: 600,
                  textTransform: "none",
                  color: BLUE,
                  border: `1.5px solid ${BLUE}`,
                  borderRadius: "10px",
                  px: 3,
                  "&:hover": { bgcolor: "rgba(0,87,184,.05)" },
                }}
              >
                Очистити фільтри
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                animation: "fadeUp 0.4s ease both",
                "@keyframes fadeUp": {
                  from: { opacity: 0, transform: "translateY(16px)" },
                  to: { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              {/* ✅ FIX: était <Grid View ads={filtered}> — composant non reconnu */}
              {viewMode === "grid" ? (
                <GridView ads={filtered} />
              ) : (
                <ListView ads={filtered} />
              )}
            </Box>
          )}
        </Container>
      </Box>

      {/* ── FAB ── */}
      <Tooltip title="Розмістити оголошення" placement="left">
        <Fab
          component={Link}
          to="/profile/create-ad"
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            bgcolor: BLUE,
            color: "#fff",
            boxShadow: "0 8px 32px rgba(0,87,184,.45)",
            width: 56,
            height: 56,
            transition: "all 0.25s ease",
            "&:hover": {
              bgcolor: "#003d82",
              transform: "scale(1.08)",
              boxShadow: "0 12px 40px rgba(0,87,184,.55)",
            },
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </>
  );
}
