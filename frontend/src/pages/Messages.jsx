import { useEffect, useRef, useState } from "react";
import {
  useLoaderData,
  useNavigate,
  useParams,
  redirect,
} from "react-router-dom";

import {
  Avatar,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";

import SendRoundedIcon from "@mui/icons-material/SendRounded";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { useAuthContext } from "../context/AuthContext";

const REASONS = ["Спам", "Шахрайство", "Образливий зміст", "Інше"];

const POLL_MS = 30000;

// Завантаження діалогів
export async function loader() {
  try {
    const { data } = await customFetch.get("/conversations");
    return { conversations: data };
  } catch (error) {
    if (error?.response?.status === 401) {
      throw redirect("/login");
    }

    toast.error("Помилка завантаження діалогів");
    return { conversations: [] };
  }
}

// Ініціали користувача
const getInitials = (name) => {
  if (!name) return "К";

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

// Статуси угод
const statusLabels = {
  planned: "Заплановано",
  contacted: "Зв'язалися",
  completed: "Завершено",
  cancelled: "Скасовано",
};

const statusColors = {
  planned: "info",
  contacted: "warning",
  completed: "success",
  cancelled: "error",
};

export default function Messages() {
  const { conversations } = useLoaderData();
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [list, setList] = useState(conversations);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [reportFor, setReportFor] = useState(null);
  const [deal, setDeal] = useState(null);

  const endRef = useRef(null);

  const activeId = Number(conversationId) || null;

  // Завантаження списку діалогів
  const loadList = async () => {
    try {
      const { data } = await customFetch.get("/conversations");
      setList(data);
    } catch {
      // Наступне опитування оновить список
    }
  };

  // Завантаження повідомлень
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

  // Автоматичне оновлення повідомлень
  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }

    const initialTimer = window.setTimeout(() => loadThread(activeId), 0);

    const timer = setInterval(() => {
      if (!document.hidden) {
        loadThread(activeId);
      }
    }, POLL_MS);

    return () => {
      window.clearTimeout(initialTimer);
      clearInterval(timer);
    };
  }, [activeId]);

  // Прокручування до останнього повідомлення
  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Завантаження угоди
  useEffect(() => {
    if (!activeId) {
      setDeal(null);
      return;
    }

    customFetch
      .get(`/deals/${activeId}`)
      .then(({ data }) => setDeal(data))
      .catch(() => setDeal(null));
  }, [activeId]);

  // Оновлення статусу угоди
  const updateDeal = async (status) => {
    try {
      const { data } = await customFetch.put(`/deals/${activeId}`, { status });

      setDeal(data);

      toast.success("Статус угоди оновлено");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Не вдалося оновити угоду");
    }
  };

  // Відправлення повідомлення
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

  // Надсилання скарги
  const sendReport = async (reason) => {
    try {
      await customFetch.post(`/messages/${reportFor}/report`, { reason });

      toast.success("Скаргу надіслано");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Помилка надсилання скарги");
    }

    setReportFor(null);
  };

  // Визначення співрозмовника
  const other = (c) => (c.buyerId === user?.id ? c.seller : c.buyer);

  const activeConversation = list.find((c) => c.id === activeId);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f7fb",
        py: { xs: 2, md: 4 },
        px: { xs: 1.5, md: 3 },
      }}
    >
      <Box sx={{ maxWidth: 1250, mx: "auto" }}>
        {/* Заголовок сторінки */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#172554",
              letterSpacing: "-0.8px",
              fontSize: { xs: 25, md: 32 },
            }}
          >
            Повідомлення
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: 14 }}>
            Ваші діалоги та домовленості з користувачами
          </Typography>
        </Box>

        {/* Основний контейнер */}
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            height: { xs: "auto", md: 720 },
            minHeight: { xs: 600, md: 650 },
            overflow: "hidden",
            borderRadius: "22px",
            border: "1px solid #e5eaf2",
            boxShadow: "0 8px 35px rgba(15, 23, 42, 0.05)",
            bgcolor: "#fff",
          }}
        >
          {/* Список діалогів */}
          <Box
            sx={{
              width: { xs: "100%", md: 340 },
              flexShrink: 0,
              borderRight: {
                md: "1px solid #edf0f5",
              },
              display: "flex",
              flexDirection: "column",
              maxHeight: {
                xs: 260,
                md: "none",
              },
            }}
          >
            <Box sx={{ p: 2.5 }}>
              <Typography fontWeight={800} fontSize={17} color="#172554">
                Ваші діалоги
              </Typography>

              <Typography variant="caption" color="text.secondary">
                {list.length} активних розмов
              </Typography>
            </Box>

            <Divider />

            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
              }}
            >
              {list.length === 0 ? (
                <Box
                  sx={{
                    p: 3,
                    textAlign: "center",
                  }}
                >
                  <ChatBubbleOutlineRoundedIcon
                    sx={{
                      fontSize: 42,
                      color: "#cbd5e1",
                      mb: 1,
                    }}
                  />

                  <Typography color="text.secondary" fontSize={14}>
                    Розмов ще немає.
                    <br />
                    Напишіть продавцю з картки оголошення.
                  </Typography>
                </Box>
              ) : (
                list.map((c) => {
                  const person = other(c);
                  const selected = c.id === activeId;

                  return (
                    <Box
                      key={c.id}
                      onClick={() => navigate(`/messages/${c.id}`)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        p: 2,
                        cursor: "pointer",
                        borderLeft: selected
                          ? "4px solid #2563eb"
                          : "4px solid transparent",
                        bgcolor: selected ? "#eff6ff" : "transparent",
                        transition: "all .2s ease",
                        "&:hover": {
                          bgcolor: selected ? "#eff6ff" : "#f8fafc",
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 46,
                          height: 46,
                          bgcolor: selected ? "#2563eb" : "#dbeafe",
                          color: selected ? "#fff" : "#1d4ed8",
                          fontWeight: 700,
                          fontSize: 15,
                        }}
                      >
                        {getInitials(person?.firstName)}
                      </Avatar>

                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          fontWeight={c.unread > 0 ? 800 : 600}
                          fontSize={14}
                          color="#1e293b"
                          noWrap
                        >
                          {person?.firstName || "Користувач"}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          noWrap
                          display="block"
                        >
                          {c.ad?.title || "Оголошення видалено"}
                        </Typography>
                      </Box>

                      {c.unread > 0 && (
                        <Box
                          sx={{
                            minWidth: 22,
                            height: 22,
                            px: 0.7,
                            borderRadius: "50px",
                            bgcolor: "#2563eb",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
                            fontWeight: 800,
                          }}
                        >
                          {c.unread}
                        </Box>
                      )}
                    </Box>
                  );
                })
              )}
            </Box>
          </Box>

          {/* Область чату */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              bgcolor: "#fff",
            }}
          >
            {!activeId ? (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 3,
                  textAlign: "center",
                  bgcolor: "#fbfcfe",
                }}
              >
                <Box
                  sx={{
                    width: 90,
                    height: 90,
                    borderRadius: "28px",
                    bgcolor: "#eff6ff",
                    display: "grid",
                    placeItems: "center",
                    mb: 2,
                  }}
                >
                  <ChatBubbleOutlineRoundedIcon
                    sx={{
                      fontSize: 42,
                      color: "#2563eb",
                    }}
                  />
                </Box>

                <Typography fontWeight={800} fontSize={20} color="#172554">
                  Ваші повідомлення
                </Typography>

                <Typography color="text.secondary" fontSize={14} mt={1}>
                  Виберіть діалог зліва, щоб продовжити спілкування
                </Typography>
              </Box>
            ) : (
              <>
                {/* Шапка чату */}
                <Box
                  sx={{
                    px: 2.5,
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    borderBottom: "1px solid #edf0f5",
                  }}
                >
                  <IconButton
                    onClick={() => navigate("/messages")}
                    sx={{
                      display: {
                        xs: "inline-flex",
                        md: "none",
                      },
                    }}
                  >
                    <ArrowBackRoundedIcon />
                  </IconButton>

                  <Avatar
                    sx={{
                      width: 42,
                      height: 42,
                      bgcolor: "#dbeafe",
                      color: "#1d4ed8",
                      fontWeight: 700,
                    }}
                  >
                    {getInitials(other(activeConversation || {})?.firstName)}
                  </Avatar>

                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Typography fontWeight={800} color="#172554" fontSize={15}>
                      {other(activeConversation || {})?.firstName ||
                        "Користувач"}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      noWrap
                      display="block"
                    >
                      {activeConversation?.ad?.title || "Оголошення видалено"}
                    </Typography>
                  </Box>
                </Box>

                {/* Повідомлення */}
                <Box
                  sx={{
                    flex: 1,
                    p: {
                      xs: 1.5,
                      md: 3,
                    },
                    overflowY: "auto",
                    bgcolor: "#f8fafc",
                    minHeight: 300,
                    maxHeight: {
                      xs: 400,
                      md: "none",
                    },
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  {messages.map((m) => {
                    const mine = m.senderId === user?.id;

                    return (
                      <Box
                        key={m.id}
                        sx={{
                          display: "flex",
                          justifyContent: mine ? "flex-end" : "flex-start",
                        }}
                      >
                        <Box
                          sx={{
                            maxWidth: {
                              xs: "88%",
                              md: "72%",
                            },
                            minWidth: 100,
                            px: 2,
                            py: 1.4,
                            borderRadius: mine
                              ? "18px 18px 4px 18px"
                              : "18px 18px 18px 4px",
                            bgcolor: mine ? "#2563eb" : "#fff",
                            color: mine ? "#fff" : "#1e293b",
                            border: mine ? "none" : "1px solid #e9eef5",
                            boxShadow: "0 2px 8px rgba(15,23,42,.04)",
                          }}
                        >
                          <Typography
                            fontSize={14}
                            sx={{
                              whiteSpace: "pre-wrap",
                              overflowWrap: "anywhere",
                              lineHeight: 1.6,
                            }}
                          >
                            {m.body}
                          </Typography>

                          <Stack
                            direction="row"
                            gap={0.7}
                            mt={0.8}
                            sx={{
                              justifyContent: "flex-end",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: 10,
                                opacity: 0.7,
                              }}
                            >
                              {new Date(m.createdAt).toLocaleTimeString(
                                "uk-UA",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </Typography>

                            {/* Статус доставки */}
                            {mine && (
                              <Tooltip
                                title={
                                  m.readAt
                                    ? "Прочитано"
                                    : m.deliveredAt
                                      ? "Доставлено"
                                      : "Надіслано"
                                }
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                  }}
                                >
                                  {m.readAt ? (
                                    <DoneAllIcon
                                      sx={{
                                        fontSize: 16,
                                        color: "#bfdbfe",
                                      }}
                                    />
                                  ) : m.deliveredAt ? (
                                    <DoneIcon
                                      sx={{
                                        fontSize: 16,
                                        color: "#bfdbfe",
                                      }}
                                    />
                                  ) : (
                                    <ScheduleIcon
                                      sx={{
                                        fontSize: 14,
                                        color: "#bfdbfe",
                                      }}
                                    />
                                  )}
                                </Box>
                              </Tooltip>
                            )}

                            {/* Кнопка скарги */}
                            {!mine && (
                              <Tooltip title="Поскаржитися">
                                <IconButton
                                  size="small"
                                  onClick={() => setReportFor(m.id)}
                                  sx={{
                                    p: 0.3,
                                    color: "#94a3b8",
                                    "&:hover": {
                                      color: "#ef4444",
                                    },
                                  }}
                                >
                                  <ReportProblemOutlinedIcon
                                    sx={{
                                      fontSize: 15,
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
                        </Box>
                      </Box>
                    );
                  })}

                  <div ref={endRef} />
                </Box>

                {/* Статус угоди */}
                <Box
                  sx={{
                    px: {
                      xs: 1.5,
                      md: 2.5,
                    },
                    py: 1.5,
                    borderTop: "1px solid #edf0f5",
                    borderBottom: "1px solid #edf0f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    flexWrap: "wrap",
                    bgcolor: "#fff",
                  }}
                >
                  <Box>
                    <Typography fontWeight={800} fontSize={13} color="#334155">
                      Статус угоди
                    </Typography>

                    <Chip
                      size="small"
                      label={statusLabels[deal?.status || "planned"]}
                      color={statusColors[deal?.status || "planned"]}
                      sx={{
                        mt: 0.5,
                        fontWeight: 700,
                        fontSize: 11,
                      }}
                    />
                  </Box>

                  <FormControl
                    size="small"
                    sx={{
                      minWidth: 180,
                    }}
                  >
                    <InputLabel>Статус</InputLabel>

                    <Select
                      label="Статус"
                      value={deal?.status || "planned"}
                      onChange={(event) => updateDeal(event.target.value)}
                      sx={{
                        borderRadius: "10px",
                        fontSize: 13,
                      }}
                    >
                      <MenuItem value="planned">Заплановано</MenuItem>

                      <MenuItem value="contacted">Зв'язалися</MenuItem>

                      <MenuItem value="completed">Завершено</MenuItem>

                      <MenuItem value="cancelled">Скасовано</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Введення повідомлення */}
                <Box
                  component="form"
                  onSubmit={send}
                  sx={{
                    p: {
                      xs: 1.5,
                      md: 2,
                    },
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 1.5,
                    bgcolor: "#fff",
                  }}
                >
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    size="small"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Напишіть повідомлення..."
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "14px",
                        bgcolor: "#f8fafc",
                        fontSize: 14,

                        "& fieldset": {
                          borderColor: "#e2e8f0",
                        },

                        "&:hover fieldset": {
                          borderColor: "#93c5fd",
                        },

                        "&.Mui-focused fieldset": {
                          borderColor: "#2563eb",
                        },
                      },
                    }}
                  />

                  <IconButton
                    type="submit"
                    disabled={!text.trim()}
                    sx={{
                      width: 44,
                      height: 44,
                      flexShrink: 0,
                      borderRadius: "14px",
                      bgcolor: "#2563eb",
                      color: "#fff",

                      "&:hover": {
                        bgcolor: "#1d4ed8",
                      },

                      "&.Mui-disabled": {
                        bgcolor: "#e2e8f0",
                        color: "#94a3b8",
                      },
                    }}
                  >
                    <SendRoundedIcon />
                  </IconButton>
                </Box>
              </>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Діалог скарги */}
      <Dialog
        open={reportFor !== null}
        onClose={() => setReportFor(null)}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 400,
            borderRadius: "20px",
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            color: "#172554",
          }}
        >
          Причина скарги
        </DialogTitle>

        <DialogContent>
          <Typography fontSize={13} color="text.secondary" mb={2}>
            Оберіть причину, через яку ви хочете поскаржитися на повідомлення.
          </Typography>

          <Stack gap={1}>
            {REASONS.map((r) => (
              <Button
                key={r}
                variant="outlined"
                fullWidth
                onClick={() => sendReport(r)}
                sx={{
                  justifyContent: "flex-start",
                  borderRadius: "10px",
                  py: 1,
                  color: "#334155",
                  borderColor: "#e2e8f0",

                  "&:hover": {
                    borderColor: "#2563eb",
                    bgcolor: "#eff6ff",
                  },
                }}
              >
                {r}
              </Button>
            ))}
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            px: 2,
            pb: 2,
          }}
        >
          <Button
            onClick={() => setReportFor(null)}
            sx={{
              color: "#64748b",
              fontWeight: 600,
            }}
          >
            Скасувати
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
