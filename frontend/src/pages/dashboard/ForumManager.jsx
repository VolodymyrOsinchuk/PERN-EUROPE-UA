import { useState, useEffect } from "react";
import { useLoaderData, useRevalidator } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  IconButton,
  Tooltip,
  Chip,
  Grid,
  Divider,
  Alert,
  Snackbar,
  InputAdornment,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { PageHeader } from "../../components";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

// ── Design tokens ──────────────────────────────────────────
const F_BODY = "'Plus Jakarta Sans', sans-serif";
const F_DISPLAY = "'Playfair Display', serif";
const BLUE = "#0057B8";
const GOLD = "#FFD700";

// ── Available Material Icons for categories ────────────────
const ICON_OPTIONS = [
  { value: "forum", label: "Форум" },
  { value: "home", label: "Житло" },
  { value: "work", label: "Робота" },
  { value: "assignment", label: "Формальності" },
  { value: "badge", label: "Імміграція" },
  { value: "account_balance", label: "Фінанси" },
  { value: "receipt_long", label: "Податки" },
  { value: "local_hospital", label: "Здоров'я" },
  { value: "school", label: "Освіта" },
  { value: "translate", label: "Мови" },
  { value: "child_care", label: "Діти" },
  { value: "diversity_1", label: "Сім'я" },
  { value: "directions_car", label: "Авто" },
  { value: "shopping_bag", label: "Покупки" },
  { value: "gavel", label: "Право" },
  { value: "volunteer_activism", label: "Допомога" },
  { value: "health_and_safety", label: "Страхування" },
  { value: "restaurant", label: "Харчування" },
  { value: "flight_takeoff", label: "Подорожі" },
  { value: "local_shipping", label: "Посилки" },
  { value: "pets", label: "Тварини" },
  { value: "storefront", label: "Бізнес" },
  { value: "laptop_mac", label: "Фриланс" },
  { value: "psychology", label: "Психологія" },
  { value: "public", label: "Міста" },
  { value: "celebration", label: "Події" },
  { value: "auto_stories", label: "Культура" },
  { value: "chat", label: "Спілкування" },
  { value: "help_outline", label: "Запитання" },
  { value: "campaign", label: "Оголошення" },
  { value: "newspaper", label: "Новини" },
];

// ── Preset color pairs ─────────────────────────────────────
const COLOR_PRESETS = [
  { color: "#0057B8", bgColor: "#eff6ff", label: "Синій" },
  { color: "#0284c7", bgColor: "#e0f2fe", label: "Блакитний" },
  { color: "#2563eb", bgColor: "#eff6ff", label: "Кобальт" },
  { color: "#4f46e5", bgColor: "#eef2ff", label: "Індиго" },
  { color: "#7c3aed", bgColor: "#f5f3ff", label: "Фіолетовий" },
  { color: "#059669", bgColor: "#ecfdf5", label: "Смарагдовий" },
  { color: "#0d9488", bgColor: "#f0fdfa", label: "Бірюзовий" },
  { color: "#e11d48", bgColor: "#ffe4e6", label: "Червоний" },
  { color: "#d97706", bgColor: "#fef3c7", label: "Бурштиновий" },
  { color: "#ca8a04", bgColor: "#fef9c3", label: "Золотистий" },
  { color: "#475569", bgColor: "#f1f5f9", label: "Сталевий" },
];

// ── Loader ─────────────────────────────────────────────────
export async function loader() {
  try {
    const [catsRes, statsRes, suggestionsRes, reportsRes] =
      await Promise.allSettled([
        customFetch.get("/forum/categories/admin"),
        customFetch.get("/forum/stats"),
        customFetch.get("/forum/category-suggestions"),
        customFetch.get("/forum/reports"),
      ]);
    return {
      categories: catsRes.status === "fulfilled" ? catsRes.value.data : [],
      stats: statsRes.status === "fulfilled" ? statsRes.value.data : null,
      suggestions:
        suggestionsRes.status === "fulfilled" ? suggestionsRes.value.data : [],
      reports: reportsRes.status === "fulfilled" ? reportsRes.value.data : [],
    };
  } catch (error) {
    toast.error("Помилка завантаження даних");
    return { categories: [], stats: null, suggestions: [], reports: [] };
  }
}

