import { useState } from "react";
import { Form, useLoaderData, redirect } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  InputAdornment,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import DataTable from "../DataTable";
import PageHeader from "../PageHeader";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/publications");
    return data;
  } catch (error) {
    // Publications route may not be mounted yet — return mock data
    console.warn("Publications API not available:", error?.message);
    return MOCK_PUBLICATIONS;
  }
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  try {
    if (intent === "delete") {
      await customFetch.delete(`/publications/${formData.get("id")}`);
      toast.success("Публікацію видалено");
    } else if (intent === "create") {
      await customFetch.post("/publications", {
        title: formData.get("title"),
        content: formData.get("content"),
        category: formData.get("category"),
        author: formData.get("author"),
        readTime: formData.get("readTime"),
      });
      toast.success("Публікацію створено");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Помилка операції");
  }
  return redirect("/dashboard/posts");
};

// ── Mock data (fallback si API non montée) ────────────────
const MOCK_PUBLICATIONS = [
  {
    id: 1,
    title: "Як отримати дозвіл на проживання в Німеччині",
    category: "Документи",
    author: "Марія Петренко",
    readTime: "12 хв",
    date: new Date("2024-10-15"),
  },
  {
    id: 2,
    title: "ТОП-10 сайтів для пошуку роботи в Польщі",
    category: "Робота",
    author: "Олександр Коваленко",
    readTime: "8 хв",
    date: new Date("2024-10-12"),
  },
  {
    id: 3,
    title: "Медичне страхування в країнах ЄС",
    category: "Медицина",
    author: "Ірина Василенко",
    readTime: "15 хв",
    date: new Date("2024-10-10"),
  },
  {
    id: 4,
    title: "Освіта за кордоном: можливості для студентів",
    category: "Освіта",
    author: "Павло Мельник",
    readTime: "10 хв",
    date: new Date("2024-10-08"),
  },
];

const CATEGORIES = [
  "Документи",
  "Робота",
  "Житло",
  "Освіта",
  "Медицина",
  "Культура",
  "Інтеграція",
  "Інше",
];

const categoryColor = (cat) => {
  const map = {
    Документи: { bg: "#EFF6FF", color: "#1D4ED8" },
    Робота: { bg: "#ECFDF5", color: "#065F46" },
    Житло: { bg: "#FFF7ED", color: "#9A3412" },
    Освіта: { bg: "#F5F3FF", color: "#6D28D9" },
    Медицина: { bg: "#FFF1F2", color: "#BE123C" },
    Культура: { bg: "#FDF4FF", color: "#7E22CE" },
    Інтеграція: { bg: "#F0FDF4", color: "#166534" },
  };
  return map[cat] || { bg: "#F1F5F9", color: "#475569" };
};

const Posts = () => {
  const publications = useLoaderData() || MOCK_PUBLICATIONS;
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const filtered = publications.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()) ||
      p.author?.toLowerCase().includes(search.toLowerCase()),
  );

  const columns = [
    {
      id: "title",
      label: "Публікація",
      render: (row) => (
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.3 }}>
            <ArticleOutlinedIcon sx={{ fontSize: 15, color: "#94A3B8" }} />
            <Typography
              variant="body2"
              fontWeight={600}
              noWrap
              sx={{ maxWidth: 300 }}
            >
              {row.title}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ pl: 3 }}>
            {row.author || "—"}
          </Typography>
        </Box>
      ),
    },
    {
      id: "category",
      label: "Категорія",
      width: 140,
      render: (row) => {
        const c = categoryColor(row.category);
        return (
          <Chip
            label={row.category || "Інше"}
            size="small"
            sx={{
              bgcolor: c.bg,
              color: c.color,
              fontWeight: 600,
              fontSize: "0.72rem",
            }}
          />
        );
      },
    },
    {
      id: "readTime",
      label: "Час читання",
      width: 120,
      render: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <span
            className="material-icons"
            style={{ fontSize: 14, color: "#94A3B8" }}
          >
            schedule
          </span>
          <Typography variant="body2" color="text.secondary">
            {row.readTime || "—"}
          </Typography>
        </Box>
      ),
    },
    {
      id: "date",
      label: "Дата",
      width: 120,
      render: (row) =>
        row.date
          ? new Date(row.date).toLocaleDateString("uk-UA", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "—",
    },
    {
      id: "actions",
      label: "Дії",
      align: "right",
      width: 110,
      render: (row) => (
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
          <Tooltip title="Редагувати">
            <IconButton size="small">
              <EditOutlinedIcon fontSize="small" sx={{ color: "#64748B" }} />
            </IconButton>
          </Tooltip>
          <Form method="post" style={{ display: "inline" }}>
            <input type="hidden" name="id" value={row.id} />
            <Tooltip title="Видалити">
              <IconButton
                size="small"
                type="submit"
                name="intent"
                value="delete"
              >
                <DeleteOutlineIcon fontSize="small" sx={{ color: "#EF4444" }} />
              </IconButton>
            </Tooltip>
          </Form>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Публікації"
        subtitle={`${publications.length} публікацій`}
        breadcrumbs={[
          { label: "Панель", to: "/dashboard" },
          { label: "Публікації" },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Нова публікація
          </Button>
        }
      />

      <Alert severity="info" sx={{ mb: 2.5, borderRadius: 2 }}>
        Ця сторінка використовує ендпоінт{" "}
        <strong>GET /api/v1/publications</strong>. Переконайтесь, що
        <strong> publicationRouter</strong> змонтований в <code>index.js</code>{" "}
        бекенду.
      </Alert>

      <Box sx={{ mb: 2.5 }}>
        <TextField
          placeholder="Пошук за назвою, категорією або автором..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: { xs: "100%", sm: 380 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: "#94A3B8" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <DataTable
        columns={columns}
        rows={filtered}
        emptyMessage="Публікацій не знайдено"
      />

      {/* Dialog nouvelle publication */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Нова публікація</DialogTitle>
        <Form method="post" onSubmit={() => setOpenDialog(false)}>
          <input type="hidden" name="intent" value="create" />
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
          >
            <TextField name="title" label="Заголовок" fullWidth required />
            <FormControl fullWidth size="small">
              <InputLabel>Категорія</InputLabel>
              <Select name="category" label="Категорія" defaultValue="">
                {CATEGORIES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField name="author" label="Автор" fullWidth />
            <TextField
              name="readTime"
              label="Час читання (напр. 10 хв)"
              fullWidth
            />
            <TextField
              name="content"
              label="Контент"
              fullWidth
              multiline
              rows={4}
              required
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button
              onClick={() => setOpenDialog(false)}
              variant="outlined"
              color="inherit"
            >
              Скасувати
            </Button>
            <Button type="submit" variant="contained">
              Опублікувати
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
    </Box>
  );
};

export default Posts;
