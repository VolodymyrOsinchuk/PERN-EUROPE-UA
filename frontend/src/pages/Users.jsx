import { useState } from "react";
import { useLoaderData, Form, redirect } from "react-router-dom";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Typography,
  InputAdornment,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import SearchIcon from "@mui/icons-material/Search";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import DataTable from "./DataTable";
import PageHeader from "./PageHeader";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/users");
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return [];
  }
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    if (intent === "delete") {
      await customFetch.delete(`/users/${formData.get("id")}`);
      toast.success("Користувача видалено");
    } else if (intent === "create") {
      await customFetch.post("/users", Object.fromEntries(formData));
      toast.success("Користувача створено");
    } else if (intent === "update") {
      await customFetch.put(
        `/users/${formData.get("id")}`,
        Object.fromEntries(formData),
      );
      toast.success("Користувача оновлено");
    }
  } catch (error) {
    toast.error(error?.response?.data?.msg);
  }
  return redirect("/dashboard/users");
};

const roleColor = (role) => {
  if (role === "admin") return { bgcolor: "#FEF3C7", color: "#92400E" };
  if (role === "moderator") return { bgcolor: "#EFF6FF", color: "#1D4ED8" };
  return { bgcolor: "#F1F5F9", color: "#475569" };
};

const Users = () => {
  const users = useLoaderData();
  const [open, setOpen] = useState(false);
  const [dialogData, setDialogData] = useState({ intent: "", user: null });
  const [search, setSearch] = useState("");

  const handleOpen = (intent, user = null) => {
    setDialogData({ intent, user });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const filtered = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase()),
  );

  // Get initials from email
  const getInitials = (email = "") => email.slice(0, 2).toUpperCase();

  const columns = [
    {
      id: "user",
      label: "Користувач",
      render: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: "#EFF6FF",
              color: "#2563EB",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            {getInitials(row.email)}
          </Avatar>
          <Box>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ lineHeight: 1.2 }}
            >
              {row.email}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {row.id}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: "role",
      label: "Роль",
      render: (row) => (
        <Chip
          label={row.role}
          size="small"
          sx={{ ...roleColor(row.role), fontWeight: 600, fontSize: "0.72rem" }}
        />
      ),
    },
    {
      id: "actions",
      label: "Дії",
      align: "right",
      width: 120,
      render: (row) => (
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
          <Tooltip title="Редагувати">
            <IconButton size="small" onClick={() => handleOpen("update", row)}>
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
        title="Користувачі"
        subtitle={`${users.length} зареєстрованих акаунтів`}
        breadcrumbs={[
          { label: "Панель", to: "/dashboard" },
          { label: "Користувачі" },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<PersonAddAltIcon />}
            onClick={() => handleOpen("create")}
          >
            Новий користувач
          </Button>
        }
      />

      {/* Search */}
      <Box sx={{ mb: 2.5 }}>
        <TextField
          placeholder="Пошук за email або роллю..."
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
        emptyMessage="Користувачів не знайдено"
      />

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          {dialogData.intent === "create"
            ? "Новий користувач"
            : "Редагувати користувача"}
        </DialogTitle>
        <Form method="post">
          <DialogContent
            sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              autoFocus
              name="email"
              label="Email"
              type="email"
              fullWidth
              defaultValue={dialogData.user?.email}
            />
            {dialogData.intent === "create" && (
              <TextField
                name="password"
                label="Пароль"
                type="password"
                fullWidth
              />
            )}
            <TextField
              name="role"
              label="Роль"
              fullWidth
              defaultValue={dialogData.user?.role}
              helperText="Наприклад: user, moderator, admin"
            />
            <input type="hidden" name="id" value={dialogData.user?.id ?? ""} />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={handleClose} variant="outlined" color="inherit">
              Скасувати
            </Button>
            <Button
              type="submit"
              name="intent"
              value={dialogData.intent}
              variant="contained"
            >
              {dialogData.intent === "create" ? "Створити" : "Зберегти"}
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
    </Box>
  );
};

export default Users;
