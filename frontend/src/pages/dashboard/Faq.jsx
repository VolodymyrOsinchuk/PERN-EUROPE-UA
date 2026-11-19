// frontend/src/pages/dashboard/Faq.jsx
import { useEffect, useState } from "react";
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
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { PageHeader } from "../../components";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";

const EMPTY_FORM = {
  question: "",
  answer: "",
  category: "",
  sortOrder: 0,
  isPublished: true,
};

const errorText = (error) =>
  error?.response?.data?.message || "Сталася помилка";

export default function DashboardFaq() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const { data } = await customFetch.get("/faq/admin");
      setItems(data);
    } catch (error) {
      toast.error(errorText(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      sortOrder: items.length
        ? Math.max(...items.map((i) => i.sortOrder)) + 1
        : 1,
    });
    setDialogOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      question: item.question,
      answer: item.answer,
      category: item.category || "",
      sortOrder: item.sortOrder,
      isPublished: item.isPublished,
    });
    setDialogOpen(true);
  };

  const save = async () => {
    setBusy(true);
    try {
      const payload = { ...form, sortOrder: Number(form.sortOrder) || 0 };
      if (editingId) {
        await customFetch.put(`/faq/${editingId}`, payload);
        toast.success("Питання оновлено");
      } else {
        await customFetch.post("/faq", payload);
        toast.success("Питання додано");
      }
      setDialogOpen(false);
      await load();
    } catch (error) {
      toast.error(errorText(error));
    } finally {
      setBusy(false);
    }
  };

  const togglePublished = async (item) => {
    try {
      await customFetch.put(`/faq/${item.id}`, {
        isPublished: !item.isPublished,
      });
      await load();
    } catch (error) {
      toast.error(errorText(error));
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Видалити питання «${item.question}»?`)) return;
    try {
      await customFetch.delete(`/faq/${item.id}`);
      toast.success("Питання видалено");
      await load();
    } catch (error) {
      toast.error(errorText(error));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Часті питання"
        subtitle="Питання, які бачать відвідувачі на сторінці /faq"
        breadcrumbs={[{ label: "Панель", to: "/dashboard" }, { label: "FAQ" }]}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
          >
            Нове питання
          </Button>
        }
      />

      {items.length === 0 && (
        <Alert severity="info">Питань ще немає. Додайте перше.</Alert>
      )}

      <Stack gap={1.5}>
        {items.map((item) => (
          <Paper key={item.id} sx={{ p: 2.5, borderRadius: 3 }}>
            <Stack
              direction="row"
              gap={2}
              sx={{ justifyContent: "space-between" }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Stack
                  direction="row"
                  gap={1}
                  mb={0.5}
                  sx={{ alignItems: "center" }}
                >
                  <Typography variant="caption" color="text.secondary">
                    #{item.sortOrder}
                  </Typography>
                  {item.category && (
                    <Chip
                      size="small"
                      variant="outlined"
                      label={item.category}
                    />
                  )}
                  <Chip
                    size="small"
                    label={item.isPublished ? "Опубліковано" : "Прихована"}
                    color={item.isPublished ? "success" : "default"}
                  />
                </Stack>
                <Typography fontWeight={700}>{item.question}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.answer}
                </Typography>
              </Box>

              <Stack direction="row" gap={0.5} sx={{ flexShrink: 0 }}>
                <Tooltip title={item.isPublished ? "Сховати" : "Опублікувати"}>
                  <Switch
                    checked={item.isPublished}
                    onChange={() => togglePublished(item)}
                  />
                </Tooltip>
                <Tooltip title="Редагувати">
                  <IconButton size="small" onClick={() => openEdit(item)}>
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Видалити">
                  <IconButton size="small" onClick={() => remove(item)}>
                    <DeleteIcon fontSize="small" color="error" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingId ? "Редагувати питання" : "Нове питання"}
        </DialogTitle>
        <DialogContent>
          <Stack gap={2} sx={{ pt: 1 }}>
            <TextField
              label="Питання"
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              slotProps={{
                htmlInput: {
                  maxLength: 300,
                },
              }}
              required
              fullWidth
            />
            <TextField
              label="Відповідь"
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              multiline
              minRows={4}
              required
              fullWidth
            />
            <Stack direction="row" gap={2}>
              <TextField
                label="Група (необов'язково)"
                placeholder="напр. Оголошення"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                slotProps={{
                  htmlInput: {
                    maxLength: 100,
                  },
                }}
                fullWidth
              />
              <TextField
                label="Порядок"
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm({ ...form, sortOrder: e.target.value })
                }
                sx={{ width: 140 }}
              />
            </Stack>
            <FormControlLabel
              control={
                <Switch
                  checked={form.isPublished}
                  onChange={(e) =>
                    setForm({ ...form, isPublished: e.target.checked })
                  }
                />
              }
              label="Показувати на сайті"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Скасувати</Button>
          <Button
            variant="contained"
            onClick={save}
            disabled={busy || !form.question.trim() || !form.answer.trim()}
          >
            Зберегти
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
