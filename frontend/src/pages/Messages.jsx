import { useEffect, useRef, useState } from "react";
import {
  useLoaderData,
  useNavigate,
  useParams,
  redirect,
} from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { useAuthContext } from "../context/AuthContext";

const REASONS = ["Спам", "Шахрайство", "Образливий зміст", "Інше"];
const POLL_MS = 30000;

export async function loader() {
  try {
    const { data } = await customFetch.get("/conversations");
    return { conversations: data };
  } catch (error) {
    if (error?.response?.status === 401) throw redirect("/login");
    toast.error("Помилка завантаження діалогів");
    return { conversations: [] };
  }
}

export default function Messages() {
  const { conversations } = useLoaderData();
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [list, setList] = useState(conversations);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [reportFor, setReportFor] = useState(null);
  const endRef = useRef(null);
  const activeId = Number(conversationId) || null;

  const loadList = async () => {
    try {
      const { data } = await customFetch.get("/conversations");
      setList(data);
    } catch {
      /* тихо: наступне опитування оновить */
    }
  };

  const loadThread = async (id) => {
    try {
      const { data } = await customFetch.get(`/conversations/${id}/messages`);
      setMessages(data);
      await customFetch.patch(`/conversations/${id}/read`);
      loadList();
    } catch {
      toast.error("Помилка завантаження повідомлень");
    }
  };

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    loadThread(activeId);
    const timer = setInterval(() => loadThread(activeId), POLL_MS);
    return () => clearInterval(timer);
  }, [activeId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    const body = text.trim();
    if (!body || !activeId) return;
    try {
      await customFetch.post(`/conversations/${activeId}/messages`, { body });
      setText("");
      loadThread(activeId);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Помилка відправки");
    }
  };

  const sendReport = async (reason) => {
    try {
      await customFetch.post(`/messages/${reportFor}/report`, { reason });
      toast.success("Скаргу надіслано");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Помилка надсилання скарги");
    }
    setReportFor(null);
  };

  const other = (c) => (c.buyerId === user?.id ? c.seller : c.buyer);

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Повідомлення
      </Typography>
      <Stack direction={{ xs: "column", md: "row" }} gap={2}>
        {/* Список розмов */}
        <Paper
          sx={{
            width: { xs: "100%", md: 320 },
            maxHeight: 600,
            overflowY: "auto",
          }}
        >
          {list.length === 0 && (
            <Typography p={3} color="text.secondary">
              Розмов ще немає. Напишіть продавцю з картки оголошення.
            </Typography>
          )}
          {list.map((c) => (
            <Box
              key={c.id}
              onClick={() => navigate(`/messages/${c.id}`)}
              sx={{
                p: 2,
                cursor: "pointer",
                bgcolor: c.id === activeId ? "#EFF6FF" : "transparent",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <Typography fontWeight={c.unread ? 700 : 400}>
                {other(c)?.firstName || "Користувач"}
                {c.unread > 0 && ` · ${c.unread}`}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {c.ad?.title || "Оголошення видалено"}
              </Typography>
            </Box>
          ))}
        </Paper>

        {/* Потік */}
        <Paper
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 500,
          }}
        >
          {!activeId ? (
            <Typography p={3} color="text.secondary">
              Виберіть розмову
            </Typography>
          ) : (
            <>
              <Box sx={{ flex: 1, p: 2, overflowY: "auto", maxHeight: 460 }}>
                {messages.map((m) => {
                  const mine = m.senderId === user?.id;
                  return (
                    <Box
                      key={m.id}
                      sx={{
                        display: "flex",
                        justifyContent: mine ? "flex-end" : "flex-start",
                        mb: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: "75%",
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: mine ? "#0057B8" : "#F1F5F9",
                          color: mine ? "#fff" : "#0F172A",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ whiteSpace: "pre-wrap" }}
                        >
                          {m.body}
                        </Typography>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          gap={1}
                          mt={0.5}
                        >
                          <Typography variant="caption" sx={{ opacity: 0.7 }}>
                            {new Date(m.createdAt).toLocaleString("uk-UA")}
                          </Typography>
                          {!mine && (
                            <Button
                              size="small"
                              color="inherit"
                              onClick={() => setReportFor(m.id)}
                              sx={{ fontSize: "0.7rem", minWidth: 0 }}
                            >
                              Поскаржитися
                            </Button>
                          )}
                        </Stack>
                      </Box>
                    </Box>
                  );
                })}
                <div ref={endRef} />
              </Box>
              <Divider />
              <Box
                component="form"
                onSubmit={send}
                sx={{ p: 2, display: "flex", gap: 1 }}
              >
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Ваше повідомлення..."
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!text.trim()}
                >
                  Надіслати
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Stack>

      <Dialog open={reportFor !== null} onClose={() => setReportFor(null)}>
        <DialogTitle>Причина скарги</DialogTitle>
        <DialogContent>
          <Stack gap={1}>
            {REASONS.map((r) => (
              <Button key={r} variant="outlined" onClick={() => sendReport(r)}>
                {r}
              </Button>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportFor(null)}>Скасувати</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
