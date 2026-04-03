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
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import DataTable from "./DataTable";
import PageHeader from "./PageHeader";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/events");
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Помилка завантаження подій");
    return [];
  }
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  try {
    await customFetch.delete(`/events/${formData.get("id")}`);
    toast.success("Подію видалено");
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
  return redirect("/dashboard/events");
};

const EventsManager = () => {
  const events = useLoaderData();
  const [search, setSearch] = useState("");

  const filtered = events.filter(
    (e) =>
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.location?.toLowerCase().includes(search.toLowerCase()),
  );

  const columns = [
    {
      id: "title",
      label: "Назва події",
      render: (row) => (
        <Typography
          variant="body2"
          fontWeight={600}
          noWrap
          sx={{ maxWidth: 260 }}
        >
          {row.title}
        </Typography>
      ),
    },
    {
      id: "date",
      label: "Дата",
      width: 130,
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
      id: "location",
      label: "Місце",
      width: 180,
      render: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <LocationOnOutlinedIcon sx={{ fontSize: 14, color: "#94A3B8" }} />
          <Typography variant="body2" noWrap sx={{ maxWidth: 140 }}>
            {row.location || "—"}
          </Typography>
        </Box>
      ),
    },
    {
      id: "status",
      label: "Статус",
      width: 120,
      render: (row) => {
        const isUpcoming = row.date && new Date(row.date) > new Date();
        return (
          <Chip
            label={isUpcoming ? "Заплановано" : "Минула"}
            size="small"
            sx={{
              bgcolor: isUpcoming ? "#ECFDF5" : "#F1F5F9",
              color: isUpcoming ? "#065F46" : "#64748B",
              fontWeight: 600,
              fontSize: "0.72rem",
            }}
          />
        );
      },
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
        title="Події"
        subtitle={`${events.length} подій зареєстровано`}
        breadcrumbs={[
          { label: "Панель", to: "/dashboard" },
          { label: "Події" },
        ]}
        action={
          <Button variant="contained" startIcon={<AddIcon />}>
            Нова подія
          </Button>
        }
      />

      <Box sx={{ mb: 2.5 }}>
        <TextField
          placeholder="Пошук за назвою або містом..."
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
        emptyMessage="Подій не знайдено"
      />
    </Box>
  );
};

export default EventsManager;
