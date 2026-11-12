import { Fragment, useState, useMemo } from "react";
import { HeroSection } from "../components";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Grid,
  Avatar,
  Skeleton,
  Tooltip,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FilterListIcon from "@mui/icons-material/FilterList";
import PushPinIcon from "@mui/icons-material/PushPin";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import SortIcon from "@mui/icons-material/Sort";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import ClearIcon from "@mui/icons-material/Clear";
import { Form, useLoaderData, useNavigation, Link } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { useAuthContext } from "../context/AuthContext";
import CitySelectField from "../components/CitySelectField";
import { EUROPEAN_COUNTRIES } from "../data/europeanLocations";

const fontBody = "'Plus Jakarta Sans', sans-serif";
const fontDisplay = "'Playfair Display', serif";
const BLUE = "#0057B8";
const GOLD = "#FFD700";

const EUROPE_COUNTRIES = EUROPEAN_COUNTRIES.map((c) => c.name);

// ── Loader ────────────────────────────────────────────────
export async function loader() {
  try {
    const [topicsRes, categoriesRes, statsRes] = await Promise.allSettled([
      customFetch.get("/forum"),
      customFetch.get("/forum/categories"),
      customFetch.get("/forum/stats"),
    ]);

    return {
      topics: topicsRes.status === "fulfilled" ? topicsRes.value.data : [],
      categories:
        categoriesRes.status === "fulfilled" ? categoriesRes.value.data : [],
      stats: statsRes.status === "fulfilled" ? statsRes.value.data : null,
    };
  } catch (error) {
    toast.error("Не вдалося завантажити форум");
    return { topics: [], categories: [], stats: null };
  }
}

// ── Action ────────────────────────────────────────────────
export async function action({ request }) {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");
  const forumCategoryId = formData.get("forumCategoryId");
  const forumSubcategoryId = formData.get("forumSubcategoryId") || null;
  const country = formData.get("country") || null;
  const city = formData.get("city") || null;

  try {
    const { data } = await customFetch.post("/forum", {
      title,
      content,
      forumCategoryId: forumCategoryId ? Number(forumCategoryId) : null,
      forumSubcategoryId: forumSubcategoryId
        ? Number(forumSubcategoryId)
        : null,
      country,
      city,
    });
    toast.success("Тему успішно створено!");
    return { success: true, data };
  } catch (error) {
    toast.error(error?.response?.data?.message || "Помилка створення теми");
    return {
      success: false,
      message: error?.response?.data?.message || "Помилка",
    };
  }
}

