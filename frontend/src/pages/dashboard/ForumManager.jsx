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
  FormControlLabel,
  Collapse,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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
  { value: "forum", label: "Forum" },
  { value: "work", label: "Travail" },
  { value: "home", label: "Logement" },
  { value: "school", label: "Éducation" },
  { value: "local_hospital", label: "Santé" },
  { value: "groups", label: "Communauté" },
  { value: "description", label: "Documents" },
  { value: "travel_explore", label: "Voyage" },
  { value: "attach_money", label: "Finance" },
  { value: "language", label: "Langue" },
  { value: "child_care", label: "Enfants" },
  { value: "pets", label: "Animaux" },
  { value: "sports_soccer", label: "Sport" },
  { value: "restaurant", label: "Resto" },
  { value: "directions_car", label: "Transport" },
  { value: "computer", label: "Technologie" },
  { value: "gavel", label: "Juridique" },
  { value: "volunteer_activism", label: "Bénévolat" },
  { value: "celebration", label: "Événements" },
  { value: "help_outline", label: "Aide" },
];

// ── Preset color pairs ─────────────────────────────────────
const COLOR_PRESETS = [
  { color: "#0057B8", bgColor: "#eff6ff", label: "Bleu" },
  { color: "#065f46", bgColor: "#ecfdf5", label: "Vert" },
  { color: "#6d28d9", bgColor: "#f5f3ff", label: "Violet" },
  { color: "#9a3412", bgColor: "#fff7ed", label: "Orange" },
  { color: "#be123c", bgColor: "#fff1f2", label: "Rouge" },
  { color: "#7e22ce", bgColor: "#fdf4ff", label: "Mauve" },
  { color: "#166534", bgColor: "#f0fdf4", label: "Vert f." },
  { color: "#1d4ed8", bgColor: "#eff6ff", label: "Indigo" },
  { color: "#92400e", bgColor: "#fef3c7", label: "Ambre" },
  { color: "#334155", bgColor: "#f1f5f9", label: "Gris" },
];

// ── Loader ─────────────────────────────────────────────────
export async function loader() {
  try {
    const [catsRes, statsRes] = await Promise.allSettled([
      customFetch.get("/forum/categories/admin"),
      customFetch.get("/forum/stats"),
    ]);
    return {
      categories: catsRes.status === "fulfilled" ? catsRes.value.data : [],
      stats: statsRes.status === "fulfilled" ? statsRes.value.data : null,
    };
  } catch (error) {
    toast.error("Помилка завантаження");
    return { categories: [], stats: null };
  }
}

// ── Empty form state ───────────────────────────────────────
const emptyForm = {
  title: "",
  description: "",
  icon: "forum",
  color: "#0057B8",
  bgColor: "#eff6ff",
  sortOrder: 0,
};

// ── Stat pill ──────────────────────────────────────────────
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
            fontSize: "1.5rem",
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

