import { useState, useMemo, useEffect } from "react";
import CompareIcon from "@mui/icons-material/CompareArrows";
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
  IconButton,
  Dialog,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  GridView,
  HeroSection,
  ListView,
  CitySelectField,
} from "../../components";
import {
  useLoaderData,
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import customFetch from "../../utils/customFetch";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import TuneIcon from "@mui/icons-material/Tune";
import ClearIcon from "@mui/icons-material/Clear";
import { EUROPEAN_COUNTRIES } from "../../data/europeanLocations";

/* ── Loader: оголошення, категорії та публічна статистика ── */
export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const sort = url.searchParams.get("sort") || "newest";
  const minPrice = url.searchParams.get("minPrice") || "";
  const maxPrice = url.searchParams.get("maxPrice") || "";
  const search = url.searchParams.get("search") || "";
  const category = url.searchParams.get("category") || "";
  const city = url.searchParams.get("city") || "";
  const country = url.searchParams.get("country") || "";
  const lat = url.searchParams.get("lat") || "";
  const lng = url.searchParams.get("lng") || "";
  const radius = url.searchParams.get("radius") || "";
  const params = { page, limit: 24, sort };
  if (minPrice !== "") params.minPrice = minPrice;
  if (maxPrice !== "") params.maxPrice = maxPrice;
  if (search !== "") params.search = search;
  if (category !== "") params.category = category;
  if (city !== "") params.city = city;
  if (country !== "") params.country = country;
  if (lat !== "") params.lat = lat;
  if (lng !== "") params.lng = lng;
  if (radius !== "") params.radius = radius;

  const [adsRes, categoriesRes, statsRes] = await Promise.allSettled([
    customFetch.get("/adv", { params }),
    customFetch.get("/categories"),
    customFetch.get("/public/stats"),
  ]);
  if (adsRes.status === "rejected") throw adsRes.reason;

  const adsPayload = adsRes.value.data;
  const ads = Array.isArray(adsPayload) ? adsPayload : adsPayload.ads || [];
  const pagination = Array.isArray(adsPayload)
    ? null
    : {
        page: adsPayload.page || page,
        limit: adsPayload.limit || 24,
        total: adsPayload.total ?? 0,
        totalPages: adsPayload.totalPages || 1,
      };
  const categories =
    categoriesRes.status === "fulfilled" ? categoriesRes.value.data : [];
  const stats = statsRes.status === "fulfilled" ? statsRes.value.data : null;

  return {
    ads: Array.isArray(ads) ? ads : [],
    categories: Array.isArray(categories) ? categories : categories?.data || [],
    pagination,
    stats,
  };
};

/* ── Design tokens ── */
const F_BODY = "'Plus Jakarta Sans', sans-serif";
const F_DISPLAY = "'Playfair Display', serif";
const BLUE = "#0057B8";