// ── Stat Card ─────────────────────────────────────────────
function StatCard({ icon, value, label }) {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 2.5,
        px: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0.5,
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "12px",
          bgcolor: "rgba(255,255,255,.12)",
          border: "1px solid rgba(255,255,255,.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1,
        }}
      >
        {icon}
      </Box>
      <Typography
        sx={{
          fontFamily: fontDisplay,
          fontWeight: 800,
          fontSize: { xs: "1.6rem", md: "2rem" },
          color: "#fff",
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
      >
        {value ?? (
          <Skeleton width={60} sx={{ bgcolor: "rgba(255,255,255,.2)" }} />
        )}
      </Typography>
      <Typography
        sx={{
          fontFamily: fontBody,
          fontSize: "0.75rem",
          color: "rgba(255,255,255,.75)",
          fontWeight: 500,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

// ── Category Row ──────────────────────────────────────────
function CategoryRow({ cat, isSelected, onClick, isLast }) {
  return (
    <>
      <Box
        onClick={onClick}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          px: 2.5,
          py: 2,
          cursor: "pointer",
          transition: "all 0.18s ease",
          borderRadius: "12px",
          mx: 1,
          borderLeft: isSelected
            ? `4px solid ${cat.color || BLUE}`
            : "4px solid transparent",
          bgcolor: isSelected ? "rgba(0,87,184,.06)" : "transparent",
          "&:hover": { bgcolor: isSelected ? "rgba(0,87,184,.09)" : "#f8fafc" },
          "&:hover .cat-arrow": { opacity: 1, transform: "translateX(0)" },
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: "12px",
            bgcolor: isSelected ? cat.color || BLUE : cat.bgColor || "#eff6ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.18s ease",
          }}
        >
          <span
            className="material-icons"
            style={{
              fontSize: 20,
              color: isSelected ? "#fff" : cat.color || BLUE,
            }}
          >
            {cat.icon || "forum"}
          </span>
        </Box>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: fontBody,
              fontWeight: 700,
              fontSize: "0.92rem",
              color: isSelected ? BLUE : "#0f172a",
              mb: 0.2,
            }}
          >
            {cat.title}
          </Typography>
          {cat.description && (
            <Typography
              sx={{
                fontFamily: fontBody,
                fontSize: "0.76rem",
                color: "#64748b",
                lineHeight: 1.35,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {cat.description}
            </Typography>
          )}
        </Box>
        <Box sx={{ textAlign: "right", flexShrink: 0 }}>
          <Typography
            sx={{
              fontFamily: fontBody,
              fontWeight: 700,
              fontSize: "0.9rem",
              color: isSelected ? BLUE : "#0f172a",
            }}
          >
            {(cat.topicsCount || 0).toLocaleString()}
          </Typography>
          <Typography
            sx={{ fontFamily: fontBody, fontSize: "0.68rem", color: "#94a3b8" }}
          >
            тем
          </Typography>
        </Box>
        <ArrowForwardIcon
          className="cat-arrow"
          sx={{
            fontSize: 16,
            color: cat.color || BLUE,
            opacity: isSelected ? 1 : 0,
            transform: isSelected ? "translateX(0)" : "translateX(-4px)",
            transition: "all 0.18s",
            flexShrink: 0,
          }}
        />
      </Box>
      {!isLast && <Divider sx={{ borderColor: "#f1f5f9", mx: 2 }} />}
    </>
  );
}

// ── Category Card (Grid View) ──────────────────────────────
function CategoryCard({ cat, isSelected, onClick }) {
  return (
    <Card
      onClick={onClick}
      sx={{
        borderRadius: "16px",
        border: `1.5px solid ${isSelected ? cat.color || BLUE : "#e2e8f0"}`,
        boxShadow: isSelected
          ? "0 4px 16px rgba(0,87,184,.15)"
          : "0 1px 3px rgba(0,0,0,.04)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: isSelected ? "rgba(0,87,184,.03)" : "#fff",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 8px 24px rgba(0,87,184,.12)",
          borderColor: cat.color || BLUE,
        },
      }}
    >
      <Box sx={{ height: 4, bgcolor: cat.color || BLUE }} />
      <CardContent
        sx={{
          p: 2,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              bgcolor: cat.bgColor || "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              className="material-icons"
              style={{ fontSize: 20, color: cat.color || BLUE }}
            >
              {cat.icon || "forum"}
            </span>
          </Box>
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography
              sx={{
                fontFamily: fontBody,
                fontWeight: 700,
                fontSize: "0.88rem",
                color: "#0f172a",
                lineHeight: 1.25,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {cat.title}
            </Typography>
            <Typography
              sx={{
                fontFamily: fontBody,
                fontSize: "0.7rem",
                color: "#64748b",
              }}
            >
              {cat.topicsCount || 0} тем · {cat.postsCount || 0} відп.
            </Typography>
          </Box>
        </Box>
        {cat.description && (
          <Typography
            sx={{
              fontFamily: fontBody,
              fontSize: "0.74rem",
              color: "#64748b",
              lineHeight: 1.35,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {cat.description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

// ── Topic Card ────────────────────────────────────────────
function TopicCard({ topic, categories, index }) {
  const cat =
    topic.forumCategory || categories.find((c) => c.title === topic.category);
  const color = cat?.color || "#64748b";
  const bg = cat?.bgColor || "#f1f5f9";
  const icon = cat?.icon || "forum";

  const authorInitial = topic.author ? topic.author[0].toUpperCase() : "?";

  return (
    <Card
      key={topic.id}
      component={Link}
      to={`/forum/${topic.id}`}
      sx={{
        borderRadius: "16px",
        border: topic.isPinned ? `1.5px solid ${GOLD}` : "1px solid #e2e8f0",
        boxShadow: topic.isPinned
          ? "0 4px 16px rgba(255,215,0,.2)"
          : "0 1px 4px rgba(0,0,0,.04)",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        textDecoration: "none",
        bgcolor: "#fff",
        animation: "fadeUp 0.3s ease both",
        animationDelay: `${index * 0.04}s`,
        position: "relative",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 24px rgba(0,87,184,.12)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {/* Top badges: Pinned / Closed */}
        {(topic.isPinned || topic.isClosed) && (
          <Box sx={{ display: "flex", gap: 1, mb: 1.5, flexWrap: "wrap" }}>
            {topic.isPinned && (
              <Chip
                icon={<PushPinIcon sx={{ fontSize: "13px !important" }} />}
                label="Закріплена тема"
                size="small"
                sx={{
                  bgcolor: "#fef9c3",
                  color: "#854d0e",
                  fontFamily: fontBody,
                  fontWeight: 700,
                  fontSize: "0.68rem",
                  border: "1px solid #fde047",
                }}
              />
            )}
            {topic.isClosed && (
              <Chip
                icon={<LockOutlinedIcon sx={{ fontSize: "13px !important" }} />}
                label="Обговорення закрито"
                size="small"
                sx={{
                  bgcolor: "#f1f5f9",
                  color: "#475569",
                  fontFamily: fontBody,
                  fontWeight: 700,
                  fontSize: "0.68rem",
                }}
              />
            )}
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 1.5, mb: 1.5 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: bg,
              color: color,
              fontSize: "0.85rem",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {authorInitial}
          </Avatar>
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography
              sx={{
                fontFamily: fontBody,
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "#0f172a",
                lineHeight: 1.35,
                mb: 0.4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {topic.title}
            </Typography>
            <Typography
              sx={{
                fontFamily: fontBody,
                fontSize: "0.72rem",
                color: "#94a3b8",
              }}
            >
              {topic.author} ·{" "}
              {new Date(topic.createdAt).toLocaleDateString("uk-UA")}
            </Typography>
          </Box>
        </Box>

        {/* Location & Tags */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
          {cat && (
            <Chip
              label={cat.title}
              size="small"
              icon={
                <span
                  className="material-icons"
                  style={{ fontSize: "12px !important", color }}
                >
                  {icon}
                </span>
              }
              sx={{
                bgcolor: bg,
                color,
                fontFamily: fontBody,
                fontWeight: 700,
                fontSize: "0.68rem",
              }}
            />
          )}

          {topic.forumSubcategory && (
            <Chip
              label={topic.forumSubcategory.title}
              size="small"
              sx={{
                bgcolor: "#f1f5f9",
                color: "#475569",
                fontFamily: fontBody,
                fontWeight: 600,
                fontSize: "0.65rem",
              }}
            />
          )}

          {(topic.country || topic.city) && (
            <Chip
              icon={<PlaceOutlinedIcon sx={{ fontSize: "12px !important", color: "#0284c7" }} />}
              label={[topic.country, topic.city].filter(Boolean).join(", ")}
              size="small"
              sx={{
                bgcolor: "#e0f2fe",
                color: "#0369a1",
                fontFamily: fontBody,
                fontWeight: 600,
                fontSize: "0.65rem",
              }}
            />
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Chip
            icon={<ChatBubbleOutlineIcon sx={{ fontSize: "11px !important" }} />}
            label={`${topic.replies ?? 0}`}
            size="small"
            sx={{
              bgcolor: "#f8fafc",
              color: "#64748b",
              fontFamily: fontBody,
              fontWeight: 600,
              fontSize: "0.68rem",
            }}
          />
          <Chip
            icon={<VisibilityOutlinedIcon sx={{ fontSize: "11px !important" }} />}
            label={`${topic.views ?? 0}`}
            size="small"
            sx={{
              bgcolor: "#f8fafc",
              color: "#64748b",
              fontFamily: fontBody,
              fontWeight: 600,
              fontSize: "0.68rem",
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

// ── Main Forum Component ──────────────────────────────────
export default function Forum() {
  const { topics, categories, stats } = useLoaderData();
  const navigation = useNavigation();
  const { user } = useAuthContext();
  const isSubmitting = navigation.state === "submitting";

  const [createOpen, setCreateOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [sortBy, setSortBy] = useState("latest"); // 'latest', 'popular', 'replies'
  const [categoryViewMode, setCategoryViewMode] = useState("list"); // 'list' | 'grid'

  // Form states for new topic dialog
  const [modalCatId, setModalCatId] = useState("");
  const [modalSubCatId, setModalSubCatId] = useState("");
  const [modalCountry, setModalCountry] = useState("");
  const [modalCity, setModalCity] = useState("");

  // Category suggestion form state
  const [suggestTitle, setSuggestTitle] = useState("");
  const [suggestDesc, setSuggestDesc] = useState("");
  const [suggestReason, setSuggestReason] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);

  const selectedCategoryObj = useMemo(() => {
    return categories.find((c) => String(c.id) === String(selectedCategoryId));
  }, [categories, selectedCategoryId]);

  const modalCategoryObj = useMemo(() => {
    return categories.find((c) => String(c.id) === String(modalCatId));
  }, [categories, modalCatId]);

  const handleOpenCreate = () => {
    if (!user) {
      toast.warning("Увійдіть в акаунт, щоб створити тему");
      return;
    }
    setModalCatId(selectedCategoryId || (categories[0]?.id ? String(categories[0].id) : ""));
    setModalSubCatId("");
    setModalCountry(countryFilter || "");
    setModalCity("");
    setCreateOpen(true);
  };

  const handleOpenSuggest = () => {
    if (!user) {
      toast.warning("Увійдіть в акаунт, щоб запропонувати нову категорію");
      return;
    }
    setSuggestTitle("");
    setSuggestDesc("");
    setSuggestReason("");
    setSuggestOpen(true);
  };

  const handleSendSuggestion = async () => {
    if (!suggestTitle.trim()) {
      toast.error("Введіть назву категорії");
      return;
    }
    setIsSuggesting(true);
    try {
      await customFetch.post("/forum/category-suggestions", {
        title: suggestTitle.trim(),
        description: suggestDesc.trim(),
        reason: suggestReason.trim(),
      });
      toast.success("Вашу пропозицію надіслано на розгляд адміністратора!");
      setSuggestOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Помилка відправлення");
    } finally {
      setIsSuggesting(false);
    }
  };

  // Filter and sort topics locally
  const filteredTopics = useMemo(() => {
    let result = [...topics];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.content?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q)
      );
    }

    if (selectedCategoryId) {
      result = result.filter(
        (t) =>
          String(t.forumCategoryId) === String(selectedCategoryId) ||
          (selectedCategoryObj && t.category === selectedCategoryObj.title)
      );
    }

    if (selectedSubcategoryId) {
      result = result.filter(
        (t) => String(t.forumSubcategoryId) === String(selectedSubcategoryId)
      );
    }

    if (countryFilter) {
      result = result.filter(
        (t) => t.country?.toLowerCase() === countryFilter.toLowerCase()
      );
    }

    if (cityFilter.trim()) {
      const qCity = cityFilter.toLowerCase();
      result = result.filter((t) => t.city?.toLowerCase().includes(qCity));
    }

    // Sort: pinned topics always float to the top
    result.sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      if (sortBy === "popular") {
        return (b.views || 0) - (a.views || 0);
      }
      if (sortBy === "replies") {
        return (b.replies || 0) - (a.replies || 0);
      }
      // latest
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return result;
  }, [
    topics,
    searchQuery,
    selectedCategoryId,
    selectedSubcategoryId,
    countryFilter,
    cityFilter,
    sortBy,
    selectedCategoryObj,
  ]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategoryId("");
    setSelectedSubcategoryId("");
    setCountryFilter("");
    setCityFilter("");
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    Boolean(selectedCategoryId) ||
    Boolean(selectedSubcategoryId) ||
    Boolean(countryFilter) ||
    Boolean(cityFilter);

  // Stats display config
  const statsConfig = [
    {
      icon: <ForumOutlinedIcon sx={{ fontSize: 20, color: "#fff" }} />,
      value: stats?.topics != null ? stats.topics.toLocaleString() : null,
      label: "Теми",
    },
    {
      icon: <ChatBubbleOutlineIcon sx={{ fontSize: 20, color: "#fff" }} />,
      value: stats?.replies != null ? stats.replies.toLocaleString() : null,
      label: "Відповідей",
    },
    {
      icon: <PeopleOutlineIcon sx={{ fontSize: 20, color: "#fff" }} />,
      value: stats?.members != null ? stats.members.toLocaleString() : null,
      label: "Учасників",
    },
    {
      icon: <VisibilityOutlinedIcon sx={{ fontSize: 20, color: "#fff" }} />,
      value: stats?.views != null ? stats.views.toLocaleString() : null,
      label: "Переглядів",
    },
  ];

  return (
    <>
      <HeroSection
        title="Форум «Українці в Європі»"
        typedStrings={["Єдиний простір взаємодопомоги та досвіду", "30 тематичних розділів для всіх країн Європи"]}
        subtitle="Спілкуйтеся, ставте запитання, знаходьте житло, роботу та діліться корисними порадами"
        size="sm"
      />

      {/* ── Stats Strip ── */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0057B8 0%, #003d82 100%)",
          borderBottom: "1px solid rgba(255,255,255,.1)",
        }}
      >
        <Container maxWidth="lg">
          <Grid container>
            {statsConfig.map((s, i) => (
              <Grid
                key={s.label}
                size={{ xs: 6, sm: 3 }}
                sx={{
                  borderRight:
                    i < statsConfig.length - 1
                      ? { sm: "1px solid rgba(255,255,255,.1)" }
                      : "none",
                  borderBottom: {
                    xs: i < 2 ? "1px solid rgba(255,255,255,.1)" : "none",
                    sm: "none",
                  },
                }}
              >
                <StatCard icon={s.icon} value={s.value} label={s.label} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: "#f8fafc" }}>
        <Container maxWidth="lg">
          {/* ── Filter & Search Toolbar ── */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "20px",
              p: { xs: 2, md: 2.5 },
              mb: 4,
              boxShadow: "0 2px 12px rgba(0,87,184,.05)",
            }}
          >
            {/* Top row: Search, Country, City, Actions */}
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                alignItems: "center",
                flexWrap: "wrap",
                mb: 2,
              }}
            >
              <TextField
                placeholder="Пошук за темою чи змістом..."
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  flex: "1 1 200px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    fontFamily: fontBody,
                    bgcolor: "#f8fafc",
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

              {/* Geographic Country filter */}
              <FormControl size="small" sx={{ minWidth: 160, flex: "0 0 auto" }}>
                <InputLabel sx={{ fontFamily: fontBody }}>Країна</InputLabel>
                <Select
                  value={countryFilter}
                  label="Країна"
                  onChange={(e) => {
                    setCountryFilter(e.target.value);
                    setCityFilter("");
                  }}
                  sx={{ borderRadius: "12px", fontFamily: fontBody, bgcolor: "#f8fafc" }}
                >
                  <MenuItem value="">Всі країни Європи</MenuItem>
                  {EUROPE_COUNTRIES.map((c) => (
                    <MenuItem key={c} value={c} sx={{ fontFamily: fontBody }}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Dynamic City filter with fallback text input */}
              <Box sx={{ minWidth: 160, width: { xs: "100%", sm: 170 } }}>
                <CitySelectField
                  country={countryFilter}
                  value={cityFilter}
                  onChange={(c) => setCityFilter(c || "")}
                  name="cityFilter"
                  label="Місто"
                  placeholder="Місто..."
                  size="small"
                  isFilter
                />
              </Box>

              {/* Sort by */}
              <FormControl size="small" sx={{ minWidth: 160, flex: "0 0 auto" }}>
                <InputLabel sx={{ fontFamily: fontBody }}>Сортування</InputLabel>
                <Select
                  value={sortBy}
                  label="Сортування"
                  onChange={(e) => setSortBy(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <SortIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                    </InputAdornment>
                  }
                  sx={{ borderRadius: "12px", fontFamily: fontBody, bgcolor: "#f8fafc" }}
                >
                  <MenuItem value="latest" sx={{ fontFamily: fontBody }}>
                    Найновіші
                  </MenuItem>
                  <MenuItem value="popular" sx={{ fontFamily: fontBody }}>
                    Найпопулярніші
                  </MenuItem>
                  <MenuItem value="replies" sx={{ fontFamily: fontBody }}>
                    Найбільше відповідей
                  </MenuItem>
                </Select>
              </FormControl>

              {/* Action buttons */}
              <Box sx={{ display: "flex", gap: 1, ml: "auto", flexWrap: "wrap" }}>
                <Tooltip title="Запропонувати створити нову категорію адміністратору">
                  <Button
                    variant="outlined"
                    startIcon={<LightbulbOutlinedIcon />}
                    onClick={handleOpenSuggest}
                    sx={{
                      fontFamily: fontBody,
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: "12px",
                      borderColor: "#cbd5e1",
                      color: "#475569",
                      "&:hover": { borderColor: BLUE, color: BLUE },
                    }}
                  >
                    Запропонувати категорію
                  </Button>
                </Tooltip>

                <Button
                  variant="contained"
                  startIcon={user ? <AddIcon /> : <LockOutlinedIcon sx={{ fontSize: 16 }} />}
                  onClick={handleOpenCreate}
                  sx={{
                    fontFamily: fontBody,
                    fontWeight: 700,
                    textTransform: "none",
                    bgcolor: BLUE,
                    borderRadius: "12px",
                    px: 2.5,
                    boxShadow: "0 4px 12px rgba(0,87,184,.3)",
                    "&:hover": { bgcolor: "#003d82" },
                  }}
                >
                  Нова тема
                </Button>
              </Box>
            </Box>

            {/* Active filters bar */}
            {hasActiveFilters && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  pt: 1.5,
                  borderTop: "1px dashed #e2e8f0",
                  flexWrap: "wrap",
                }}
              >
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.8rem", color: "#64748b" }}>
                  Активні фільтри:
                </Typography>

                {selectedCategoryObj && (
                  <Chip
                    label={`Категорія: ${selectedCategoryObj.title}`}
                    size="small"
                    onDelete={() => {
                      setSelectedCategoryId("");
                      setSelectedSubcategoryId("");
                    }}
                    sx={{
                      fontFamily: fontBody,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      bgcolor: "rgba(0,87,184,.08)",
                      color: BLUE,
                    }}
                  />
                )}

                {selectedSubcategoryId && selectedCategoryObj?.subcategories && (
                  <Chip
                    label={`Підкатегорія: ${
                      selectedCategoryObj.subcategories.find(
                        (s) => String(s.id) === String(selectedSubcategoryId)
                      )?.title || selectedSubcategoryId
                    }`}
                    size="small"
                    onDelete={() => setSelectedSubcategoryId("")}
                    sx={{
                      fontFamily: fontBody,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      bgcolor: "#f1f5f9",
                      color: "#334155",
                    }}
                  />
                )}

                {countryFilter && (
                  <Chip
                    label={`Країна: ${countryFilter}`}
                    size="small"
                    onDelete={() => setCountryFilter("")}
                    sx={{
                      fontFamily: fontBody,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      bgcolor: "#e0f2fe",
                      color: "#0369a1",
                    }}
                  />
                )}

                {cityFilter && (
                  <Chip
                    label={`Місто: ${cityFilter}`}
                    size="small"
                    onDelete={() => setCityFilter("")}
                    sx={{
                      fontFamily: fontBody,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      bgcolor: "#f1f5f9",
                      color: "#334155",
                    }}
                  />
                )}

                {searchQuery && (
                  <Chip
                    label={`Пошук: "${searchQuery}"`}
                    size="small"
                    onDelete={() => setSearchQuery("")}
                    sx={{
                      fontFamily: fontBody,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      bgcolor: "#f1f5f9",
                      color: "#334155",
                    }}
                  />
                )}

                <Button
                  size="small"
                  onClick={clearAllFilters}
                  startIcon={<ClearIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    fontFamily: fontBody,
                    fontSize: "0.75rem",
                    textTransform: "none",
                    color: "#94a3b8",
                    ml: "auto",
                  }}
                >
                  Скинути всі фільтри
                </Button>
              </Box>
            )}
          </Paper>

          {/* ── Main Content Grid ── */}
          <Grid container spacing={3.5}>
            {/* ── LEFT: 30 Categories Directory ── */}
            <Grid size={{ xs: 12, md: 6.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2.5,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontFamily: fontBody,
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: BLUE,
                      mb: 0.3,
                    }}
                  >
                    30 розділів
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: fontDisplay,
                      fontWeight: 700,
                      fontSize: "1.45rem",
                      color: "#0f172a",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Категорії форуму
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Tooltip title="Відобразити списком">
                    <IconButton
                      size="small"
                      onClick={() => setCategoryViewMode("list")}
                      sx={{
                        color: categoryViewMode === "list" ? BLUE : "#94a3b8",
                        bgcolor:
                          categoryViewMode === "list"
                            ? "rgba(0,87,184,.08)"
                            : "transparent",
                      }}
                    >
                      <ViewListIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Відобразити картками">
                    <IconButton
                      size="small"
                      onClick={() => setCategoryViewMode("grid")}
                      sx={{
                        color: categoryViewMode === "grid" ? BLUE : "#94a3b8",
                        bgcolor:
                          categoryViewMode === "grid"
                            ? "rgba(0,87,184,.08)"
                            : "transparent",
                      }}
                    >
                      <GridViewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Subcategories pill strip if a category is selected */}
              {selectedCategoryObj &&
                selectedCategoryObj.subcategories &&
                selectedCategoryObj.subcategories.length > 0 && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 2.5,
                      borderRadius: "16px",
                      bgcolor: "rgba(0,87,184,.04)",
                      border: "1px solid rgba(0,87,184,.15)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: fontBody,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: BLUE,
                        mb: 1,
                      }}
                    >
                      Підкатегорії «{selectedCategoryObj.title}»:
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Chip
                        label="Всі теми розділу"
                        size="small"
                        clickable
                        onClick={() => setSelectedSubcategoryId("")}
                        sx={{
                          fontFamily: fontBody,
                          fontWeight: !selectedSubcategoryId ? 700 : 500,
                          bgcolor: !selectedSubcategoryId ? BLUE : "#fff",
                          color: !selectedSubcategoryId ? "#fff" : "#475569",
                          border: "1px solid #cbd5e1",
                        }}
                      />
                      {selectedCategoryObj.subcategories.map((sub) => {
                        const isSubSelected =
                          String(selectedSubcategoryId) === String(sub.id);
                        return (
                          <Chip
                            key={sub.id}
                            label={sub.title}
                            size="small"
                            clickable
                            onClick={() =>
                              setSelectedSubcategoryId(
                                isSubSelected ? "" : String(sub.id)
                              )
                            }
                            sx={{
                              fontFamily: fontBody,
                              fontWeight: isSubSelected ? 700 : 500,
                              bgcolor: isSubSelected ? BLUE : "#fff",
                              color: isSubSelected ? "#fff" : "#475569",
                              border: "1px solid #cbd5e1",
                            }}
                          />
                        );
                      })}
                    </Box>
                  </Paper>
                )}

              {categories.length === 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: "18px",
                    border: "1.5px dashed #e2e8f0",
                    p: 5,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: fontBody,
                      fontSize: "0.9rem",
                      color: "#94a3b8",
                    }}
                  >
                    Категорій ще немає
                  </Typography>
                </Paper>
              ) : categoryViewMode === "list" ? (
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: "18px",
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                    bgcolor: "#fff",
                    maxHeight: 740,
                    overflowY: "auto",
                  }}
                >
                  {categories.map((cat, idx) => (
                    <CategoryRow
                      key={cat.id}
                      cat={cat}
                      isSelected={String(selectedCategoryId) === String(cat.id)}
                      onClick={() => {
                        if (String(selectedCategoryId) === String(cat.id)) {
                          setSelectedCategoryId("");
                          setSelectedSubcategoryId("");
                        } else {
                          setSelectedCategoryId(String(cat.id));
                          setSelectedSubcategoryId("");
                        }
                      }}
                      isLast={idx === categories.length - 1}
                    />
                  ))}
                </Paper>
              ) : (
                <Grid
                  container
                  spacing={1.5}
                  sx={{ maxHeight: 740, overflowY: "auto", pr: 0.5 }}
                >
                  {categories.map((cat) => (
                    <Grid key={cat.id} size={{ xs: 12, sm: 6 }}>
                      <CategoryCard
                        cat={cat}
                        isSelected={
                          String(selectedCategoryId) === String(cat.id)
                        }
                        onClick={() => {
                          if (String(selectedCategoryId) === String(cat.id)) {
                            setSelectedCategoryId("");
                            setSelectedSubcategoryId("");
                          } else {
                            setSelectedCategoryId(String(cat.id));
                            setSelectedSubcategoryId("");
                          }
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}

              {user?.role === "admin" && (
                <Box sx={{ mt: 2, textAlign: "right" }}>
                  <Button
                    component={Link}
                    to="/dashboard/forum"
                    size="small"
                    startIcon={
                      <span className="material-icons" style={{ fontSize: 16 }}>
                        settings
                      </span>
                    }
                    sx={{
                      fontFamily: fontBody,
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: "0.82rem",
                      color: "#64748b",
                      "&:hover": { color: BLUE },
                    }}
                  >
                    Адміністрування категорій форуму
                  </Button>
                </Box>
              )}
            </Grid>

            {/* ── RIGHT: Topics List ── */}
            <Grid size={{ xs: 12, md: 5.5 }}>
              <Box sx={{ mb: 2.5 }}>
                <Typography
                  sx={{
                    fontFamily: fontBody,
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: BLUE,
                    mb: 0.3,
                  }}
                >
                  Обговорення
                </Typography>
                <Typography
                  sx={{
                    fontFamily: fontDisplay,
                    fontWeight: 700,
                    fontSize: "1.45rem",
                    color: "#0f172a",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {selectedCategoryObj
                    ? selectedCategoryObj.title
                    : "Останні теми та відповіді"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {filteredTopics.length === 0 ? (
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: "16px",
                      border: "1px dashed #cbd5e1",
                      p: 4.5,
                      textAlign: "center",
                      bgcolor: "#fff",
                    }}
                  >
                    <span
                      className="material-icons"
                      style={{ fontSize: 36, color: "#cbd5e1" }}
                    >
                      forum
                    </span>
                    <Typography
                      sx={{
                        fontFamily: fontBody,
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "#64748b",
                        mt: 1,
                        mb: 0.5,
                      }}
                    >
                      {hasActiveFilters
                        ? "Теми за вказаними фільтрами не знайдено"
                        : "Поки що немає тем. Будьте першим, хто почне обговорення!"}
                    </Typography>
                    {hasActiveFilters && (
                      <Button
                        size="small"
                        onClick={clearAllFilters}
                        sx={{
                          fontFamily: fontBody,
                          textTransform: "none",
                          color: BLUE,
                          mt: 1,
                        }}
                      >
                        Скинути фільтри
                      </Button>
                    )}
                  </Paper>
                ) : (
                  filteredTopics.map((topic, i) => (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      categories={categories}
                      index={i}
                    />
                  ))
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── Dialog: Нова тема ── */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
      >
        <Form method="post" onSubmit={() => setCreateOpen(false)}>
          <DialogTitle
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: "1.3rem",
              pb: 1,
            }}
          >
            Створити нову тему на форумі
          </DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
          >
            <TextField
              autoFocus
              name="title"
              label="Заголовок теми *"
              fullWidth
              required
              inputProps={{ minLength: 5, maxLength: 255 }}
              placeholder="Коротко сформулюйте ваше питання або тему"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontFamily: fontBody,
                  bgcolor: "#f8fafc",
                },
              }}
            />

            {/* Category Select */}
            <FormControl fullWidth required>
              <InputLabel sx={{ fontFamily: fontBody }}>Розділ форуму *</InputLabel>
              <Select
                name="forumCategoryId"
                label="Розділ форуму *"
                value={modalCatId}
                onChange={(e) => {
                  setModalCatId(e.target.value);
                  setModalSubCatId("");
                }}
                sx={{ borderRadius: "12px", fontFamily: fontBody, bgcolor: "#f8fafc" }}
              >
                {categories.map((cat) => (
                  <MenuItem
                    key={cat.id}
                    value={String(cat.id)}
                    sx={{ fontFamily: fontBody, gap: 1.5 }}
                  >
                    <span
                      className="material-icons"
                      style={{ fontSize: 18, color: cat.color || BLUE }}
                    >
                      {cat.icon || "forum"}
                    </span>
                    {cat.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Subcategory Select (if current modal category has subcategories) */}
            {modalCategoryObj?.subcategories &&
              modalCategoryObj.subcategories.length > 0 && (
                <FormControl fullWidth>
                  <InputLabel sx={{ fontFamily: fontBody }}>
                    Підкатегорія (опційно)
                  </InputLabel>
                  <Select
                    name="forumSubcategoryId"
                    label="Підкатегорія (опційно)"
                    value={modalSubCatId}
                    onChange={(e) => setModalSubCatId(e.target.value)}
                    sx={{
                      borderRadius: "12px",
                      fontFamily: fontBody,
                      bgcolor: "#f8fafc",
                    }}
                  >
                    <MenuItem value="">Без підкатегорії</MenuItem>
                    {modalCategoryObj.subcategories.map((sub) => (
                      <MenuItem
                        key={sub.id}
                        value={String(sub.id)}
                        sx={{ fontFamily: fontBody }}
                      >
                        {sub.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

            {/* Geographic fields: Country & Dynamic City with fallback text input */}
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <FormControl fullWidth>
                <InputLabel sx={{ fontFamily: fontBody }}>Країна (опційно)</InputLabel>
                <Select
                  name="country"
                  label="Країна (опційно)"
                  value={modalCountry}
                  onChange={(e) => {
                    setModalCountry(e.target.value);
                    setModalCity("");
                  }}
                  sx={{ borderRadius: "12px", fontFamily: fontBody, bgcolor: "#f8fafc" }}
                >
                  <MenuItem value="">Не вказано / Вся Європа</MenuItem>
                  {EUROPE_COUNTRIES.map((c) => (
                    <MenuItem key={c} value={c} sx={{ fontFamily: fontBody }}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <CitySelectField
                country={modalCountry}
                value={modalCity}
                onChange={(c) => setModalCity(c)}
                name="city"
                label="Місто / Регіон (опційно)"
                placeholder="напр. Варшава, Берлін або введіть..."
                fullWidth
              />
            </Box>

            <TextField
              name="content"
              label="Текст повідомлення *"
              fullWidth
              required
              multiline
              rows={5}
              inputProps={{ minLength: 10 }}
              placeholder="Детально опишіть ситуацію, додайте деталі чи запитання..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontFamily: fontBody,
                  bgcolor: "#f8fafc",
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
            <Button
              onClick={() => setCreateOpen(false)}
              sx={{
                fontFamily: fontBody,
                fontWeight: 600,
                textTransform: "none",
                color: "#64748b",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
              }}
            >
              Скасувати
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                fontFamily: fontBody,
                fontWeight: 700,
                textTransform: "none",
                bgcolor: BLUE,
                borderRadius: "10px",
                px: 3,
                "&:hover": { bgcolor: "#003d82" },
              }}
            >
              {isSubmitting ? "Публікація..." : "Опублікувати тему"}
            </Button>
          </DialogActions>
        </Form>
      </Dialog>

      {/* ── Dialog: Запропонувати нову категорію ── */}
      <Dialog
        open={suggestOpen}
        onClose={() => setSuggestOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
      >
        <DialogTitle
          sx={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: "1.25rem",
            pb: 1,
          }}
        >
          Запропонувати нову категорію форуму
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
        >
          <Typography
            sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: "#64748b" }}
          >
            Ваша пропозиція надійде адміністратору на модерацію. Якщо вона буде
            схвалена, нова категорія з'явиться на форумі.
          </Typography>

          <TextField
            label="Назва запропонованої категорії *"
            fullWidth
            required
            value={suggestTitle}
            onChange={(e) => setSuggestTitle(e.target.value)}
            placeholder="напр. Волонтерські ініціативи"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                fontFamily: fontBody,
                bgcolor: "#f8fafc",
              },
            }}
          />

          <TextField
            label="Короткий опис"
            fullWidth
            multiline
            rows={2}
            value={suggestDesc}
            onChange={(e) => setSuggestDesc(e.target.value)}
            placeholder="Про що буде ця категорія..."
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                fontFamily: fontBody,
                bgcolor: "#f8fafc",
              },
            }}
          />

          <TextField
            label="Чому ця категорія важлива для спільноти?"
            fullWidth
            multiline
            rows={3}
            value={suggestReason}
            onChange={(e) => setSuggestReason(e.target.value)}
            placeholder="Обґрунтування для адміністратора..."
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                fontFamily: fontBody,
                bgcolor: "#f8fafc",
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setSuggestOpen(false)}
            sx={{
              fontFamily: fontBody,
              fontWeight: 600,
              textTransform: "none",
              color: "#64748b",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
            }}
          >
            Скасувати
          </Button>
          <Button
            onClick={handleSendSuggestion}
            variant="contained"
            disabled={isSuggesting}
            sx={{
              fontFamily: fontBody,
              fontWeight: 700,
              textTransform: "none",
              bgcolor: BLUE,
              borderRadius: "10px",
              px: 3,
              "&:hover": { bgcolor: "#003d82" },
            }}
          >
            {isSuggesting ? "Надсилання..." : "Надіслати пропозицію"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
