import { useState } from "react";
import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  InputAdornment,
  TextField,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import { DataTable, PageHeader } from "../../components";
import {
  getCategoryColors,
} from "../../data/publicationCategories";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/publications");
    return data;
  } catch {
    toast.error("Помилка завантаження публікацій");
    return [];
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
    } else if (intent === "update") {
      await customFetch.put(`/publications/${formData.get("id")}`, {
        title: formData.get("title"),
        content: formData.get("content"),
        category: formData.get("category"),
        author: formData.get("author"),
        readTime: formData.get("readTime"),
        countryCode: formData.get("countryCode"),
        sourceUrl: formData.get("sourceUrl"),
        sourceName: formData.get("sourceName"),
      });
      toast.success("Публікацію оновлено");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Помилка операції");
  }
  return redirect("/dashboard/posts");
};

const categoryColor = (cat) => getCategoryColors(cat);

const Posts = () => {
  const navigate = useNavigate();
  const publications = useLoaderData() || [];
  const [search, setSearch] = useState("");

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
              color: c.text,
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
            onClick={() => navigate("/dashboard/publications/new")}
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
          size="small"
          sx={{
            width: { xs: "100%", sm: 380 },
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              bgcolor: "#fff",
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "#94A3B8" }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <DataTable
        columns={columns}
        rows={filtered}
        emptyMessage="Публікацій не знайдено"
      />

    </Box>
  );
};

export default Posts;