const emptyForm = {
  title: "",
  description: "",
  icon: "forum",
  color: "#0057B8",
  bgColor: "#eff6ff",
  sortOrder: 0,
  parentId: "",
};

function StatPill({ icon, label, value, color = BLUE, bg = "#eff6ff" }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: "16px",
        border: "1.5px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        gap: 2,
        boxShadow: "0 1px 4px rgba(0,0,0,.04)",
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "12px",
          bgcolor: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Box sx={{ color, display: "flex" }}>{icon}</Box>
      </Box>
      <Box>
        <Typography
          sx={{
            fontFamily: F_BODY,
            fontWeight: 800,
            fontSize: "1.45rem",
            color: "#0f172a",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {value ?? "—"}
        </Typography>
        <Typography
          sx={{
            fontFamily: F_BODY,
            fontSize: "0.75rem",
            color: "#64748b",
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>
      </Box>
    </Paper>
  );
}

function CategoryCard({
  cat,
  onEdit,
  onDelete,
  onToggle,
  onAddSubcategory,
  index,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: `1.5px solid ${cat.isActive ? "#e2e8f0" : "#f1f5f9"}`,
        overflow: "hidden",
        opacity: cat.isActive ? 1 : 0.65,
        transition: "all 0.2s ease",
        boxShadow: "0 1px 4px rgba(0,0,0,.04)",
        animation: "fadeUp 0.3s ease both",
        animationDelay: `${index * 0.03}s`,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        "&:hover": { boxShadow: "0 4px 20px rgba(0,87,184,.1)" },
      }}
    >
      <Box
        sx={{
          height: 4,
          bgcolor: cat.color || BLUE,
          opacity: cat.isActive ? 1 : 0.4,
        }}
      />

      <Box sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Header row */}
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "12px",
              bgcolor: cat.bgColor || "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              className="material-icons"
              style={{ fontSize: 22, color: cat.color || BLUE }}
            >
              {cat.icon || "forum"}
            </span>
          </Box>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                sx={{
                  fontFamily: F_BODY,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "#0f172a",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {cat.title}
              </Typography>
              <Chip
                label={`#${cat.sortOrder}`}
                size="small"
                sx={{
                  height: 18,
                  fontSize: "0.65rem",
                  fontFamily: F_BODY,
                  fontWeight: 700,
                  bgcolor: "#f1f5f9",
                }}
              />
            </Box>
            <Typography
              sx={{
                fontFamily: F_BODY,
                fontSize: "0.75rem",
                color: "#64748b",
                mt: 0.3,
              }}
            >
              {cat.topicsCount || 0} тем · {cat.subcategories?.length || 0} підкатегорій
            </Typography>
          </Box>
        </Box>

        {cat.description && (
          <Typography
            sx={{
              fontFamily: F_BODY,
              fontSize: "0.78rem",
              color: "#64748b",
              lineHeight: 1.4,
              mb: 2,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {cat.description}
          </Typography>
        )}

        {/* Subcategories chips */}
        {cat.subcategories && cat.subcategories.length > 0 && (
          <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mb: 2, mt: "auto" }}>
            {cat.subcategories.slice(0, 4).map((sub) => (
              <Chip
                key={sub.id}
                label={sub.title}
                size="small"
                sx={{
                  fontSize: "0.68rem",
                  fontFamily: F_BODY,
                  bgcolor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              />
            ))}
            {cat.subcategories.length > 4 && (
              <Chip
                label={`+ ще ${cat.subcategories.length - 4}`}
                size="small"
                sx={{
                  fontSize: "0.68rem",
                  fontFamily: F_BODY,
                  bgcolor: "#f1f5f9",
                  color: "#475569",
                }}
              />
            )}
          </Box>
        )}

        <Divider sx={{ my: 1.5, borderColor: "#f1f5f9" }} />

        {/* Card actions */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Switch
              size="small"
              checked={Boolean(cat.isActive)}
              onChange={() => onToggle(cat)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: BLUE },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  bgcolor: BLUE,
                },
              }}
            />
            <Typography
              sx={{
                fontFamily: F_BODY,
                fontSize: "0.72rem",
                color: cat.isActive ? "#16a34a" : "#94a3b8",
                fontWeight: 600,
              }}
            >
              {cat.isActive ? "Активна" : "Прихована"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Tooltip title="Додати підкатегорію">
              <IconButton
                size="small"
                onClick={() => onAddSubcategory(cat)}
                sx={{ color: "#64748b", "&:hover": { color: BLUE } }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Редагувати">
              <IconButton
                size="small"
                onClick={() => onEdit(cat)}
                sx={{ color: "#64748b", "&:hover": { color: BLUE } }}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Видалити">
              <IconButton
                size="small"
                onClick={() => onDelete(cat)}
                sx={{ color: "#64748b", "&:hover": { color: "#e11d48" } }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export default function ForumManager() {
  const {
    categories: initialCategories,
    stats,
    suggestions: initialSuggestions,
    reports: initialReports,
  } = useLoaderData();
  const revalidator = useRevalidator();

  const [tabIndex, setTabIndex] = useState(0); // 0: Categories, 1: Suggestions, 2: Reports
  const [categories, setCategories] = useState(initialCategories || []);
  const [suggestions, setSuggestions] = useState(initialSuggestions || []);
  const [reports, setReports] = useState(initialReports || []);

  // Category Edit/Create state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Safe Delete & Topic Migration state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [targetMigrationCatId, setTargetMigrationCatId] = useState("");
  const [requiresMigration, setRequiresMigration] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnack = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenCreate = () => {
    setIsEdit(false);
    setSelectedCat(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleAddSubcategory = (parentCat) => {
    setIsEdit(false);
    setSelectedCat(null);
    setForm({
      ...emptyForm,
      color: parentCat.color || BLUE,
      bgColor: parentCat.bgColor || "#eff6ff",
      icon: parentCat.icon || "forum",
      parentId: String(parentCat.id),
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setIsEdit(true);
    setSelectedCat(cat);
    setForm({
      title: cat.title,
      description: cat.description || "",
      icon: cat.icon || "forum",
      color: cat.color || BLUE,
      bgColor: cat.bgColor || "#eff6ff",
      sortOrder: cat.sortOrder || 0,
      parentId: cat.parentId ? String(cat.parentId) : "",
    });
    setDialogOpen(true);
  };

  const handleOpenDelete = (cat) => {
    setSelectedCat(cat);
    setTargetMigrationCatId("");
    setRequiresMigration(Boolean(cat.topicsCount > 0));
    setDeleteOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      showSnack("Введіть назву категорії", "error");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        parentId: form.parentId ? Number(form.parentId) : null,
      };

      if (isEdit && selectedCat) {
        const { data } = await customFetch.put(
          `/forum/categories/${selectedCat.id}`,
          payload
        );
        setCategories((prev) =>
          prev.map((c) => (c.id === selectedCat.id ? { ...c, ...data } : c))
        );
        showSnack("Категорію оновлено!");
      } else {
        const { data } = await customFetch.post("/forum/categories", payload);
        showSnack("Категорію створено!");
      }
      setDialogOpen(false);
      revalidator.revalidate();
    } catch (error) {
      showSnack(
        error?.response?.data?.message || "Помилка збереження",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCat) return;
    try {
      const url = targetMigrationCatId
        ? `/forum/categories/${selectedCat.id}?targetCategoryId=${targetMigrationCatId}`
        : `/forum/categories/${selectedCat.id}`;

      await customFetch.delete(url, {
        data: targetMigrationCatId
          ? { targetCategoryId: Number(targetMigrationCatId) }
          : undefined,
      });

      setCategories((prev) => prev.filter((c) => c.id !== selectedCat.id));
      showSnack("Категорію безпечно видалено!");
      setDeleteOpen(false);
      revalidator.revalidate();
    } catch (error) {
      if (error?.response?.data?.requiresMigration) {
        setRequiresMigration(true);
        showSnack(error.response.data.message, "warning");
        return;
      }
      showSnack(error?.response?.data?.message || "Помилка видалення", "error");
    }
  };

  const handleToggle = async (cat) => {
    try {
      const { data } = await customFetch.patch(
        `/forum/categories/${cat.id}/toggle`
      );
      setCategories((prev) =>
        prev.map((c) =>
          c.id === cat.id ? { ...c, isActive: data.isActive } : c
        )
      );
      showSnack(
        data.isActive ? "Категорію показано на форумі" : "Категорію приховано"
      );
    } catch (error) {
      showSnack("Помилка зміни статусу", "error");
    }
  };

  // Suggestion actions
  const handleApproveSuggestion = async (suggestion, createNow = true) => {
    try {
      await customFetch.patch(`/forum/category-suggestions/${suggestion.id}`, {
        status: "approved",
        createCategoryNow: createNow,
      });
      setSuggestions((prev) =>
        prev.map((s) =>
          s.id === suggestion.id ? { ...s, status: "approved" } : s
        )
      );
      showSnack(
        createNow
          ? "Пропозицію схвалено та категорію створено!"
          : "Пропозицію схвалено!"
      );
      revalidator.revalidate();
    } catch (err) {
      showSnack(err?.response?.data?.message || "Помилка", "error");
    }
  };

  const handleRejectSuggestion = async (suggestion) => {
    try {
      await customFetch.patch(`/forum/category-suggestions/${suggestion.id}`, {
        status: "rejected",
      });
      setSuggestions((prev) =>
        prev.map((s) =>
          s.id === suggestion.id ? { ...s, status: "rejected" } : s
        )
      );
      showSnack("Пропозицію відхилено");
    } catch (err) {
      showSnack(err?.response?.data?.message || "Помилка", "error");
    }
  };

  // Report resolution actions
  const handleUpdateReport = async (reportId, status) => {
    try {
      await customFetch.patch(`/forum/reports/${reportId}`, { status });
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status } : r))
      );
      showSnack(status === "resolved" ? "Скаргу вирішено!" : "Скаргу відхилено");
    } catch (err) {
      showSnack(err?.response?.data?.message || "Помилка", "error");
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      fontFamily: F_BODY,
      bgcolor: "#f8fafc",
    },
    "& .MuiInputLabel-root": { fontFamily: F_BODY },
  };

  const activeCount = categories.filter((c) => c.isActive).length;
  const hiddenCount = categories.filter((c) => !c.isActive).length;

  return (
    <Box>
      <PageHeader
        title="Керування форумом"
        subtitle="30 категорій, підкатегорії, пропозиції користувачів та модерація скарг"
        breadcrumbs={[
          { label: "Панель", to: "/dashboard" },
          { label: "Форум" },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{
              fontFamily: F_BODY,
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "10px",
              bgcolor: BLUE,
              boxShadow: "0 4px 12px rgba(0,87,184,.3)",
              "&:hover": { bgcolor: "#003d82" },
            }}
          >
            Нова категорія
          </Button>
        }
      />

      {/* ── Stats Strip ── */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatPill
            icon={<ForumOutlinedIcon sx={{ fontSize: 20 }} />}
            label="Тем"
            value={stats?.topics?.toLocaleString()}
            color={BLUE}
            bg="#eff6ff"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatPill
            icon={<ChatBubbleOutlineIcon sx={{ fontSize: 20 }} />}
            label="Відповідей"
            value={stats?.replies?.toLocaleString()}
            color="#10b981"
            bg="#ecfdf5"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatPill
            icon={<PeopleOutlineIcon sx={{ fontSize: 20 }} />}
            label="Учасників"
            value={stats?.members?.toLocaleString()}
            color="#f59e0b"
            bg="#fef3c7"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatPill
            icon={<CategoryOutlinedIcon sx={{ fontSize: 20 }} />}
            label="Розділів форуму"
            value={categories.length}
            color="#8b5cf6"
            bg="#f5f3ff"
          />
        </Grid>
      </Grid>

      {/* ── Tabs Navigation ── */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          p: 1,
          mb: 3.5,
          bgcolor: "#fff",
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={(e, v) => setTabIndex(v)}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": {
              fontFamily: F_BODY,
              fontWeight: 700,
              textTransform: "none",
              fontSize: "0.9rem",
              minHeight: 46,
              borderRadius: "10px",
            },
          }}
        >
          <Tab
            label={`Категорії форуму (${categories.length})`}
            icon={<CategoryOutlinedIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
          />
          <Tab
            label={`Пропозиції користувачів (${
              suggestions.filter((s) => s.status === "pending").length
            } нових)`}
            icon={<LightbulbOutlinedIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
          />
          <Tab
            label={`Скарги та модерація (${
              reports.filter((r) => r.status === "pending").length
            })`}
            icon={<FlagOutlinedIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* ── TAB 0: Categories & Subcategories ── */}
      {tabIndex === 0 && (
        <>
          <Paper
            elevation={0}
            sx={{
              borderRadius: "16px",
              border: "1.5px solid #e2e8f0",
              p: 2.5,
              mb: 3.5,
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}>
              <CategoryOutlinedIcon sx={{ fontSize: 18, color: "#64748b" }} />
              <Typography
                sx={{
                  fontFamily: F_BODY,
                  fontSize: "0.875rem",
                  color: "#334155",
                  fontWeight: 600,
                }}
              >
                {categories.length} категорій
              </Typography>
              <Chip
                label={`${activeCount} активних`}
                size="small"
                sx={{
                  fontFamily: F_BODY,
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  bgcolor: "#ecfdf5",
                  color: "#065f46",
                }}
              />
              {hiddenCount > 0 && (
                <Chip
                  label={`${hiddenCount} прихованих`}
                  size="small"
                  sx={{
                    fontFamily: F_BODY,
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    bgcolor: "#f1f5f9",
                    color: "#64748b",
                  }}
                />
              )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <InfoOutlinedIcon sx={{ fontSize: 15, color: "#94a3b8" }} />
              <Typography
                sx={{ fontFamily: F_BODY, fontSize: "0.75rem", color: "#94a3b8" }}
              >
                Видалення категорій з темами захищене перевіркою
              </Typography>
            </Box>
          </Paper>

          <Grid container spacing={2.5}>
            {categories.map((cat, i) => (
              <Grid key={cat.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <CategoryCard
                  cat={cat}
                  index={i}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                  onToggle={handleToggle}
                  onAddSubcategory={handleAddSubcategory}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* ── TAB 1: User Suggestions ── */}
      {tabIndex === 1 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {suggestions.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 6,
                textAlign: "center",
                borderRadius: "16px",
                border: "1px dashed #cbd5e1",
              }}
            >
              <LightbulbOutlinedIcon sx={{ fontSize: 36, color: "#cbd5e1", mb: 1 }} />
              <Typography sx={{ fontFamily: F_BODY, color: "#94a3b8" }}>
                Пропозицій щодо нових категорій поки немає
              </Typography>
            </Paper>
          ) : (
            suggestions.map((s) => (
              <Card
                key={s.id}
                sx={{
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 4px rgba(0,0,0,.04)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1.5,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: F_BODY,
                          fontWeight: 700,
                          fontSize: "1.05rem",
                          color: "#0f172a",
                        }}
                      >
                        {s.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: F_BODY,
                          fontSize: "0.75rem",
                          color: "#94a3b8",
                        }}
                      >
                        Запропонував:{" "}
                        {s.user
                          ? `${s.user.firstName} ${s.user.lastName} (${s.user.email})`
                          : "Користувач"}{" "}
                        · {new Date(s.createdAt).toLocaleDateString("uk-UA")}
                      </Typography>
                    </Box>

                    <Chip
                      label={
                        s.status === "approved"
                          ? "Схвалено"
                          : s.status === "rejected"
                          ? "Відхилено"
                          : "Очікує розгляду"
                      }
                      size="small"
                      sx={{
                        fontFamily: F_BODY,
                        fontWeight: 700,
                        fontSize: "0.72rem",
                        bgcolor:
                          s.status === "approved"
                            ? "#ecfdf5"
                            : s.status === "rejected"
                            ? "#fff1f2"
                            : "#fef3c7",
                        color:
                          s.status === "approved"
                            ? "#065f46"
                            : s.status === "rejected"
                            ? "#9f1239"
                            : "#92400e",
                      }}
                    />
                  </Box>

                  {s.description && (
                    <Typography
                      sx={{
                        fontFamily: F_BODY,
                        fontSize: "0.85rem",
                        color: "#334155",
                        mb: 1,
                      }}
                    >
                      <strong>Опис:</strong> {s.description}
                    </Typography>
                  )}

                  {s.reason && (
                    <Typography
                      sx={{
                        fontFamily: F_BODY,
                        fontSize: "0.85rem",
                        color: "#64748b",
                        mb: 2,
                      }}
                    >
                      <strong>Обґрунтування:</strong> {s.reason}
                    </Typography>
                  )}

                  {s.status === "pending" && (
                    <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<CheckCircleOutlineIcon />}
                        onClick={() => handleApproveSuggestion(s, true)}
                        sx={{
                          fontFamily: F_BODY,
                          fontWeight: 700,
                          textTransform: "none",
                          borderRadius: "8px",
                          bgcolor: "#16a34a",
                          "&:hover": { bgcolor: "#15803d" },
                        }}
                      >
                        Схвалити та створити категорію
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<HighlightOffIcon />}
                        onClick={() => handleRejectSuggestion(s)}
                        sx={{
                          fontFamily: F_BODY,
                          fontWeight: 600,
                          textTransform: "none",
                          borderRadius: "8px",
                        }}
                      >
                        Відхилити
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      )}

      {/* ── TAB 2: Reports & Moderation ── */}
      {tabIndex === 2 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {reports.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 6,
                textAlign: "center",
                borderRadius: "16px",
                border: "1px dashed #cbd5e1",
              }}
            >
              <FlagOutlinedIcon sx={{ fontSize: 36, color: "#cbd5e1", mb: 1 }} />
              <Typography sx={{ fontFamily: F_BODY, color: "#94a3b8" }}>
                Скарг на контент форуму немає
              </Typography>
            </Paper>
          ) : (
            reports.map((r) => (
              <Card
                key={r.id}
                sx={{
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 4px rgba(0,0,0,.04)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1.5,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: F_BODY,
                          fontWeight: 700,
                          fontSize: "1rem",
                          color: "#e11d48",
                        }}
                      >
                        Причина: {r.reason}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: F_BODY,
                          fontSize: "0.75rem",
                          color: "#94a3b8",
                        }}
                      >
                        Подав:{" "}
                        {r.user
                          ? `${r.user.firstName} ${r.user.lastName}`
                          : "Користувач"}{" "}
                        · {new Date(r.createdAt).toLocaleDateString("uk-UA")}
                      </Typography>
                    </Box>

                    <Chip
                      label={
                        r.status === "resolved"
                          ? "Вирішено"
                          : r.status === "dismissed"
                          ? "Відхилено"
                          : "Очікує розгляду"
                      }
                      size="small"
                      sx={{
                        fontFamily: F_BODY,
                        fontWeight: 700,
                        fontSize: "0.72rem",
                        bgcolor:
                          r.status === "resolved"
                            ? "#ecfdf5"
                            : r.status === "dismissed"
                            ? "#f1f5f9"
                            : "#fef3c7",
                        color:
                          r.status === "resolved"
                            ? "#065f46"
                            : r.status === "dismissed"
                            ? "#64748b"
                            : "#92400e",
                      }}
                    />
                  </Box>

                  {r.topic && (
                    <Typography
                      sx={{
                        fontFamily: F_BODY,
                        fontSize: "0.85rem",
                        color: "#0f172a",
                        mb: 1,
                      }}
                    >
                      <strong>Тема:</strong> {r.topic.title} (автор:{" "}
                      {r.topic.author})
                    </Typography>
                  )}

                  {r.reply && (
                    <Typography
                      sx={{
                        fontFamily: F_BODY,
                        fontSize: "0.85rem",
                        color: "#0f172a",
                        mb: 1,
                      }}
                    >
                      <strong>Повідомлення:</strong> "{r.reply.content}"
                    </Typography>
                  )}

                  {r.details && (
                    <Typography
                      sx={{
                        fontFamily: F_BODY,
                        fontSize: "0.82rem",
                        color: "#64748b",
                        mb: 2,
                      }}
                    >
                      <strong>Деталі від користувача:</strong> {r.details}
                    </Typography>
                  )}

                  {r.status === "pending" && (
                    <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleUpdateReport(r.id, "resolved")}
                        sx={{
                          fontFamily: F_BODY,
                          fontWeight: 700,
                          textTransform: "none",
                          borderRadius: "8px",
                          bgcolor: "#16a34a",
                          "&:hover": { bgcolor: "#15803d" },
                        }}
                      >
                        Позначити як вирішене
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleUpdateReport(r.id, "dismissed")}
                        sx={{
                          fontFamily: F_BODY,
                          fontWeight: 600,
                          textTransform: "none",
                          borderRadius: "8px",
                          color: "#64748b",
                          borderColor: "#cbd5e1",
                        }}
                      >
                        Відхилити скаргу
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      )}

      {/* ══ Create / Edit Category Dialog ══════════════════════════ */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
      >
        <DialogTitle
          sx={{
            fontFamily: F_DISPLAY,
            fontWeight: 700,
            fontSize: "1.3rem",
            pb: 1,
          }}
        >
          {isEdit ? "Редагувати категорію" : "Нова категорія форуму"}
        </DialogTitle>

        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}
        >
          <TextField
            label="Назва категорії *"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            fullWidth
            inputProps={{ maxLength: 150 }}
            sx={inputSx}
          />

          <TextField
            label="Опис (необов'язково)"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            fullWidth
            multiline
            rows={2}
            inputProps={{ maxLength: 300 }}
            helperText={`${form.description.length}/300`}
            sx={inputSx}
          />

          {/* Parent category selector (for creating subcategories) */}
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontFamily: F_BODY }}>
              Батьківська категорія (опційно для підкатегорій)
            </InputLabel>
            <Select
              value={form.parentId}
              label="Батьківська категорія (опційно для підкатегорій)"
              onChange={(e) =>
                setForm((f) => ({ ...f, parentId: e.target.value }))
              }
              sx={{ borderRadius: "12px", fontFamily: F_BODY }}
            >
              <MenuItem value="">
                — Основна категорія (без батьківської) —
              </MenuItem>
              {categories
                .filter((c) => !selectedCat || c.id !== selectedCat.id)
                .map((c) => (
                  <MenuItem key={c.id} value={String(c.id)}>
                    {c.title}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          {/* Icon picker */}
          <Box>
            <Typography
              sx={{
                fontFamily: F_BODY,
                fontWeight: 600,
                fontSize: "0.82rem",
                color: "#334155",
                mb: 1.5,
              }}
            >
              Іконка категорії
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, maxHeight: 130, overflowY: "auto" }}>
              {ICON_OPTIONS.map((opt) => (
                <Tooltip key={opt.value} title={opt.label}>
                  <Box
                    onClick={() => setForm((f) => ({ ...f, icon: opt.value }))}
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      border: `2px solid ${
                        form.icon === opt.value ? BLUE : "#e2e8f0"
                      }`,
                      bgcolor:
                        form.icon === opt.value
                          ? "rgba(0,87,184,.08)"
                          : "#f8fafc",
                    }}
                  >
                    <span
                      className="material-icons"
                      style={{
                        fontSize: 20,
                        color: form.icon === opt.value ? BLUE : "#64748b",
                      }}
                    >
                      {opt.value}
                    </span>
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </Box>

          {/* Color presets */}
          <Box>
            <Typography
              sx={{
                fontFamily: F_BODY,
                fontWeight: 600,
                fontSize: "0.82rem",
                color: "#334155",
                mb: 1,
              }}
            >
              Колір теми
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {COLOR_PRESETS.map((preset) => {
                const isActive =
                  form.color === preset.color &&
                  form.bgColor === preset.bgColor;
                return (
                  <Tooltip key={preset.label} title={preset.label}>
                    <Box
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          color: preset.color,
                          bgColor: preset.bgColor,
                        }))
                      }
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: "8px",
                        bgcolor: preset.bgColor,
                        border: `2px solid ${
                          isActive ? preset.color : "#e2e8f0"
                        }`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          bgcolor: preset.color,
                        }}
                      />
                    </Box>
                  </Tooltip>
                );
              })}
            </Box>
          </Box>

          <TextField
            label="Порядковий номер відображення"
            type="number"
            value={form.sortOrder}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                sortOrder: parseInt(e.target.value) || 0,
              }))
            }
            fullWidth
            size="small"
            sx={inputSx}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{
              fontFamily: F_BODY,
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
            onClick={handleSave}
            variant="contained"
            disabled={saving || !form.title.trim()}
            sx={{
              fontFamily: F_BODY,
              fontWeight: 700,
              textTransform: "none",
              bgcolor: BLUE,
              borderRadius: "10px",
              px: 3,
              "&:hover": { bgcolor: "#003d82" },
            }}
          >
            {saving ? "Збереження..." : isEdit ? "Зберегти" : "Створити"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ══ Delete Confirmation & Topic Migration Dialog ═════════ */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
      >
        <DialogTitle
          sx={{
            fontFamily: F_DISPLAY,
            fontWeight: 700,
            fontSize: "1.2rem",
            pb: 1,
          }}
        >
          Видалити категорію "{selectedCat?.title}"?
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {selectedCat?.topicsCount > 0 ? (
            <Alert
              severity="warning"
              sx={{
                borderRadius: "12px",
                fontFamily: F_BODY,
                fontSize: "0.85rem",
              }}
            >
              Ця категорія містить <strong>{selectedCat.topicsCount} тем</strong>.
              Згідно з правилами платформи, не можна видаляти категорію без
              визначення долі наявних тем.
            </Alert>
          ) : (
            <Typography
              sx={{ fontFamily: F_BODY, fontSize: "0.875rem", color: "#64748b" }}
            >
              Категорія не містить тем і буде безпечно видалена.
            </Typography>
          )}

          {requiresMigration && (
            <FormControl fullWidth size="small" required>
              <InputLabel sx={{ fontFamily: F_BODY }}>
                Оберіть категорію для перенесення тем *
              </InputLabel>
              <Select
                value={targetMigrationCatId}
                label="Оберіть категорію для перенесення тем *"
                onChange={(e) => setTargetMigrationCatId(e.target.value)}
                sx={{ borderRadius: "10px", fontFamily: F_BODY }}
              >
                {categories
                  .filter((c) => c.id !== selectedCat?.id)
                  .map((c) => (
                    <MenuItem key={c.id} value={String(c.id)}>
                      {c.title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setDeleteOpen(false)}
            sx={{
              fontFamily: F_BODY,
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
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={requiresMigration && !targetMigrationCatId}
            sx={{
              fontFamily: F_BODY,
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "10px",
              px: 3,
            }}
          >
            {requiresMigration
              ? "Перенести теми та видалити"
              : "Видалити категорію"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Snackbar ── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ borderRadius: "12px", fontFamily: F_BODY, fontWeight: 600 }}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
