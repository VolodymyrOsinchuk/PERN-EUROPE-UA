import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import { useAuthContext } from "../../context/AuthContext";

export default function Security() {
  const { user, logoutUser } = useAuthContext();
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const changePassword = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const oldPassword = form.get("oldPassword");
    const newPassword = form.get("newPassword");
    const confirmation = form.get("confirmation");
    if (newPassword !== confirmation) {
      toast.error("Новий пароль і підтвердження не збігаються");
      return;
    }
    setSaving(true);
    try {
      await customFetch.patch("/users/update-password", {
        oldPassword,
        newPassword,
      });
      event.currentTarget.reset();
      toast.success("Пароль оновлено");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Не вдалося змінити пароль");
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    try {
      await customFetch.delete(`/users/${user.id}`);
      toast.success("Акаунт видалено");
      await logoutUser();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Не вдалося видалити акаунт");
    } finally {
      setDeleteOpen(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography variant="h4" fontWeight={800} mb={3}>
        Безпека акаунта
      </Typography>

      <Paper sx={{ p: 3, borderRadius: "16px", mb: 3 }}>
        <Typography variant="h6" fontWeight={800} mb={2}>
          Змінити пароль
        </Typography>
        <Box component="form" onSubmit={changePassword} sx={{ display: "grid", gap: 2 }}>
          <TextField
            name="oldPassword"
            label="Поточний пароль"
            type="password"
            required
            autoComplete="current-password"
          />
          <TextField
            name="newPassword"
            label="Новий пароль"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
          <TextField
            name="confirmation"
            label="Підтвердження нового пароля"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Збереження..." : "Змінити пароль"}
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: "16px" }}>
        <Typography variant="h6" fontWeight={800} mb={1}>
          Поточна сесія
        </Typography>
        <Typography color="text.secondary" mb={2}>
          Ви можете завершити поточний сеанс входу в акаунт на цьому пристрої.
        </Typography>
        <Button variant="outlined" onClick={logoutUser}>
          Вийти з акаунта
        </Button>
      </Paper>

      <Alert severity="error" sx={{ mt: 3, borderRadius: "12px" }}>
        Видалення акаунта є незворотним.
      </Alert>
      <Button
        color="error"
        variant="outlined"
        sx={{ mt: 1.5 }}
        onClick={() => setDeleteOpen(true)}
      >
        Видалити акаунт
      </Button>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Видалити акаунт?</DialogTitle>
        <DialogContent>
          <Typography>
            Оголошення та пов’язані дані будуть видалені згідно з правилами платформи.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Скасувати</Button>
          <Button color="error" variant="contained" onClick={deleteAccount}>
            Видалити
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