// ── Category Card ──────────────────────────────────────────
function CategoryCard({ cat, onEdit, onDelete, onToggle, index }) {
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
        animation: "fadeUp 0.4s ease both",
        animationDelay: `${index * 0.05}s`,
        "@keyframes fadeUp": {
          from: { opacity: 0, transform: "translateY(12px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "&:hover": { boxShadow: "0 4px 20px rgba(0,87,184,.1)" },
      }}
    >
      {/* Color accent top bar */}
      <Box
        sx={{
          height: 4,
          bgcolor: cat.color || BLUE,
          opacity: cat.isActive ? 1 : 0.4,
        }}
      />

      <Box sx={{ p: 2.5 }}>
        {/* Header row */}
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
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
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.3 }}
            >
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
              {!cat.isActive && (
                <Chip
                  label="Приховано"
                  size="small"
                  sx={{
                    fontFamily: F_BODY,
                    fontWeight: 700,
                    fontSize: "0.6rem",
                    bgcolor: "#f1f5f9",
                    color: "#94a3b8",
                    height: 18,
                  }}
                />
              )}
            </Box>
            <Typography
              sx={{
                fontFamily: F_BODY,
                fontSize: "0.78rem",
                color: "#64748b",
                lineHeight: 1.45,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {cat.description || "Без опису"}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "#f8fafc", mb: 2 }} />

        {/* Stats row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <ChatBubbleOutlineIcon sx={{ fontSize: 13, color: "#94a3b8" }} />
              <Typography
                sx={{
                  fontFamily: F_BODY,
                  fontSize: "0.75rem",
                  color: "#64748b",
                  fontWeight: 600,
                }}
              >
                {cat.topicsCount ?? 0} тем
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: cat.color || BLUE,
                  opacity: 0.5,
                }}
              />
              <Typography
                sx={{
                  fontFamily: F_BODY,
                  fontSize: "0.72rem",
                  color: "#94a3b8",
                }}
              >
                Порядок: {cat.sortOrder}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Actions row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Tooltip title="Редагувати">
              <IconButton
                size="small"
                onClick={() => onEdit(cat)}
                sx={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  width: 32,
                  height: 32,
                  color: "#64748b",
                  "&:hover": {
                    color: BLUE,
                    borderColor: BLUE,
                    bgcolor: "#eff6ff",
                  },
                }}
              >
                <EditOutlinedIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                cat.isActive ? "Приховати від форуму" : "Показати на форумі"
              }
            >
              <IconButton
                size="small"
                onClick={() => onToggle(cat)}
                sx={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  width: 32,
                  height: 32,
                  color: cat.isActive ? "#10b981" : "#94a3b8",
                  "&:hover": {
                    borderColor: cat.isActive ? "#10b981" : "#94a3b8",
                    bgcolor: cat.isActive ? "#ecfdf5" : "#f1f5f9",
                  },
                }}
              >
                {cat.isActive ? (
                  <VisibilityOutlinedIcon sx={{ fontSize: 15 }} />
                ) : (
                  <VisibilityOffOutlinedIcon sx={{ fontSize: 15 }} />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Видалити">
              <IconButton
                size="small"
                onClick={() => onDelete(cat)}
                sx={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  width: 32,
                  height: 32,
                  color: "#94a3b8",
                  "&:hover": {
                    color: "#ef4444",
                    borderColor: "#ef4444",
                    bgcolor: "#fef2f2",
                  },
                }}
              >
                <DeleteOutlineIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Mini preview */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              px: 1.5,
              py: 0.5,
              borderRadius: "8px",
              bgcolor: cat.bgColor || "#eff6ff",
              border: `1px solid ${cat.color || BLUE}22`,
            }}
          >
            <span
              className="material-icons"
              style={{ fontSize: 12, color: cat.color || BLUE }}
            >
              {cat.icon || "forum"}
            </span>
            <Typography
              sx={{
                fontFamily: F_BODY,
                fontWeight: 700,
                fontSize: "0.65rem",
                color: cat.color || BLUE,
              }}
            >
              Вигляд
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

