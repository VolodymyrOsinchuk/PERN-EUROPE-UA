import { useLoaderData, Form, redirect, Link } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import DataTable from "./DataTable";
import PageHeader from "./PageHeader";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/adv");
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return [];
  }
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  try {
    await customFetch.delete(`/adv/${formData.get("id")}`);
    toast.success("Оголошення видалено");
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
  return redirect("/dashboard/posts");
};

const statusChip = (status) => {
  const map = {
    active: { label: "Активне", bgcolor: "#ECFDF5", color: "#065F46" },
    pending: { label: "На розгляді", bgcolor: "#FFF7ED", color: "#9A3412" },
    rejected: { label: "Відхилено", bgcolor: "#FEF2F2", color: "#991B1B" },
  };
  const cfg = map[status] || {
    label: status,
    bgcolor: "#F1F5F9",
    color: "#475569",
  };
  return (
    <Chip
      label={cfg.label}
      size="small"
      sx={{
        bgcolor: cfg.bgcolor,
        color: cfg.color,
        fontWeight: 600,
        fontSize: "0.72rem",
      }}
    />
  );
};

const AdsManager = () => {
  const ads = useLoaderData();
  const [search, setSearch] = useState("");

  const filtered = ads.filter(
    (a) =>
      a.title?.toLowerCase().includes(search.toLowerCase()) ||
      a.status?.toLowerCase().includes(search.toLowerCase()),
  );

  const columns = [
    {
      id: "title",
      label: "Заголовок",
      render: (row) => (
        <Box>
          <Typography
            variant="body2"
            fontWeight={600}
            noWrap
            sx={{ maxWidth: 280 }}
          >
            {row.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {row.id}
          </Typography>
        </Box>
      ),
    },
    {
      id: "status",
      label: "Статус",
      width: 140,
      render: (row) => statusChip(row.status),
    },
    {
      id: "date",
      label: "Дата",
      width: 120,
      render: (row) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString("uk-UA")
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
            <IconButton
              size="small"
              component={Link}
              to={`/dashboard/edit-ad/${row.id}`}
            >
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
        title="Оголошення"
        subtitle={`${ads.length} оголошень у системі`}
        breadcrumbs={[
          { label: "Панель", to: "/dashboard" },
          { label: "Оголошення" },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            to="/dashboard/create-ad"
          >
            Нове оголошення
          </Button>
        }
      />

      <Box sx={{ mb: 2.5 }}>
        <TextField
          placeholder="Пошук за назвою або статусом..."
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
        emptyMessage="Оголошень не знайдено"
      />
    </Box>
  );
};

export default AdsManager;
