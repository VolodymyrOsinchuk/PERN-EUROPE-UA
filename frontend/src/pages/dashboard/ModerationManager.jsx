import { useEffect, useState, useCallback } from "react";
import {
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
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { PageHeader } from "../../components";
import customFetch, { apiUrl } from "../../utils/customFetch";
import { toast } from "react-toastify";

const BLUE = "#0057B8";

const TABS = [
  { value: "pending", label: "На модерації" },
  { value: "needs_changes", label: "Потребує виправлення" },
  { value: "rejected", label: "Відхилені" },
  { value: "approved", label: "Опубліковані" },
];

const STATUS_CHIP = {
  pending: { label: "На модерації", color: "#9A3412", bg: "#FFF7ED" },
  approved: { label: "Схвалено", color: "#065F46", bg: "#ECFDF5" },
  rejected: { label: "Відхилено", color: "#991B1B", bg: "#FEF2F2" },
  needs_changes: {
    label: "Потребує виправлення",
    color: "#1D4ED8",
    bg: "#EFF6FF",
  },
};

const photoSrc = (p) =>
  p.startsWith("http")
    ? p
    : `${apiUrl}/uploads/adv/${p.replace(/^public\/uploads\/adv\//, "")}`;

const formatDate = (value) =>
  value ? new Date(value).toLocaleString("uk-UA") : "—";

export default function ModerationManager() {
  const [status, setStatus] = useState("pending");
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [busyId, setBusyId] = useState(null);
  const [dialog, setDialog] = useState({ open: false, mode: null, ad: null });
  const [reason, setReason] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await customFetch.get("/moderation/ads", {
        params: { status },
      });
      setAds(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Помилка завантаження");
    } finally {
      setLoading(false);
    }
  }, [status]);

  const loadPendingCount = useCallback(async () => {
    try {
      const { data } = await customFetch.get("/moderation/pending-count");
      setPendingCount(data.count || 0);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    load();
    loadPendingCount();
  }, [load, loadPendingCount]);

  // Retourne true si l'action a réussi.
  const runAction = async (ad, action, body) => {
    setBusyId(ad.id);
    try {
      await customFetch.patch(`/moderation/ads/${ad.id}/${action}`, body);
      toast.success("Рішення збережено");
      await load();
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Помилка дії");
      return false;
    } finally {
      setBusyId(null);
    }
  };

  const submitReason = async () => {
    const text = reason.trim();
    if (text.length < 5) {
      toast.error("Причина має містити щонайменше 5 символів");
      return;
    }
    const action = dialog.mode === "reject" ? "reject" : "needs-changes";
    const ok = await runAction(dialog.ad, action, { reason: text });
    if (ok) {
      setDialog({ open: false, mode: null, ad: null });
      setReason("");
    }
  };

  const openReasonDialog = (ad, mode) => {
    setReason("");
    setDialog({ open: true, mode, ad });
  };

  return (
    <Box>
      <PageHeader
        title="Модерація оголошень"
        subtitle={
          pendingCount > 0
            ? `Нових оголошень на перевірці: ${pendingCount}`
            : "Перевірка оголошень перед публікацією"
        }
        breadcrumbs={[
          { label: "Панель", to: "/dashboard" },
          { label: "Модерація" },
        ]}
      />

      <Tabs
        value={status}
        onChange={(_, v) => setStatus(v)}
        sx={{ mb: 3, "& .MuiTabs-indicator": { bgcolor: BLUE } }}
      >
        {TABS.map((t) => (
          <Tab key={t.value} value={t.value} label={t.label} />
        ))}
      </Tabs>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : ads.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 6, textAlign: "center" }}>
          Оголошень немає
        </Typography>
      ) : (
        <Stack spacing={2.5}>
          {ads.map((ad) => {
            const chip = STATUS_CHIP[ad.moderationStatus];
            const busy = busyId === ad.id;
            return (
              <Paper key={ad.id} sx={{ p: 3, borderRadius: 3 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  gap={2}
                  mb={2}
                >
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      {ad.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID {ad.id} · подано {formatDate(ad.datePosted)}
                    </Typography>
                  </Box>
                  {chip && (
                    <Chip
                      label={chip.label}
                      size="small"
                      sx={{
                        bgcolor: chip.bg,
                        color: chip.color,
                        fontWeight: 700,
                      }}
                    />
                  )}
                </Stack>

                <Stack spacing={0.5} mb={2}>
                  <Typography variant="body2">
                    <strong>Категорія:</strong> {ad.category?.name || "—"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Країна / місто:</strong> {ad.country}, {ad.state},{" "}
                    {ad.city}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Автор:</strong>{" "}
                    {ad.user
                      ? `${ad.user.firstName} ${ad.user.lastName} (${ad.user.email})`
                      : "—"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Контакт:</strong> {ad.email}
                    {ad.phone ? `, ${ad.phone}` : ""}
                  </Typography>
                  {ad.moderationReason && (
                    <Typography variant="body2" sx={{ color: "#991B1B" }}>
                      <strong>Остання причина:</strong> {ad.moderationReason}
                    </Typography>
                  )}
                </Stack>

                <Typography
                  variant="body2"
                  sx={{ whiteSpace: "pre-wrap", mb: 2, lineHeight: 1.7 }}
                >
                  {ad.description}
                </Typography>

                {ad.photos?.length > 0 && (
                  <Stack direction="row" gap={1} flexWrap="wrap" mb={2}>
                    {ad.photos.map((p, i) => (
                      <Box
                        key={`${ad.id}-${i}`}
                        component="img"
                        src={photoSrc(p)}
                        alt=""
                        sx={{
                          width: 110,
                          height: 110,
                          objectFit: "cover",
                          borderRadius: 2,
                          border: "1px solid #e2e8f0",
                        }}
                      />
                    ))}
                  </Stack>
                )}

                {ad.moderationStatus === "pending" && (
                  <Stack direction="row" gap={1.5} flexWrap="wrap">
                    <Button
                      variant="contained"
                      color="success"
                      disabled={busy}
                      onClick={() => runAction(ad, "approve")}
                    >
                      Схвалити та опублікувати
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{ color: BLUE, borderColor: BLUE }}
                      disabled={busy}
                      onClick={() => openReasonDialog(ad, "needs_changes")}
                    >
                      Повернути на доопрацювання
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      disabled={busy}
                      onClick={() => openReasonDialog(ad, "reject")}
                    >
                      Відхилити
                    </Button>
                  </Stack>
                )}
              </Paper>
            );
          })}
        </Stack>
      )}

      <Dialog
        open={dialog.open}
        onClose={() => setDialog({ open: false, mode: null, ad: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialog.mode === "reject"
            ? "Причина відхилення"
            : "Що потрібно виправити"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            required
            margin="dense"
            label="Коментар для користувача"
            helperText="Від 5 до 1000 символів. Користувач побачить цей текст."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDialog({ open: false, mode: null, ad: null })}
          >
            Скасувати
          </Button>
          <Button
            variant="contained"
            color={dialog.mode === "reject" ? "error" : "primary"}
            onClick={submitReason}
            disabled={busyId !== null}
          >
            Підтвердити
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