// ── Main Component ─────────────────────────────────────────
export default function ForumManager() {
  const { categories: initial, stats } = useLoaderData();
  const revalidator = useRevalidator();

  const [categories, setCategories] = useState(initial);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [isEdit, setIsEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Keep local state in sync with loader data
  useEffect(() => {
    setCategories(initial);
  }, [initial]);

  const showSnack = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenCreate = () => {
    setIsEdit(false);
    setForm({ ...emptyForm, sortOrder: categories.length });
    setDialogOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setIsEdit(true);
    setSelectedCat(cat);
    setForm({
      title: cat.title,
      description: cat.description || "",
      icon: cat.icon || "forum",
      color: cat.color || "#0057B8",
      bgColor: cat.bgColor || "#eff6ff",
      sortOrder: cat.sortOrder || 0,
    });
    setDialogOpen(true);
  };

  const handleOpenDelete = (cat) => {
    setSelectedCat(cat);
    setDeleteOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      showSnack("Назва категорії обов'язкова", "error");
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        const { data } = await customFetch.put(
          `/forum/categories/${selectedCat.id}`,
          form,
        );
        setCategories((prev) =>
          prev.map((c) => (c.id === selectedCat.id ? { ...c, ...data } : c)),
        );
        showSnack("Категорію оновлено!");
      } else {
        const { data } = await customFetch.post("/forum/categories", form);
        setCategories((prev) => [...prev, { ...data, topicsCount: 0 }]);
        showSnack("Категорію додано!");
      }
      setDialogOpen(false);
      revalidator.revalidate();
    } catch (error) {
      showSnack(
        error?.response?.data?.message || "Помилка збереження",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCat) return;
    try {
      await customFetch.delete(`/forum/categories/${selectedCat.id}`);
      setCategories((prev) => prev.filter((c) => c.id !== selectedCat.id));
      showSnack("Категорію видалено!");
      setDeleteOpen(false);
      revalidator.revalidate();
    } catch (error) {
      showSnack(error?.response?.data?.message || "Помилка видалення", "error");
    }
  };

  const handleToggle = async (cat) => {
    try {
      const { data } = await customFetch.patch(
        `/forum/categories/${cat.id}/toggle`,
      );
      setCategories((prev) =>
        prev.map((c) =>
          c.id === cat.id ? { ...c, isActive: data.isActive } : c,
        ),
      );
      showSnack(
        data.isActive ? "Категорію показано на форумі" : "Категорію приховано",
      );
    } catch (error) {
      showSnack("Помилка зміни статусу", "error");
    }
  };

  const handleColorPreset = (preset) => {
    setForm((f) => ({ ...f, color: preset.color, bgColor: preset.bgColor }));
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      fontFamily: F_BODY,
      bgcolor: "#f8fafc",
      "& fieldset": { borderColor: "#e2e8f0" },
      "&:hover fieldset": { borderColor: BLUE },
      "&.Mui-focused fieldset": { borderColor: BLUE, borderWidth: "1.5px" },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: BLUE },
    "& .MuiInputLabel-root": { fontFamily: F_BODY },
  };

  const activeCount = categories.filter((c) => c.isActive).length;
  const hiddenCount = categories.filter((c) => !c.isActive).length;

  return (
    <Box>
      <PageHeader
        title="Керування форумом"
        subtitle="Категорії, статистика та налаштування форуму спільноти"
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

      {/* ── Live Stats ── */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatPill
            icon={<ForumOutlinedIcon sx={{ fontSize: 20 }} />}
            label="Теми"
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
            label="Категорій"
            value={categories.length}
            color="#8b5cf6"
            bg="#f5f3ff"
          />
        </Grid>
      </Grid>

      {/* ── Summary bar ── */}
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
          boxShadow: "0 1px 4px rgba(0,0,0,.04)",
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}
        >
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
            Порядок впливає на відображення у форумі
          </Typography>
        </Box>
      </Paper>

      {/* ── Categories grid ── */}
      {categories.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            borderRadius: "20px",
            border: "2px dashed #e2e8f0",
            p: 8,
            textAlign: "center",
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
            <CategoryOutlinedIcon sx={{ fontSize: 36, color: "#cbd5e1" }} />
          </Box>
          <Typography
            sx={{
              fontFamily: F_DISPLAY,
              fontWeight: 700,
              fontSize: "1.3rem",
              color: "#94a3b8",
              mb: 1,
            }}
          >
            Категорій ще немає
          </Typography>
          <Typography
            sx={{
              fontFamily: F_BODY,
              fontSize: "0.875rem",
              color: "#cbd5e1",
              mb: 3,
            }}
          >
            Додайте першу категорію форуму, щоб організувати обговорення
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{
              fontFamily: F_BODY,
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "12px",
              bgcolor: BLUE,
              "&:hover": { bgcolor: "#003d82" },
            }}
          >
            Додати першу категорію
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2.5}>
          {categories.map((cat, i) => (
            <Grid key={cat.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <CategoryCard
                cat={cat}
                index={i}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onToggle={handleToggle}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* ══ Create / Edit Dialog ══════════════════════════════════ */}
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
          {isEdit ? "Редагувати категорію" : "Нова категорія"}
        </DialogTitle>

        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}
        >
          {/* Title */}
          <TextField
            label="Назва категорії *"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            fullWidth
            inputProps={{ maxLength: 150 }}
            sx={inputSx}
          />

          {/* Description */}
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
              Іконка
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {ICON_OPTIONS.map((opt) => (
                <Tooltip key={opt.value} title={opt.label}>
                  <Box
                    onClick={() => setForm((f) => ({ ...f, icon: opt.value }))}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      border: `2px solid ${form.icon === opt.value ? BLUE : "#e2e8f0"}`,
                      bgcolor:
                        form.icon === opt.value
                          ? "rgba(0,87,184,.08)"
                          : "#f8fafc",
                      transition: "all 0.15s",
                      "&:hover": {
                        borderColor: BLUE,
                        bgcolor: "rgba(0,87,184,.05)",
                      },
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
                mb: 1.5,
              }}
            >
              Колір
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {COLOR_PRESETS.map((preset) => {
                const isActive =
                  form.color === preset.color &&
                  form.bgColor === preset.bgColor;
                return (
                  <Tooltip key={preset.label} title={preset.label}>
                    <Box
                      onClick={() => handleColorPreset(preset)}
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "10px",
                        bgcolor: preset.bgColor,
                        border: `2px solid ${isActive ? preset.color : "#e2e8f0"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        boxShadow: isActive
                          ? `0 0 0 2px ${preset.color}44`
                          : "none",
                        "&:hover": { border: `2px solid ${preset.color}` },
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

            {/* Manual color inputs */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Колір іконки"
                  value={form.color}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, color: e.target.value }))
                  }
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          sx={{
                            width: 18,
                            height: 18,
                            borderRadius: "4px",
                            bgcolor: form.color,
                            border: "1px solid #e2e8f0",
                            flexShrink: 0,
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Фон іконки"
                  value={form.bgColor}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, bgColor: e.target.value }))
                  }
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          sx={{
                            width: 18,
                            height: 18,
                            borderRadius: "4px",
                            bgcolor: form.bgColor,
                            border: "1px solid #e2e8f0",
                            flexShrink: 0,
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Sort order */}
          <TextField
            label="Порядок відображення"
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
            helperText="0 = першим, більше = далі"
            inputProps={{ min: 0, max: 999 }}
            sx={inputSx}
          />

          {/* Live preview */}
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
              Попередній перегляд
            </Typography>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "14px",
                border: "1.5px solid #e2e8f0",
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                bgcolor: "#fafbfc",
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  bgcolor: form.bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span
                  className="material-icons"
                  style={{ fontSize: 22, color: form.color }}
                >
                  {form.icon}
                </span>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: "#0f172a",
                  }}
                >
                  {form.title || "Назва категорії"}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontSize: "0.75rem",
                    color: "#64748b",
                    lineHeight: 1.4,
                  }}
                >
                  {form.description || "Опис категорії"}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    color: "#0f172a",
                  }}
                >
                  0
                </Typography>
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontSize: "0.7rem",
                    color: "#94a3b8",
                  }}
                >
                  тем
                </Typography>
              </Box>
            </Paper>
          </Box>
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
              "&:disabled": { bgcolor: "#94a3b8" },
            }}
          >
            {saving ? "Збереження..." : isEdit ? "Зберегти" : "Додати"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ══ Delete Confirmation Dialog ════════════════════════════ */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        maxWidth="xs"
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
          Видалити категорію?
        </DialogTitle>
        <DialogContent>
          {selectedCat?.topicsCount > 0 && (
            <Alert
              severity="warning"
              sx={{
                borderRadius: "12px",
                fontFamily: F_BODY,
                fontSize: "0.82rem",
                mb: 2,
              }}
            >
              Ця категорія містить{" "}
              <strong>{selectedCat.topicsCount} тем</strong>. Вони не будуть
              видалені, але втратять прив'язку до категорії.
            </Alert>
          )}
          <Typography
            sx={{ fontFamily: F_BODY, fontSize: "0.875rem", color: "#64748b" }}
          >
            Категорія{" "}
            <strong style={{ color: "#0f172a" }}>"{selectedCat?.title}"</strong>{" "}
            буде видалена назавжди.
          </Typography>
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
            sx={{
              fontFamily: F_BODY,
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "10px",
              px: 3,
            }}
          >
            Видалити
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
