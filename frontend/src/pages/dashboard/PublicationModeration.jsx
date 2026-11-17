// frontend/src/pages/dashboard/PublicationModeration.jsx
import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Link as MuiLink,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { PageHeader } from "../../components";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

const STATUS_LABEL = { pending: "На перевірці" };

export default function PublicationModeration() {
  const [status, setStatus] = useState("pending");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [checked, setChecked] = useState({});
  const [returnDialog, setReturnDialog] = useState({ open: false, pub: null, reason: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await customFetch.get("/publications/moderation/queue", {
        params: { status },
      });
      setItems(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Помилка завантаження");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (pub, action, body = {}) => {
    setBusyId(pub.id);
    try {
      await customFetch.patch(
        `/publications/moderation/${pub.id}/${action}`,
        body,
      );
      toast.success(action === "publish" ? "Опубліковано" : "Архівовано");
      await load();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Помилка дії");
    } finally {
      setBusyId(null);
    }
  };

  const submitReturn = async () => {
    const reason = returnDialog.reason.trim();
    if (reason.length < 5) {
      toast.error("Вкажіть причину (мінімум 5 символів)");
      return;
    }
    setBusyId(returnDialog.pub.id);
    try {
      await customFetch.patch(
        `/publications/moderation/${returnDialog.pub.id}/needs-changes`,
        { reason },
      );
      toast.success("Статтю повернуто на доопрацювання");
      setReturnDialog({ open: false, pub: null, reason: "" });
      await load();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Помилка");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Перевірка публікацій"
        subtitle="Матеріали, що чекають на публікацію"
        breadcrumbs={[
          { label: "Панель", to: "/dashboard" },
          { label: "Публікації", to: "/dashboard/posts" },
          { label: "Перевірка" },
        ]}
      />

      <Tabs value={status} onChange={(_, v) => setStatus(v)} sx={{ mb: 3 }}>
        <Tab value="pending" label="На перевірці" />
      </Tabs>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : items.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 6, textAlign: "center" }}>
          Нічого перевіряти
        </Typography>
      ) : (
        <Stack spacing={2.5}>
          {items.map((pub) => {
            const busy = busyId === pub.id;
            const needsSource = Boolean(pub.sourceUrl);
            return (
              <Paper key={pub.id} sx={{ p: 3, borderRadius: 3 }}>
                <Stack
                  direction="row"
                  gap={2}
                  mb={1.5}
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      {pub.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {pub.user
                        ? `${pub.user.firstName} ${pub.user.lastName}`
                        : pub.author || "—"}
                      {" · "}
                      {pub.category || "Без категорії"}
                      {pub.countryCode ? ` · ${pub.countryCode}` : ""}
                    </Typography>
                  </Box>
                  <Chip
                    label={STATUS_LABEL[pub.status] || pub.status}
                    size="small"
                  />
                </Stack>

                {needsSource ? (
                  <Typography variant="body2" mb={1.5}>
                    Джерело: <strong>{pub.sourceName || "—"}</strong>{" "}
                    <MuiLink
                      href={pub.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      відкрити
                    </MuiLink>
                  </Typography>
                ) : (
                  <Typography variant="body2" color="warning.main" mb={1.5}>
                    Джерело не вказано. Публікація без джерела опублікується без
                    позначки перевірки.
                  </Typography>
                )}

                <Typography
                  variant="body2"
                  sx={{ whiteSpace: "pre-wrap", mb: 2, lineHeight: 1.7 }}
                >
                  {pub.content?.slice(0, 600)}
                  {pub.content?.length > 600 ? "…" : ""}
                </Typography>

                <Stack
                  direction="row"
                  gap={2}
                  sx={{
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {needsSource && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!checked[pub.id]}
                          onChange={(e) =>
                            setChecked((c) => ({
                              ...c,
                              [pub.id]: e.target.checked,
                            }))
                          }
                        />
                      }
                      label="Я відкрив джерело і переконався, що інформація актуальна"
                    />
                  )}
                  <Button
                    variant="contained"
                    color="success"
                    disabled={busy || (needsSource && !checked[pub.id])}
                    onClick={() =>
                      act(pub, "publish", { sourceChecked: !!checked[pub.id] })
                    }
                  >
                    Опублікувати
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    disabled={busy}
                    onClick={() => act(pub, "archive")}
                  >
                    В архів
                  </Button>
                  <Button
                    variant="outlined"
                    color="warning"
                    disabled={busy}
                    onClick={() =>
                      setReturnDialog({ open: true, pub, reason: "" })
                    }
                  >
                    На доопрацювання
                  </Button>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      )}

      <Dialog
        open={returnDialog.open}
        onClose={() =>
          setReturnDialog({ open: false, pub: null, reason: "" })
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Що потрібно виправити</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            minRows={3}
            fullWidth
            label="Коментар для автора"
            helperText="Автор побачить цей текст у сповіщенні"
            value={returnDialog.reason}
            onChange={(e) =>
              setReturnDialog((d) => ({ ...d, reason: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setReturnDialog({ open: false, pub: null, reason: "" })
            }
          >
            Скасувати
          </Button>
          <Button
            variant="contained"
            onClick={submitReturn}
            disabled={busyId !== null}
          >
            Надіслати автору
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
