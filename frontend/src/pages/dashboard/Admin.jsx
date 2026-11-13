import {
  useState,
  useEffect,
} from "react";
import { useLoaderData, useFetcher, Form } from "react-router-dom";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Switch,
  Avatar,
  Divider,
  Alert,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import StorageIcon from "@mui/icons-material/Storage";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { PageHeader } from "../../components";

// ── Routes ────────────────────────────────────────────────
export const loader = async () => {
  try {
    const [adminsRes, sysRes] = await Promise.all([
      customFetch.get("/admin/admins"),
      customFetch.get("/admin/system-info"),
    ]);
    return {
      admins: adminsRes.data || [],
      systemInfo: sysRes.data || null,
    };
  } catch (error) {
    toast.error("Помилка завантаження адмін-панелі");
    return { admins: [], systemInfo: null };
  }
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  try {
    switch (intent) {
      case "delete-admin": {
        const id = formData.get("id");
        if (window.confirm("Видалити адміністратора?")) {
          await customFetch.delete(`/admin/admins/${id}`);
          toast.success("Адміністратора видалено");
        }
        return { ok: true };
      }
      case "add-admin": {
        const firstName = formData.get("firstName");
        const lastName = formData.get("lastName") || "";
        const email = formData.get("email");
        const password = formData.get("password");
        const role = formData.get("role") || "admin";
        await customFetch.post("/admin/admins", {
          firstName,
          lastName,
          email,
          password,
          role,
        });
        toast.success("Адміністратора додано");
        return { ok: true };
      }
      case "edit-admin": {
        const id = formData.get("id");
        const firstName = formData.get("firstName");
        const lastName = formData.get("lastName") || "";
        const email = formData.get("email");
        const role = formData.get("role") || "user";
        await customFetch.put(`/admin/admins/${id}`, {
          firstName,
          lastName,
          email,
          role,
        });
        toast.success("Дані оновлено");
        return { ok: true };
      }
      default:
        return { ok: false };
    }
  } catch (error) {
    toast.error(error?.response?.data?.error || "Помилка");
    return { ok: false };
  }
};

const ALL_PERMS = [
  { key: "users", label: "Користувачі" },
  { key: "ads", label: "Оголошення" },
  { key: "categories", label: "Категорії" },
  { key: "events", label: "Події" },
  { key: "settings", label: "Налаштування" },
  { key: "admin", label: "Адмін-панель" },
];

