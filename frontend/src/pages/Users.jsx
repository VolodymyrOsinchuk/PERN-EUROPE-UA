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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import SearchIcon from "@mui/icons-material/Search";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { DataTable, PageHeader } from "../components";

export const loader = async () => {
  try {
    const { data } = await customFetch.get("/users");
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return [];
  }
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    if (intent === "delete") {
      const userId = formData.get("id");
      if (!window.confirm("Видалити цього користувача?")) {
        return redirect("/dashboard/users");
      }
      await customFetch.delete(`/users/${userId}`);
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
    toast.error(error?.response?.data?.message);
  }
  return redirect("/dashboard/users");
};

const roleColor = (role) => {
  if (role === "admin") return { bgcolor: "#FEF3C7", color: "#92400E" };
  if (role === "moderator") return { bgcolor: "#EFF6FF", color: "#1D4ED8" };
  return { bgcolor: "#F1F5F9", color: "#475569" };
};

const formatLastLogin = (value) => {
  if (!value) return { label: "Ще не заходив", exact: null };

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { label: "Невідомо", exact: null };
  }

  const exact = date.toLocaleString("uk-UA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000);

  let label;
  if (diffMinutes < 1) label = "Зараз";
  else if (diffMinutes < 60) label = `${diffMinutes} хв тому`;
  else if (diffMinutes < 24 * 60) {
    label = `${Math.floor(diffMinutes / 60)} год тому`;
  } else if (diffMinutes < 30 * 24 * 60) {
    label = `${Math.floor(diffMinutes / (24 * 60))} дн тому`;
  } else {
    label = date.toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return { label, exact };
};

const Users = () => {
  const users = useLoaderData();
  const [open, setOpen] = useState(false);
  const [dialogData, setDialogData] = useState({ intent: "", user: null });
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const handleOpen = (intent, user = null) => {
    setDialogData({ intent, user });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const filtered = users
    .filter((u) => {
      const matchesSearch =
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.role?.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesVerification =
        verificationFilter === "all" ||
        (verificationFilter === "verified" ? u.isVerified : !u.isVerified);
      return matchesSearch && matchesRole && matchesVerification;
    })
    .sort((a, b) => {
      if (sortBy === "lastSeen") {
        return (
          new Date(b.lastSeen || b.lastLogin || 0).getTime() -
          new Date(a.lastSeen || a.lastLogin || 0).getTime()
        );
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

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
      id: "lastLogin",
      label: "Останній вхід",
      render: (row) => {
        const lastLogin = formatLastLogin(row.lastSeen || row.lastLogin);
        return lastLogin.exact ? (
          <Tooltip title={lastLogin.exact}>
            <Typography
              variant="body2"
              sx={{ color: "#475569", cursor: "help", whiteSpace: "nowrap" }}
            >
              {lastLogin.label}
            </Typography>
          </Tooltip>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {lastLogin.label}
          </Typography>
        );
      },
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
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            mt: 1.5,
            flexWrap: "wrap",
          }}
        >
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Роль</InputLabel>
            <Select
              label="Роль"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
            >
              <MenuItem value="all">Усі ролі</MenuItem>
              <MenuItem value="user">Користувач</MenuItem>
              <MenuItem value="moderator">Модератор</MenuItem>
              <MenuItem value="admin">Адміністратор</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel>Статус</InputLabel>
            <Select
              label="Статус"
              value={verificationFilter}
              onChange={(event) => setVerificationFilter(event.target.value)}
            >
              <MenuItem value="all">Усі статуси</MenuItem>
              <MenuItem value="verified">Підтверджені</MenuItem>
              <MenuItem value="unverified">Не підтверджені</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel>Сортування</InputLabel>
            <Select
              label="Сортування"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <MenuItem value="newest">Нові спочатку</MenuItem>
              <MenuItem value="oldest">Старі спочатку</MenuItem>
              <MenuItem value="lastSeen">За активністю</MenuItem>
            </Select>
          </FormControl>
        </Box>
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
            <FormControl fullWidth>
              <InputLabel>Роль</InputLabel>
              <Select
                name="role"
                label="Роль"
                defaultValue={dialogData.user?.role || "user"}
              >
                <MenuItem value="user">Користувач</MenuItem>
                <MenuItem value="moderator">Модератор</MenuItem>
                <MenuItem value="admin">Адміністратор</MenuItem>
              </Select>
            </FormControl>
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