/* ── Функція призначення іконки та кольору для динамічної категорії ── */
export function getCategoryMeta(name) {
  const n = (name || "").toLowerCase();
  if (
    n.includes("робот") ||
    n.includes("ваканс") ||
    n.includes("прац") ||
    n.includes("work") ||
    n.includes("job")
  ) {
    return { icon: "work", bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0" };
  }
  if (
    n.includes("нерухом") ||
    n.includes("житл") ||
    n.includes("квартир") ||
    n.includes("оренд") ||
    n.includes("кімнат") ||
    n.includes("house") ||
    n.includes("flat")
  ) {
    return { icon: "home", bg: "#fff7ed", text: "#9a3412", border: "#fed7aa" };
  }
  if (
    n.includes("послуг") ||
    n.includes("сервіс") ||
    n.includes("майстер") ||
    n.includes("ремонт") ||
    n.includes("service")
  ) {
    return { icon: "build", bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" };
  }
  if (
    n.includes("освіт") ||
    n.includes("навчан") ||
    n.includes("курс") ||
    n.includes("мов") ||
    n.includes("школ") ||
    n.includes("educat")
  ) {
    return {
      icon: "school",
      bg: "#f5f3ff",
      text: "#6d28d9",
      border: "#ddd6fe",
    };
  }
  if (
    n.includes("транспорт") ||
    n.includes("авто") ||
    n.includes("поїздк") ||
    n.includes("перевезен") ||
    n.includes("машин")
  ) {
    return {
      icon: "directions_car",
      bg: "#ecfeff",
      text: "#0e7490",
      border: "#a5f3fc",
    };
  }
  if (
    n.includes("спільнот") ||
    n.includes("допомог") ||
    n.includes("волонтер") ||
    n.includes("гуманітар") ||
    n.includes("благодійн")
  ) {
    return {
      icon: "diversity_3",
      bg: "#fdf2f8",
      text: "#be185d",
      border: "#fbcfe8",
    };
  }
  if (
    n.includes("електрон") ||
    n.includes("технік") ||
    n.includes("гаджет") ||
    n.includes("комп") ||
    n.includes("телефон")
  ) {
    return {
      icon: "devices",
      bg: "#eef2ff",
      text: "#4338ca",
      border: "#c7d2fe",
    };
  }
  if (
    n.includes("одяг") ||
    n.includes("взутт") ||
    n.includes("реч") ||
    n.includes("мод")
  ) {
    return {
      icon: "checkroom",
      bg: "#fffbeb",
      text: "#b45309",
      border: "#fde68a",
    };
  }
  if (n.includes("дитяч") || n.includes("діт") || n.includes("іграшк")) {
    return {
      icon: "child_care",
      bg: "#fff1f2",
      text: "#be123c",
      border: "#fecdd3",
    };
  }
  return {
    icon: "category",
    bg: "#f8fafc",
    text: "#475569",
    border: "#e2e8f0",
  };
}

/* ── Популярні країни для швидких фільтрів ── */
const POPULAR_COUNTRIES = [
  { name: "Польща", flag: "🇵🇱" },
  { name: "Німеччина", flag: "🇩🇪" },
  { name: "Чехія", flag: "🇨🇿" },
  { name: "Франція", flag: "🇫🇷" },
  { name: "Іспанія", flag: "🇪🇸" },
  { name: "Італія", flag: "🇮🇹" },
  { name: "Україна", flag: "🇺🇦" },
  { name: "Австрія", flag: "🇦🇹" },
  { name: "Нідерланди", flag: "🇳🇱" },
  { name: "Велика Британія", flag: "🇬🇧" },
];

export default function Ads() {
  const loaderData = useLoaderData();
  const pagination = loaderData?.pagination;
  const stats = loaderData?.stats;
  const navigate = useNavigate();

  // Отримуємо масив оголошень (підтримує зворотну сумісність)
  const data = useMemo(() => {
    if (Array.isArray(loaderData)) return loaderData;
    return loaderData?.ads || [];
  }, [loaderData]);

  // Динамічні категорії з /dashboard/categories (/categories)
  const [categories, setCategories] = useState(() => {
    if (Array.isArray(loaderData?.categories)) return loaderData.categories;
    if (Array.isArray(loaderData?.categories?.data))
      return loaderData.categories.data;
    return [];
  });

  // Запасне завантаження категорій, якщо в loader вони не передалися
  useEffect(() => {
    if (categories.length === 0) {
      customFetch
        .get("/categories")
        .then(({ data: catData }) => {
          if (Array.isArray(catData)) setCategories(catData);
          else if (Array.isArray(catData?.data)) setCategories(catData.data);
        })
        .catch(() => {});
    }
  }, [categories.length]);

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [sort, setSort] = useState(() => searchParams.get("sort") || "newest");
  const [minPrice, setMinPrice] = useState(
    () => searchParams.get("minPrice") || "",
  );
  const [maxPrice, setMaxPrice] = useState(
    () => searchParams.get("maxPrice") || "",
  );
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [radius, setRadius] = useState(() => searchParams.get("radius") || "");
  const [compareIds, setCompareIds] = useState([]);

  const toggleCompare = (id) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const navigateToCompare = () => {
    const ids = compareIds.slice(0, 5);
    navigate(`/compare?ids=${ids.join(",")}`);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (search) next.set("search", search);
        else next.delete("search");
        if (sort !== "newest") next.set("sort", sort);
        else next.delete("sort");
        if (minPrice) next.set("minPrice", minPrice);
        else next.delete("minPrice");
        if (maxPrice) next.set("maxPrice", maxPrice);
        else next.delete("maxPrice");
        if (category) next.set("category", category);
        else next.delete("category");
        if (city) next.set("city", city);
        else next.delete("city");
        if (country) next.set("country", country);
        else next.delete("country");
        if (radius) next.set("radius", radius);
        else next.delete("radius");
        next.delete("page");
        return next;
      });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [
    search,
    sort,
    minPrice,
    maxPrice,
    category,
    city,
    country,
    radius,
    setSearchParams,
  ]);

  /* Автопідказки пошуку */
  useEffect(() => {
    if (!search || search.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuggestions([]);
       
      setShowSuggestions(false);
      return;
    }
    let cancelled = false;
    customFetch
      .get("/adv/suggestions", { params: { q: search, limit: 5 } })
      .then(({ data }) => {
        if (cancelled) return;
        setSuggestions(data || { ads: [], categories: [] });
        setShowSuggestions(true);
      })
      .catch(() => {
        setSuggestions([]);
        setShowSuggestions(false);
      });
    return () => {
      cancelled = true;
    };
  }, [search]);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(true);

  const handleViewChange = (_, v) => {
    if (v) setViewMode(v);
  };

  /* Обробник зміни країни: скидаємо місто */
  const handleCountryChange = (newCountry) => {
    setCountry(newCountry);
    setCity("");
  };

  /* Обробник зміни категорії: скидаємо підкатегорію */
  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    setSubcategory("");
  };

  // Поточний обраний об'єкт категорії та його підкатегорії
  const selectedCategoryObj = useMemo(() => {
    if (!category) return null;
    return categories.find(
      (c) => String(c.id) === String(category) || c.name === category,
    );
  }, [categories, category]);

  const currentSubcategories = useMemo(() => {
    if (!selectedCategoryObj) return [];
    return (
      selectedCategoryObj.SubCategories ||
      selectedCategoryObj.subcategories ||
      []
    );
  }, [selectedCategoryObj]);

  /* Дані вже відфільтровані на сервері (пошук, категорія, місто, країна, ціна).
     Залишаємо лише клієнтську фільтрацію за підкатегорією. */
  const filtered = useMemo(() => {
    if (!subcategory) return data || [];
    const filterSubStr = String(subcategory).trim().toLowerCase();
    return (data || []).filter((ad) => {
      if (!ad) return false;
      if (ad.subcategoryId && String(ad.subcategoryId) === filterSubStr)
        return true;
      if (ad.subcategory?.id && String(ad.subcategory.id) === filterSubStr)
        return true;
      const adSubName = (ad.subcategory?.name || "").trim().toLowerCase();
      if (
        adSubName &&
        (adSubName === filterSubStr || adSubName.includes(filterSubStr))
      ) {
        return true;
      }
      return false;
    });
  }, [data, subcategory]);

  const hasFilters = Boolean(
    country ||
    city ||
    category ||
    subcategory ||
    search ||
    minPrice ||
    maxPrice ||
    radius,
  );

  const clearFilters = () => {
    setCountry("");
    setCity("");
    setCategory("");
    setSubcategory("");
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setRadius("");
  };

  // Динамічна статистика
  const dynamicStats = [
    {
      icon: "campaign",
      label: "Активних оголошень",
      value: stats?.ads == null ? "—" : stats.ads.toLocaleString("uk-UA"),
    },
    {
      icon: "public",
      label: "Країн з оголошеннями",
      value:
        stats?.adCountries == null
          ? "—"
          : stats.adCountries.toLocaleString("uk-UA"),
    },
    {
      icon: "location_on",
      label: "Міст з оголошеннями",
      value:
        stats?.adCities == null ? "—" : stats.adCities.toLocaleString("uk-UA"),
    },
    {
      icon: "category",
      label: "Категорій",
      value: `${categories.length}`,
    },
  ];

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
            {dynamicStats.map((s, i) => (
              <Grid
                key={s.label}
                size={{ xs: 6, sm: 3 }}
                sx={{
                  textAlign: "center",
                  py: 1,
                  borderRight:
                    i < dynamicStats.length - 1
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
                {filtered.length}{" "}
                {filtered.length === 1
                  ? "оголошення"
                  : filtered.length >= 2 && filtered.length <= 4
                    ? "оголошення"
                    : "оголошень"}
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
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Сортування</InputLabel>
                <Select
                  label="Сортування"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                >
                  <MenuItem value="newest">Нові спочатку</MenuItem>
                  <MenuItem value="oldest">Старі спочатку</MenuItem>
                  <MenuItem value="priceAsc">Спочатку дешевші</MenuItem>
                  <MenuItem value="priceDesc">Спочатку дорожчі</MenuItem>
                  <MenuItem value="popular">Популярні</MenuItem>
                </Select>
              </FormControl>
              <TextField
                size="small"
                label="Ціна від"
                type="number"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
                sx={{ width: 110 }}
                slotProps={{
                  htmlInput: {
                    min: 0,
                  },
                }}
              />
              <TextField
                size="small"
                label="Ціна до"
                type="number"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                sx={{ width: 110 }}
                slotProps={{
                  htmlInput: {
                    min: 0,
                  },
                }}
              />
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
                  `(${[country, city, category, subcategory, search].filter(Boolean).length})`}
              </Button>

              {/* Кнопка порівняння */}
              <Button
                startIcon={<CompareIcon sx={{ fontSize: 16 }} />}
                onClick={navigateToCompare}
                disabled={compareIds.length < 2}
                sx={{
                  fontFamily: F_BODY,
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "0.85rem",
                  border: `1.5px solid ${compareIds.length > 0 ? BLUE : "#e2e8f0"}`,
                  color: compareIds.length > 0 ? BLUE : "#64748b",
                  borderRadius: "10px",
                  px: 2,
                  py: 0.9,
                  bgcolor:
                    compareIds.length > 0 ? "rgba(0,87,184,.06)" : "#fff",
                  "&:hover": {
                    borderColor: BLUE,
                    color: BLUE,
                    bgcolor: "rgba(0,87,184,.06)",
                  },
                  "&:disabled": {
                    borderColor: "#e2e8f0",
                    color: "#94a3b8",
                  },
                }}
              >
                {compareIds.length > 0
                  ? `Порівняти (${compareIds.length})`
                  : "Порівняти"}
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
              {/* Поля форми фільтрів */}
              <Grid container spacing={2} sx={{ alignItems: "center" }}>
                {/* 1. Пошук */}
                <Grid size={{ xs: 12, md: 3.5 }}>
                  <Box sx={{ position: "relative", width: "100%" }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Пошук за назвою або описом..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onFocus={() => setShowSuggestions(search.length >= 2)}
                      onBlur={() =>
                        setTimeout(() => setShowSuggestions(false), 150)
                      }
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon
                                sx={{ fontSize: 18, color: "#94a3b8" }}
                              />
                            </InputAdornment>
                          ),
                          endAdornment: search ? (
                            <InputAdornment position="end">
                              <IconButton
                                size="small"
                                onClick={() => setSearch("")}
                                sx={{ p: 0.5, color: "#94a3b8" }}
                              >
                                <ClearIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          ) : null,
                        },
                        htmlInput: {},
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          fontFamily: F_BODY,
                          bgcolor: "#f8fafc",
                          "& fieldset": { borderColor: "#e2e8f0" },
                          "&:hover fieldset": { borderColor: BLUE },
                          "&.Mui-focused fieldset": { borderColor: BLUE },
                        },
                      }}
                    />
                    {showSuggestions && suggestions && (
                      <Dialog
                        open={showSuggestions}
                        onClose={() => setShowSuggestions(false)}
                        maxWidth="sm"
                        fullWidth
                        PaperProps={{
                          sx: {
                            position: "absolute",
                            top: "calc(100% + 4px)",
                            left: 0,
                            right: 0,
                            zIndex: 1050,
                            maxHeight: "420px",
                            overflowY: "auto",
                            borderRadius: "12px",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                          },
                        }}
                      >
                        <List dense>
                          {suggestions.ads.slice(0, 3).map((a) => (
                            <ListItem
                              key={`ad-${a.id}`}
                              button
                              component={Link}
                              to={`/ads/${a.id}`}
                              onClick={() => setShowSuggestions(false)}
                              sx={{ px: 1, py: 1, gap: 1 }}
                            >
                              <ListItemAvatar>
                                <Avatar
                                  src={
                                    a.photo?.startsWith("http")
                                      ? a.photo
                                      : a.photo
                                        ? `${import.meta.env.VITE_APP_API_URL || "http://localhost:5000"}/uploads/adv/${a.photo.replace(/^public\/uploads\/adv\//, "")}`
                                        : undefined
                                  }
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    bgcolor: "#f1f5f9",
                                  }}
                                />
                              </ListItemAvatar>
                              <ListItemText
                                primary={a.title}
                                secondary={
                                  a.subtitle
                                    ? `${a.subtitle} · ${a.city || ""}`
                                    : a.city || ""
                                }
                                sx={{ primary: { fontWeight: 600 } }}
                              />
                            </ListItem>
                          ))}
                          {suggestions.categories.slice(0, 3).map((c) => (
                            <ListItem
                              key={`cat-${c.id}`}
                              button
                              onClick={() => {
                                setCategory(String(c.id));
                                setSearch("");
                                setShowSuggestions(false);
                              }}
                              sx={{ px: 1, py: 1 }}
                            >
                              <ListItemText
                                primary={c.title}
                                secondary="Категорія"
                                sx={{ primary: { fontWeight: 600 } }}
                              />
                            </ListItem>
                          ))}
                          {suggestions.ads.length === 0 &&
                            suggestions.categories.length === 0 && (
                              <ListItem
                                disabled
                                sx={{ px: 1, py: 1, color: "#94a3b8" }}
                              >
                                Нічого не знайдено
                              </ListItem>
                            )}
                        </List>
                      </Dialog>
                    )}
                  </Box>
                </Grid>

                {/* 2. СПОЧАТКУ ЗА КРАЇНОЮ */}
                <Grid size={{ xs: 12, sm: 6, md: 2.8 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ fontFamily: F_BODY }}>Країна</InputLabel>
                    <Select
                      value={country}
                      label="Країна"
                      onChange={(e) => handleCountryChange(e.target.value)}
                      sx={{
                        borderRadius: "12px",
                        fontFamily: F_BODY,
                        bgcolor: "#f8fafc",
                        "& fieldset": { borderColor: "#e2e8f0" },
                        "&:hover fieldset": { borderColor: BLUE },
                        "&.Mui-focused fieldset": { borderColor: BLUE },
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 340,
                            borderRadius: "14px",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                          },
                        },
                      }}
                    >
                      <MenuItem
                        value=""
                        sx={{
                          fontFamily: F_BODY,
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          py: 1,
                        }}
                      >
                        🌍 Всі країни
                      </MenuItem>
                      {EUROPEAN_COUNTRIES.map((c) => (
                        <MenuItem
                          key={c.code}
                          value={c.name}
                          sx={{
                            fontFamily: F_BODY,
                            fontSize: "0.875rem",
                            gap: 1.2,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ fontSize: "1.15rem" }}>{c.flag}</span>
                          <span style={{ fontWeight: 500 }}>{c.name}</span>
                          {c.nameEn && c.nameEn !== c.name && (
                            <Typography
                              component="span"
                              sx={{
                                fontFamily: F_BODY,
                                fontSize: "0.72rem",
                                color: "#94a3b8",
                                ml: "auto",
                              }}
                            >
                              {c.nameEn}
                            </Typography>
                          )}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* 3. ПОТІМ ЗА МІСТОМ (динамічно пов'язане з обраною країною) */}
                <Grid size={{ xs: 12, sm: 6, md: 3.2 }}>
                  <CitySelectField
                    country={country}
                    value={city}
                    onChange={(newCity) => setCity(newCity)}
                    name="city"
                    label={
                      country ? `Місто (${country})` : "Місто (всі країни)"
                    }
                    placeholder={
                      country
                        ? `Всі міста в ${country}...`
                        : "Оберіть місто або країну..."
                    }
                    size="small"
                    isFilter={true}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        bgcolor: "#f8fafc",
                        "& fieldset": { borderColor: "#e2e8f0" },
                        "&:hover fieldset": { borderColor: BLUE },
                        "&.Mui-focused fieldset": { borderColor: BLUE },
                      },
                    }}
                  />
                </Grid>

                {/* 3.1. Радіус пошуку (км) — працює разом з місцем/геолокацією */}
                <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                  >
                    <TextField
                      fullWidth
                      size="small"
                      label="Радіус (км)"
                      type="number"
                      value={radius}
                      onChange={(e) => setRadius(e.target.value)}
                      slotProps={{
                        htmlInput: {
                          min: 1,
                          max: 1000,
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          fontFamily: F_BODY,
                          bgcolor: "#f8fafc",
                          "& fieldset": { borderColor: "#e2e8f0" },
                        },
                      }}
                    />
                    <Button
                      size="small"
                      onClick={() => {
                        if (!navigator.geolocation) {
                          toast.error("Геолокація не підтримується браузером");
                          return;
                        }
                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            const { latitude, longitude } = pos.coords;
                            setSearchParams((prev) => {
                              prev.set("lat", String(latitude));
                              prev.set("lng", String(longitude));
                              if (radius) prev.set("radius", radius);
                              else prev.set("radius", "10");
                              prev.delete("page");
                              return prev;
                            });
                          },
                          () =>
                            toast.error("Не вдалося отримати місцеположення"),
                        );
                      }}
                      sx={{
                        fontFamily: F_BODY,
                        fontSize: "0.72rem",
                        textTransform: "none",
                        color: BLUE,
                        p: 0,
                        minWidth: "auto",
                        "&:hover": {
                          bgcolor: "transparent",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Моє місцеположення
                    </Button>
                  </Box>
                </Grid>

                {/* 4. ДИНАМІЧНА КАТЕГОРІЯ (з /dashboard/categories) */}
                <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ fontFamily: F_BODY }}>
                      Категорія
                    </InputLabel>
                    <Select
                      value={category}
                      label="Категорія"
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      sx={{
                        borderRadius: "12px",
                        fontFamily: F_BODY,
                        bgcolor: "#f8fafc",
                        "& fieldset": { borderColor: "#e2e8f0" },
                        "&:hover fieldset": { borderColor: BLUE },
                        "&.Mui-focused fieldset": { borderColor: BLUE },
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 340,
                            borderRadius: "14px",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                          },
                        },
                      }}
                    >
                      <MenuItem
                        value=""
                        sx={{
                          fontFamily: F_BODY,
                          fontSize: "0.875rem",
                          fontWeight: 600,
                        }}
                      >
                        Всі категорії
                      </MenuItem>
                      {categories.map((c) => {
                        const meta = getCategoryMeta(c.name);
                        return (
                          <MenuItem
                            key={c.id}
                            value={String(c.id)}
                            sx={{
                              fontFamily: F_BODY,
                              fontSize: "0.875rem",
                              gap: 1.5,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <span
                              className="material-icons"
                              style={{ fontSize: 18, color: meta.text }}
                            >
                              {meta.icon}
                            </span>
                            {c.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Швидкі кнопки вибору країни */}
              <Box
                sx={{
                  mt: 2.5,
                  display: "flex",
                  gap: 0.8,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontSize: "0.74rem",
                    color: "#64748b",
                    fontWeight: 600,
                    mr: 0.5,
                  }}
                >
                  Країна:
                </Typography>
                <Chip
                  label="🌍 Всі країни"
                  size="small"
                  onClick={() => handleCountryChange("")}
                  sx={{
                    fontFamily: F_BODY,
                    fontWeight: 600,
                    fontSize: "0.76rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    bgcolor: !country ? BLUE : "#f1f5f9",
                    color: !country ? "#fff" : "#475569",
                    "&:hover": { bgcolor: !country ? "#003d82" : "#e2e8f0" },
                  }}
                />
                {POPULAR_COUNTRIES.map((c) => {
                  const isSel = country.toLowerCase() === c.name.toLowerCase();
                  return (
                    <Chip
                      key={c.name}
                      label={`${c.flag} ${c.name}`}
                      size="small"
                      onClick={() => handleCountryChange(isSel ? "" : c.name)}
                      sx={{
                        fontFamily: F_BODY,
                        fontWeight: 600,
                        fontSize: "0.76rem",
                        borderRadius: "8px",
                        cursor: "pointer",
                        bgcolor: isSel ? BLUE : "#fff",
                        color: isSel ? "#fff" : "#334155",
                        border: `1px solid ${isSel ? BLUE : "#e2e8f0"}`,
                        transition: "all 0.15s ease",
                        "&:hover": {
                          bgcolor: isSel ? "#003d82" : "rgba(0,87,184,.06)",
                          borderColor: BLUE,
                        },
                      }}
                    />
                  );
                })}
              </Box>

              {/* Швидкі чіпи динамічних категорій (з /dashboard/categories) */}
              <Box
                sx={{
                  mt: 1.5,
                  display: "flex",
                  gap: 0.8,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontSize: "0.74rem",
                    color: "#64748b",
                    fontWeight: 600,
                    mr: 0.5,
                  }}
                >
                  Категорія:
                </Typography>
                <Chip
                  label="Всі категорії"
                  size="small"
                  onClick={() => handleCategoryChange("")}
                  sx={{
                    fontFamily: F_BODY,
                    fontWeight: 600,
                    fontSize: "0.76rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    bgcolor: !category ? BLUE : "#f1f5f9",
                    color: !category ? "#fff" : "#475569",
                    "&:hover": { bgcolor: !category ? "#003d82" : "#e2e8f0" },
                  }}
                />
                {categories.map((c) => {
                  const meta = getCategoryMeta(c.name);
                  const isCatActive =
                    String(category) === String(c.id) || category === c.name;
                  return (
                    <Chip
                      key={c.id}
                      icon={
                        <span
                          className="material-icons"
                          style={{
                            fontSize: 15,
                            color: isCatActive ? "#fff" : meta.text,
                            marginLeft: 4,
                          }}
                        >
                          {meta.icon}
                        </span>
                      }
                      label={c.name}
                      onClick={() =>
                        handleCategoryChange(isCatActive ? "" : String(c.id))
                      }
                      size="small"
                      sx={{
                        fontFamily: F_BODY,
                        fontWeight: 600,
                        fontSize: "0.76rem",
                        borderRadius: "8px",
                        cursor: "pointer",
                        bgcolor: isCatActive ? BLUE : meta.bg,
                        color: isCatActive ? "#fff" : meta.text,
                        border: `1px solid ${
                          isCatActive ? BLUE : meta.border || "#e2e8f0"
                        }`,
                        transition: "all 0.15s ease",
                        "&:hover": {
                          bgcolor: isCatActive ? "#003d82" : meta.bg,
                          borderColor: BLUE,
                        },
                      }}
                    />
                  );
                })}
              </Box>

              {/* Рядок підкатегорій (якщо обрано категорію, що має підкатегорії) */}
              {currentSubcategories.length > 0 && (
                <Box
                  sx={{
                    mt: 1.5,
                    pt: 1.2,
                    display: "flex",
                    gap: 0.8,
                    flexWrap: "wrap",
                    alignItems: "center",
                    borderTop: "1px dotted #f1f5f9",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: F_BODY,
                      fontSize: "0.72rem",
                      color: "#64748b",
                      fontWeight: 600,
                      mr: 0.5,
                    }}
                  >
                    Підкатегорія:
                  </Typography>
                  <Chip
                    label="Всі підкатегорії"
                    size="small"
                    onClick={() => setSubcategory("")}
                    sx={{
                      fontFamily: F_BODY,
                      fontWeight: 600,
                      fontSize: "0.72rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                      bgcolor: !subcategory ? BLUE : "#f8fafc",
                      color: !subcategory ? "#fff" : "#475569",
                      "&:hover": {
                        bgcolor: !subcategory ? "#003d82" : "#e2e8f0",
                      },
                    }}
                  />
                  {currentSubcategories.map((sub) => {
                    const isSubSel =
                      String(subcategory) === String(sub.id) ||
                      subcategory === sub.name;
                    return (
                      <Chip
                        key={sub.id}
                        label={sub.name}
                        size="small"
                        onClick={() =>
                          setSubcategory(isSubSel ? "" : String(sub.id))
                        }
                        sx={{
                          fontFamily: F_BODY,
                          fontWeight: 500,
                          fontSize: "0.72rem",
                          borderRadius: "6px",
                          cursor: "pointer",
                          bgcolor: isSubSel ? BLUE : "#fff",
                          color: isSubSel ? "#fff" : "#334155",
                          border: `1px solid ${isSubSel ? BLUE : "#e2e8f0"}`,
                          transition: "all 0.15s ease",
                          "&:hover": {
                            bgcolor: isSubSel
                              ? "#003d82"
                              : "rgba(0,87,184,.06)",
                            borderColor: BLUE,
                          },
                        }}
                      />
                    );
                  })}
                </Box>
              )}

              {/* Рядок активних фільтрів з кнопками видалення */}
              {hasFilters && (
                <Box
                  sx={{
                    mt: 2.2,
                    pt: 1.8,
                    borderTop: "1px dashed #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: F_BODY,
                      fontSize: "0.74rem",
                      color: "#64748b",
                      fontWeight: 600,
                    }}
                  >
                    Активні фільтри:
                  </Typography>

                  {country && (
                    <Chip
                      size="small"
                      label={`Країна: ${country}`}
                      onDelete={() => handleCountryChange("")}
                      sx={{
                        fontFamily: F_BODY,
                        fontSize: "0.75rem",
                        bgcolor: "rgba(0,87,184,.08)",
                        color: BLUE,
                        fontWeight: 600,
                      }}
                    />
                  )}

                  {city && (
                    <Chip
                      size="small"
                      label={`Місто: ${city}`}
                      onDelete={() => setCity("")}
                      sx={{
                        fontFamily: F_BODY,
                        fontSize: "0.75rem",
                        bgcolor: "rgba(0,87,184,.08)",
                        color: BLUE,
                        fontWeight: 600,
                      }}
                    />
                  )}

                  {category && (
                    <Chip
                      size="small"
                      label={`Категорія: ${
                        selectedCategoryObj?.name ||
                        categories.find(
                          (c) =>
                            String(c.id) === String(category) ||
                            c.name === category,
                        )?.name ||
                        category
                      }`}
                      onDelete={() => handleCategoryChange("")}
                      sx={{
                        fontFamily: F_BODY,
                        fontSize: "0.75rem",
                        bgcolor: "rgba(0,87,184,.08)",
                        color: BLUE,
                        fontWeight: 600,
                      }}
                    />
                  )}

                  {subcategory && (
                    <Chip
                      size="small"
                      label={`Підкатегорія: ${
                        currentSubcategories.find(
                          (s) =>
                            String(s.id) === String(subcategory) ||
                            s.name === subcategory,
                        )?.name || subcategory
                      }`}
                      onDelete={() => setSubcategory("")}
                      sx={{
                        fontFamily: F_BODY,
                        fontSize: "0.75rem",
                        bgcolor: "rgba(0,87,184,.08)",
                        color: BLUE,
                        fontWeight: 600,
                      }}
                    />
                  )}

                  {search && (
                    <Chip
                      size="small"
                      label={`Пошук: "${search}"`}
                      onDelete={() => setSearch("")}
                      sx={{
                        fontFamily: F_BODY,
                        fontSize: "0.75rem",
                        bgcolor: "rgba(0,87,184,.08)",
                        color: BLUE,
                        fontWeight: 600,
                      }}
                    />
                  )}

                  <Button
                    size="small"
                    onClick={clearFilters}
                    sx={{
                      fontFamily: F_BODY,
                      fontSize: "0.72rem",
                      textTransform: "none",
                      color: "#dc2626",
                      p: 0,
                      ml: 1,
                      minWidth: "auto",
                      fontWeight: 600,
                      "&:hover": {
                        bgcolor: "transparent",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Скинути всі
                  </Button>
                </Box>
              )}
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
              {viewMode === "grid" ? (
                <GridView
                  ads={filtered}
                  compareIds={compareIds}
                  onToggleCompare={toggleCompare}
                />
              ) : (
                <ListView
                  ads={filtered}
                  compareIds={compareIds}
                  onToggleCompare={toggleCompare}
                />
              )}
            </Box>
          )}

          {pagination && pagination.totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                mt: 4,
              }}
            >
              <Button
                variant="outlined"
                disabled={pagination.page <= 1}
                onClick={() => {
                  setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    next.set("page", String(pagination.page - 1));
                    return next;
                  });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Попередня
              </Button>
              <Typography sx={{ color: "#64748b", fontSize: "0.875rem" }}>
                {pagination.page} / {pagination.totalPages}
              </Typography>
              <Button
                variant="outlined"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => {
                  setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    next.set("page", String(pagination.page + 1));
                    return next;
                  });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Наступна
              </Button>
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