// ── Sub-components ─────────────────────────────────────────
const SectionCard = ({ icon, title, subtitle, action, children }) => (
  <Paper sx={{ mb: 3, overflow: "hidden" }}>
    <Box
      sx={{
        px: 3,
        py: 2.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(15,23,42,0.07)",
        bgcolor: "#FAFBFC",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            bgcolor: "#EFF6FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#2563EB",
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="subtitle1">{title}</Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      {action}
    </Box>
    <Box sx={{ p: 3 }}>{children}</Box>
  </Paper>
);

// Ролі беруться з даних API (user | moderator | admin), не хардкодяться
const ROLE_CFG = {
  admin: { label: "Адміністратор", color: "#FEF3C7", textColor: "#92400E" },
  moderator: { label: "Модератор", color: "#EFF6FF", textColor: "#1D4ED8" },
  user: { label: "Користувач", color: "#F8FAFC", textColor: "#475569" },
};

const RoleChip = ({ role }) => {
  const cfg = ROLE_CFG[role] || {};
  return (
    <Chip
      label={cfg.label || role}
      size="small"
      sx={{
        bgcolor: cfg.color || "#F1F5F9",
        color: cfg.textColor || "#475569",
        fontWeight: 600,
        fontSize: "0.72rem",
      }}
    />
  );
};

// ── Main component ─────────────────────────────────────────
const Admin = () => {
  const { admins: initialAdmins, systemInfo } = useLoaderData();
  const fetcher = useFetcher();

  const [admins, setAdmins] = useState(initialAdmins || []);
  const [maintenance, setMaintenance] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [dialog, setDialog] = useState({ open: false, mode: "", data: null });

  useEffect(() => {
    if (fetcher.data?.ok) {
      toast.success("Статус оновлено");
    }
  }, [fetcher.data]);

  const showmessage = (message) =>
    setSnackbar({ open: true, message: message });

  const openDialog = (mode, data = null) =>
    setDialog({ open: true, mode, data });
  const closeDialog = () => setDialog({ open: false, mode: "", data: null });

  return (
    <Box>
      <PageHeader
        title="Адміністрування"
        subtitle="Управління адміністраторами, ролями та системними параметрами"
        breadcrumbs={[
          { label: "Панель", to: "/dashboard" },
          { label: "Admin" },
        ]}
      />

      {maintenance && (
        <Alert
          severity="warning"
          icon={<WarningAmberIcon />}
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button
              size="small"
              color="inherit"
              onClick={() => setMaintenance(false)}
            >
              Вимкнути
            </Button>
          }
        >
          Режим технічного обслуговування активний — сайт недоступний для
          користувачів.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left column */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Admins table */}
          <SectionCard
            icon={<ShieldOutlinedIcon sx={{ fontSize: 18 }} />}
            title="Адміністратори"
            subtitle="Акаунти з розширеними правами доступу"
            action={
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => openDialog("add-admin")}
              >
                Додати
              </Button>
            }
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Користувач</TableCell>
                  <TableCell>Роль</TableCell>
                  <TableCell>Останній вхід</TableCell>
                  <TableCell align="center">Активний</TableCell>
                  <TableCell align="right">Дії</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                            bgcolor: "#EFF6FF",
                            color: "#2563EB",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                          }}
                        >
                          {admin.name.slice(0, 2)}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ lineHeight: 1.2 }}
                          >
                            {admin.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {admin.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <RoleChip role={admin.role} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {admin.lastLogin}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Редагувати роль">
                        <IconButton
                          size="small"
                          onClick={() => openDialog("edit-admin", admin)}
                        >
                          <EditOutlinedIcon sx={{ fontSize: 14, color: "#64748B" }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Редагувати">
                        <IconButton
                          size="small"
                          onClick={() => openDialog("edit-admin", admin)}
                        >
                          <EditOutlinedIcon
                            sx={{ fontSize: 16, color: "#64748B" }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Видалити">
                        <IconButton
                          size="small"
                          onClick={() => {
                            if (window.confirm("Видалити адміністратора?")) {
                              const form = new FormData();
                              form.append("intent", "delete-admin");
                              form.append("id", admin.id);
                              fetcher.submit(form, { method: "post" });
                            }
                          }}
                        >
                          <DeleteOutlineIcon
                            sx={{ fontSize: 16, color: "#EF4444" }}
                          />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>

          {/* Roles info (read-only, roles come from API) */}
          <SectionCard
            icon={
              <span className="material-icons" style={{ fontSize: 18 }}>
                manage_accounts
              </span>
            }
            title="Ролі користувачів"
            subtitle="Доступні ролі: Адміністратор, Модератор, Користувач"
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {Object.entries(ROLE_CFG).map(([key, cfg]) => (
                <Box
                  key={key}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: "1px solid rgba(15,23,42,0.07)",
                    bgcolor: "#FAFBFC",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {cfg.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Роль: {key}
                    </Typography>
                  </Box>
                  <Chip
                    label={cfg.label}
                    size="small"
                    sx={{
                      bgcolor: cfg.color,
                      color: cfg.textColor,
                      fontWeight: 700,
                    }}
                  />
                </Box>
              ))}
              <Typography variant="caption" color="text.secondary">
                Редагування ролей доступно в картці кожного адміністратора
                вище.
              </Typography>
            </Box>
          </SectionCard>
        </Grid>

        {/* Right column */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* System info */}
          <SectionCard
            icon={<StorageIcon sx={{ fontSize: 18 }} />}
            title="Система"
            subtitle="Версії та середовище"
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                { label: "Версія додатку", value: systemInfo?.appVersion || "—", icon: "code" },
                { label: "Node.js", value: systemInfo?.nodeVersion || "—", icon: "terminal" },
                { label: "База даних", value: systemInfo?.dbVersion || "—", icon: "storage" },
                { label: "Середовище", value: systemInfo?.environment || "—", icon: "cloud" },
              ].map((s) => (
                <Box
                  key={s.label}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span
                      className="material-icons"
                      style={{ fontSize: 15, color: "#94A3B8" }}
                    >
                      {s.icon}
                    </span>
                    <Typography variant="caption" color="text.secondary">
                      {s.label}
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    sx={{ color: "#0F172A" }}
                  >
                    {s.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </SectionCard>

          {/* Disk usage */}
          <SectionCard
            icon={
              <span className="material-icons" style={{ fontSize: 18 }}>
                pie_chart_outline
              </span>
            }
            title="Використання ресурсів"
            subtitle="Дискові та пам'ять"
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {(systemInfo?.diskUsage || []).length > 0 ? (
                systemInfo.diskUsage.map((d) => {
                  const pct = Math.round((d.used / d.total) * 100);
                  const color =
                    pct > 80 ? "#EF4444" : pct > 60 ? "#F59E0B" : "#10B981";
                  return (
                    <Box key={d.label}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.8,
                        }}
                      >
                        <Typography variant="caption" fontWeight={600}>
                          {d.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {d.used} / {d.total} {d.unit}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={pct}
                        sx={{
                          height: 6,
                          borderRadius: 99,
                          bgcolor: "#F1F5F9",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: color,
                            borderRadius: 99,
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color, fontWeight: 600, display: "block", mt: 0.5 }}
                      >
                        {pct}% використано
                      </Typography>
                    </Box>
                  );
                })
              ) : (
                <Typography variant="caption" color="text.secondary">
                  Дані недоступні
                </Typography>
              )}
            </Box>
          </SectionCard>

          {/* Danger zone */}
          <SectionCard
            icon={<BuildOutlinedIcon sx={{ fontSize: 18, color: "#EF4444" }} />}
            title="Небезпечна зона"
            subtitle="Дії з незворотніми наслідками (ще не реалізовано)"
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  border: "1px solid rgba(239,68,68,0.2)",
                  bgcolor: "#FFF5F5",
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ color: "#991B1B" }}
                >
                  Режим обслуговування
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Функціонал ще не реалізовано на бекенді
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="outlined"
                color="error"
                size="small"
                disabled
                startIcon={
                  <span className="material-icons" style={{ fontSize: 16 }}>
                    delete_sweep
                  </span>
                }
              >
                Очистити кеш (недоступно)
              </Button>

              <Button
                fullWidth
                variant="outlined"
                color="error"
                size="small"
                disabled
                startIcon={
                  <span className="material-icons" style={{ fontSize: 16 }}>
                    backup
                  </span>
                }
              >
                Резервна копія БД (недоступно)
              </Button>
            </Box>
          </SectionCard>
        </Grid>
      </Grid>

      {/* Add/Edit Admin dialog */}
      <Form method="post">
        <Dialog
          open={dialog.open && dialog.mode.includes("admin")}
          onClose={closeDialog}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>
            {dialog.mode === "add-admin"
              ? "Новий адміністратор"
              : "Редагувати адміністратора"}
          </DialogTitle>
          <DialogContent
            sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}
          >
            <input type="hidden" name="intent" value={dialog.mode} />
            {dialog.mode === "edit-admin" && dialog.data?.id && (
              <input type="hidden" name="id" value={dialog.data.id} />
            )}
            <TextField
              label="Ім'я"
              name="firstName"
              fullWidth
              defaultValue={dialog.data?.firstName || ""}
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              defaultValue={dialog.data?.email || ""}
              required
            />
            {dialog.mode === "edit-admin" && (
              <TextField
                select
                label="Роль"
                name="role"
                fullWidth
                defaultValue={dialog.data?.role || "user"}
              >
                <MenuItem value="user">Користувач</MenuItem>
                <MenuItem value="moderator">Модератор</MenuItem>
                <MenuItem value="admin">Адміністратор</MenuItem>
              </TextField>
            )}
            {dialog.mode === "add-admin" && (
              <TextField label="Пароль" name="password" type="password" fullWidth required />
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={closeDialog} variant="outlined" color="inherit">
              Скасувати
            </Button>
            <Button
              type="submit"
              variant="contained"
            >
              {dialog.mode === "add-admin" ? "Додати" : "Зберегти"}
            </Button>
          </DialogActions>
        </Dialog>
      </Form>

      {/* Edit role dialog */}
      <Dialog
        open={dialog.open && dialog.mode === "edit-role"}
        onClose={closeDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Дозволи — {dialog.data?.label}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {ALL_PERMS.map((perm) => (
            <FormControlLabel
              key={perm.key}
              control={
                <Checkbox
                  defaultChecked={dialog.data?.perms?.includes(perm.key)}
                  size="small"
                />
              }
              label={<Typography variant="body2">{perm.label}</Typography>}
              sx={{ display: "flex", mb: 0.5 }}
            />
          ))}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={closeDialog} variant="outlined" color="inherit">
            Скасувати
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!dialog.data?.id) return;
              const selectedPerms = ALL_PERMS.filter((p) =>
                document.querySelector(`input[name="${p.key}"]`)?.checked
              ).map((p) => p.key);
              customFetch
                .put(`/admin/admins/${dialog.data.id}/role`, {
                  role: dialog.data.role || "moderator",
                  permissions: selectedPerms,
                })
                .then(() => {
                  closeDialog();
                  toast.success("Дозволи оновлено");
                })
                .catch(() => {
                  toast.error("Помилка оновлення дозволів");
                });
            }}
          >
            Зберегти
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Admin;
