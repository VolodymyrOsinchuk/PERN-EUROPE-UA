import { useLoaderData, Form, redirect } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Typography,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import DataTable from "./DataTable";
import PageHeader from "./PageHeader";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/news");
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Помилка завантаження новин");
    return [];
  }
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  try {
    await customFetch.delete(`/news/${formData.get("id")}`);
    toast.success("Новину видалено");
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
  return redirect("/dashboard/news");
};

const NewsManager = () => {
  const news = useLoaderData();
  const [search, setSearch] = useState("");

  const filtered = news.filter(
    (n) =>
      n.title?.toLowerCase().includes(search.toLowerCase()) ||
      n.category?.toLowerCase().includes(search.toLowerCase()),
  );

  const columns = [
    {
      id: "title",
      label: "Заголовок",
      render: (row) => (
        <Typography
          variant="body2"
          fontWeight={600}
          noWrap
          sx={{ maxWidth: 300 }}
        >
          {row.title}
        </Typography>
      ),
    },
    {
      id: "category",
      label: "Категорія",
      width: 150,
      render: (row) => (
        <Chip label={row.category || "Без категорії"} size="small" variant="outlined" />
      ),
    },
    {
      id: "importance",
      label: "Важливість",
      width: 120,
      render: (row) => {
        const colors = { high: "error", medium: "warning", low: "info" };
        return (
          <Chip
            label={row.importance}
            size="small"
            color={colors[row.importance] || "default"}
          />
        );
      },
    },
    {
      id: "date",
      label: "Дата",
      width: 130,
      render: (row) =>
        row.date
          ? new Date(row.date).toLocaleDateString("uk-UA")
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
              <IconButton size="small" type="submit">
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
        title="Новини"
        subtitle={`${news.length} новин опубліковано`}
        breadcrumbs={[
          { label: "Панель", to: "/dashboard" },
          { label: "Новини" },
        ]}
        action={
          <Button variant="contained" startIcon={<AddIcon />}>
            Додати новину
          </Button>
        }
      />

      <Box sx={{ mb: 2.5 }}>
        <TextField
          placeholder="Пошук новин..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: { xs: "100%", sm: 320 } }}
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
        emptyMessage="Новин не знайдено"
      />
    </Box>
  );
};

export default NewsManager;
