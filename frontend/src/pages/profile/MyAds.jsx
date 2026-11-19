import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import {
  Alert,
  Box,
  Button,
  Chip,
  Skeleton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import { getStatusStyle } from "../../utils/moderationStatus";

const BLUE = "#0057B8";

const formatDate = (v) => (v ? new Date(v).toLocaleDateString("uk-UA") : "—");

// Залишається менше 3 днів до закінчення терміну дії
const isExpiringSoon = (v) => {
  if (!v) return false;
  const exp = new Date(v);
  const now = new Date();
  const diffDays = (exp - now) / (1000 * 60 * 60 * 24);
  return diffDays > 0 && diffDays <= 3;
};

export default function MyAds() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [logsFor, setLogsFor] = useState(null);
  const [logs, setLogs] = useState([]);
  const [completenessFor, setCompletenessFor] = useState(null);
  const [completeness, setCompleteness] = useState(null);
  const navigate = useNavigate();

  const openCompleteness = async (ad) => {
    setCompletenessFor(ad.id);
    try {
      const { data } = await customFetch.get(`/adv/${ad.id}/completeness`);
      setCompleteness(data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Помилка отримання підказок",
      );
    }
  };

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
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
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

  const refresh = async (ad) => {
    setBusyId(ad.id);
    try {
      await customFetch.patch(`/adv/${ad.id}/refresh`);
      toast.success("Оголошення піднято в пошуку");
      await load();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Не вдалося оновити оголошення",
      );
    } finally {
      setBusyId(null);
    }
  };

  const markSold = async (ad) => {
    if (!window.confirm(`Позначити оголошення «${ad.title}» як продане?`))
      return;
    setBusyId(ad.id);
    try {
      await customFetch.patch(`/adv/${ad.id}/sold`);
      toast.success("Оголошення позначено як продане");
      await load();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Не вдалося змінити статус",
      );
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <Stack spacing={2} sx={{ maxWidth: 900, mx: "auto", px: 2, py: 4 }}>
        {[1, 2, 3].map((item) => (
          <Paper key={item} sx={{ p: 3, borderRadius: 3 }}>
            <Skeleton width="45%" height={28} />
            <Skeleton width="70%" height={22} sx={{ mt: 1 }} />
            <Skeleton width="35%" height={36} sx={{ mt: 2 }} />
          </Paper>
        ))}
      </Stack>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 4 }}>
      <Stack direction="row" mb={3} sx={{ justifyContent: "space-between" }}>
        <Typography variant="h5" fontWeight={700}>
          Мої оголошення
        </Typography>
        <Stack direction="row" gap={1}>
          <Button
            variant="contained"
            component={Link}
            to="/profile/create-ad"
            sx={{ bgcolor: BLUE }}
          >
            Нове оголошення
          </Button>
          <Button
            variant="outlined"
            component={Link}
            to="/profile/analytics"
            startIcon={<AnalyticsIcon sx={{ fontSize: 18 }} />}
            sx={{ color: BLUE, borderColor: BLUE, textTransform: "none" }}
          >
            Аналітика
          </Button>
        </Stack>
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
              <Stack
                direction="row"
                gap={2}
                sx={{ justifyContent: "space-between" }}
              >
                <Box>
                  <Typography fontWeight={700}>{ad.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Створено {formatDate(ad.datePosted)}
                    {ad.publishedAt &&
                      ` · опубліковано ${formatDate(ad.publishedAt)}`}
                    {ad.expirationDate && (
                      <>
                        <br />
                        Термін дії:{formatDate(ad.expirationDate)}{" "}
                        {isExpiringSoon(ad.expirationDate) &&
                          " · закінчується швидко — оновіть"}
                      </>
                    )}
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

              <Stack direction="row" gap={1} mt={2} sx={{ flexWrap: "wrap" }}>
                {ad.moderationStatus === "approved" && (
                  <>
                    <Button size="small" component={Link} to={`/ads/${ad.id}`}>
                      Переглянути
                    </Button>
                    {ad.status !== "Sold" && (
                      <>
                        <Button
                          size="small"
                          onClick={() => refresh(ad)}
                          disabled={busy}
                        >
                          Підняти в пошуку
                        </Button>
                        <Button
                          size="small"
                          color="warning"
                          onClick={() => markSold(ad)}
                          disabled={busy}
                        >
                          Позначити проданим
                        </Button>
                      </>
                    )}
                  </>
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

                <Button size="small" onClick={() => openCompleteness(ad)}>
                  Підказки заповнення
                </Button>

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

      <Dialog
        open={!!completenessFor}
        onClose={() => setCompletenessFor(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Підказки заповнення оголошення #{completenessFor}
        </DialogTitle>
        <DialogContent>
          {completeness && completeness.score === 100 ? (
            <Typography color="success" sx={{ pt: 1 }}>
              Оголошення виглядає відмінно! Всі деталі на місці.
            </Typography>
          ) : (
            <List>
              {completeness?.tips?.map((tip) => (
                <ListItem key={tip.field}>
                  <ListItemText primary={tip.message} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompletenessFor(null)}>Закрити</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
