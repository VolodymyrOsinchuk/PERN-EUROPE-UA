import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import { getStatusStyle } from "../../utils/moderationStatus";

const BLUE = "#0057B8";

const formatDate = (v) => (v ? new Date(v).toLocaleDateString("uk-UA") : "—");

export default function MyAds() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [logsFor, setLogsFor] = useState(null);
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await customFetch.get("/adv/user-ads");
      setAds(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Помилка завантаження");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (ad) => {
    setBusyId(ad.id);
    try {
      await customFetch.patch(`/adv/${ad.id}/submit`);
      toast.success("Оголошення надіслано на модерацію");
      await load();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Помилка відправки");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (ad) => {
    if (!window.confirm(`Видалити оголошення «${ad.title}»?`)) return;
    setBusyId(ad.id);
    try {
      await customFetch.delete(`/adv/${ad.id}`);
      toast.success("Оголошення видалено");
      await load();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Помилка видалення");
    } finally {
      setBusyId(null);
    }
  };

  const openLogs = async (ad) => {
    setLogsFor(ad);
    try {
      const { data } = await customFetch.get(`/adv/${ad.id}/logs`);
      setLogs(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Помилка історії");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 4 }}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={700}>
          Мої оголошення
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/profile/create-ad"
          sx={{ bgcolor: BLUE }}
        >
          Нове оголошення
        </Button>
      </Stack>

      {ads.length === 0 && (
        <Typography color="text.secondary">У вас ще немає оголошень</Typography>
      )}

      <Stack spacing={2.5}>
        {ads.map((ad) => {
          const st = getStatusStyle(ad.moderationStatus);
          const busy = busyId === ad.id;
          const canEdit = ["draft", "needs_changes", "rejected"].includes(
            ad.moderationStatus,
          );
          const canSubmit = ["draft", "needs_changes", "rejected"].includes(
            ad.moderationStatus,
          );

          return (
            <Paper key={ad.id} sx={{ p: 3, borderRadius: 3 }}>
              <Stack direction="row" justifyContent="space-between" gap={2}>
                <Box>
                  <Typography fontWeight={700}>{ad.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Створено {formatDate(ad.datePosted)}
                    {ad.publishedAt &&
                      ` · опубліковано ${formatDate(ad.publishedAt)}`}
                  </Typography>
                </Box>
                <Chip
                  label={st.label}
                  size="small"
                  sx={{ bgcolor: st.bg, color: st.color, fontWeight: 700 }}
                />
              </Stack>

              {(ad.moderationStatus === "rejected" ||
                ad.moderationStatus === "needs_changes") &&
                ad.moderationReason && (
                  <Alert
                    severity={
                      ad.moderationStatus === "rejected" ? "error" : "info"
                    }
                    sx={{ mt: 2 }}
                  >
                    <strong>
                      {ad.moderationStatus === "rejected"
                        ? "Причина відхилення: "
                        : "Що потрібно виправити: "}
                    </strong>
                    {ad.moderationReason}
                  </Alert>
                )}

              <Stack direction="row" gap={1} flexWrap="wrap" mt={2}>
                {ad.moderationStatus === "approved" && (
                  <Button size="small" component={Link} to={`/ads/${ad.id}`}>
                    Переглянути
                  </Button>
                )}

                {canEdit && (
                  <Button
                    size="small"
                    onClick={() => navigate(`/profile/edit-ad/${ad.id}`)}
                    disabled={busy}
                  >
                    Редагувати
                  </Button>
                )}

                {canSubmit && (
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ bgcolor: BLUE }}
                    onClick={() => submit(ad)}
                    disabled={busy}
                  >
                    Надіслати на модерацію
                  </Button>
                )}

                <Button size="small" onClick={() => openLogs(ad)}>
                  Історія модерації
                </Button>

                <Button
                  size="small"
                  color="error"
                  onClick={() => remove(ad)}
                  disabled={busy}
                >
                  Видалити
                </Button>
              </Stack>
            </Paper>
          );
        })}
      </Stack>

      <Dialog
        open={!!logsFor}
        onClose={() => setLogsFor(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Історія модерації</DialogTitle>
        <DialogContent>
          {logs.length === 0 ? (
            <Typography color="text.secondary">Записів ще немає</Typography>
          ) : (
            <Stack spacing={2}>
              {logs.map((l) => (
                <Box key={l.id}>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(l.createdAt).toLocaleString("uk-UA")}
                  </Typography>
                  <Typography variant="body2">
                    {getStatusStyle(l.previousStatus).label} →{" "}
                    {getStatusStyle(l.newStatus).label}
                  </Typography>
                  {l.reason && (
                    <Typography variant="body2" color="text.secondary">
                      {l.reason}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogsFor(null)}>Закрити</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
