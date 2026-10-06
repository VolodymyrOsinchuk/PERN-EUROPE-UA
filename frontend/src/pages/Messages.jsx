import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Avatar,
  TextField,
  IconButton,
  Badge,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  useLoaderData,
  Link,
  Navigate,
  redirect,
  useNavigate,
} from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { useAuthContext } from "../context/AuthContext";

/* ── Design tokens ── */
const F_BODY = "'Plus Jakarta Sans', sans-serif";
const F_DISPLAY = "'Playfair Display', serif";
const BLUE = "#0057B8";

/* ── Loader : liste des conversations ── */
export const loader = async () => {
  try {
    const { data } = await customFetch.get("/messages/conversations");
    return { conversations: data };
  } catch (error) {
    if (error?.response?.status === 401) throw redirect("/login");
    toast.error("Помилка завантаження діалогів");
    return { conversations: [] };
  }
};

/* ── Helpers ── */
function getOtherParticipant(conversation, currentUserId) {
  const last = conversation.messages?.[0];
  if (last?.sender && last.sender.id !== currentUserId) return last.sender;
  if (last?.recipient && last.recipient.id !== currentUserId)
    return last.recipient;
  if (last?.sender) return last.sender;
  return conversation.creator || null;
}

function getInitials(name) {
  return name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";
}

/* ── Main Component ── */
export default function Messages() {
  const { conversations } = useLoaderData();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false);
  const threadEndRef = useRef(null);

  // Rediriger si non connecté
  if (!user) return <Navigate to="/login" replace />;

  const activeConversation =
    conversations.find((c) => c.id === activeId) || null;

  /* Chargement du fil de discussion */
  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    let cancelled = false;
    setLoadingThread(true);
    customFetch
      .get(`/messages/${activeId}`)
      .then(({ data }) => {
        if (!cancelled) {
          setMessages(data);
          setLoadingThread(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          toast.error("Помилка завантаження повідомлень");
          setLoadingThread(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [activeId]);

  /* Scroll vers le dernier message */
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeId]);

  const sendReply = async (e) => {
    e.preventDefault();
    const text = reply.trim();
    if (!text || !activeId) return;

    setSending(true);
    try {
      const { data } = await customFetch.post("/messages", {
        conversationId: activeId,
        message: text,
      });
      setMessages((prev) => [...prev, data]);
      setReply("");
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.info("Увійдіть, щоб надіслати повідомлення");
        navigate("/login");
        return;
      }
      toast.error(
        error?.response?.data?.error || "Помилка відправки повідомлення",
      );
    } finally {
      setSending(false);
    }
  };

  const other = activeConversation
    ? getOtherParticipant(activeConversation, user.id)
    : null;
  const ad = activeConversation?.ad || null;

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        {/* Titre */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontFamily: F_DISPLAY,
              fontWeight: 700,
              fontSize: { xs: "1.6rem", md: "2rem" },
              color: "#0f172a",
            }}
          >
            Повідомлення
          </Typography>
          <Typography
            sx={{ fontFamily: F_BODY, fontSize: "0.9rem", color: "#64748b" }}
          >
            Переписка з авторами оголошень
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            height: { xs: "calc(100vh - 260px)", md: "calc(100vh - 240px)" },
            minHeight: 420,
            display: "flex",
          }}
        >
          {/* ── Liste des conversations ── */}
          <Box
            sx={{
              width: { xs: mobileThreadOpen ? "0%" : "100%", md: "38%" },
              flexShrink: 0,
              borderRight: { md: "1px solid #e2e8f0" },
              overflowY: "auto",
              display: mobileThreadOpen ? { xs: "none", md: "block" } : "block",
            }}
          >
            {conversations.length === 0 ? (
              <Box
                sx={{
                  p: 5,
                  textAlign: "center",
                  color: "#94a3b8",
                }}
              >
                <ChatBubbleOutlineIcon sx={{ fontSize: 48, mb: 1.5, opacity: 0.4 }} />
                <Typography sx={{ fontFamily: F_BODY, fontWeight: 600 }}>
                  Ще немає діалогів
                </Typography>
                <Typography
                  sx={{ fontFamily: F_BODY, fontSize: "0.85rem", mt: 0.5 }}
                >
                  Напишіть автору оголошення з його картки
                </Typography>
                <Button
                  component={Link}
                  to="/ads"
                  variant="contained"
                  sx={{
                    mt: 2,
                    fontFamily: F_BODY,
                    fontWeight: 700,
                    textTransform: "none",
                    bgcolor: BLUE,
                    borderRadius: "12px",
                  }}
                >
                  Переглянути оголошення
                </Button>
              </Box>
            ) : (
              conversations.map((conv, i) => {
                const participant = getOtherParticipant(conv, user.id);
                const lastMsg = conv.messages?.[0];
                const convAd = conv.ad || null;
                const unread =
                  lastMsg &&
                  lastMsg.recipientId === user.id &&
                  !lastMsg.isRead;

                return (
                  <Box key={conv.id || i}>
                    {i > 0 && <Divider />}
                    <Box
                      onClick={() => {
                        setActiveId(conv.id);
                        setMobileThreadOpen(true);
                      }}
                      sx={{
                        p: 2,
                        display: "flex",
                        gap: 1.5,
                        alignItems: "center",
                        cursor: "pointer",
                        bgcolor:
                          conv.id === activeId
                            ? "rgba(0,87,184,.06)"
                            : "transparent",
                        borderLeft:
                          conv.id === activeId
                            ? "3px solid #0057B8"
                            : "3px solid transparent",
                        "&:hover": { bgcolor: "rgba(0,87,184,.04)" },
                      }}
                    >
                      <Avatar
                        src={
                          participant?.profilePicture ||
                          convAd?.photos?.[0] ||
                          undefined
                        }
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: "#eff6ff",
                          color: BLUE,
                          fontFamily: F_BODY,
                          fontWeight: 700,
                        }}
                      >
                        {participant
                          ? getInitials(
                              `${participant.firstName || ""} ${participant.lastName || ""}`.trim(),
                            )
                          : "?"}
                      </Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            gap: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: F_BODY,
                              fontWeight: 700,
                              fontSize: "0.9rem",
                              color: "#0f172a",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {participant
                              ? `${participant.firstName || ""} ${participant.lastName || ""}`.trim()
                              : "Невідомий"}
                          </Typography>
                          {lastMsg?.createdAt && (
                            <Typography
                              sx={{
                                fontFamily: F_BODY,
                                fontSize: "0.7rem",
                                color: "#94a3b8",
                                flexShrink: 0,
                              }}
                            >
                              {new Date(lastMsg.createdAt).toLocaleDateString(
                                "uk-UA",
                                { day: "2-digit", month: "short" },
                              )}
                            </Typography>
                          )}
                        </Box>
                        {convAd?.title && (
                          <Typography
                            sx={{
                              fontFamily: F_BODY,
                              fontSize: "0.72rem",
                              color: BLUE,
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {convAd.title}
                          </Typography>
                        )}
                        <Typography
                          sx={{
                            fontFamily: F_BODY,
                            fontSize: "0.8rem",
                            color: unread ? "#0f172a" : "#94a3b8",
                            fontWeight: unread ? 600 : 400,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {lastMsg
                            ? `${lastMsg.senderId === user.id ? "Ви: " : ""}${lastMsg.body}`
                            : "Немає повідомлень"}
                        </Typography>
                      </Box>
                      {unread && (
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor: BLUE,
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>

          {/* ── Fil de discussion ── */}
          <Box
            sx={{
              flex: 1,
              display: { xs: mobileThreadOpen ? "flex" : "none", md: "flex" },
              flexDirection: "column",
              minWidth: 0,
            }}
          >
            {!activeConversation ? (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
                  p: 3,
                  textAlign: "center",
                }}
              >
                <Box>
                  <ChatBubbleOutlineIcon
                    sx={{ fontSize: 48, mb: 1.5, opacity: 0.4 }}
                  />
                  <Typography sx={{ fontFamily: F_BODY, fontWeight: 600 }}>
                    Виберіть діалог
                  </Typography>
                </Box>
              </Box>
            ) : (
              <>
                {/* En-tête du fil */}
                <Box
                  sx={{
                    p: 2,
                    borderBottom: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    bgcolor: "#fff",
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => setMobileThreadOpen(false)}
                    sx={{ display: { xs: "inline-flex", md: "none" } }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "#eff6ff",
                      color: BLUE,
                      fontFamily: F_BODY,
                      fontWeight: 700,
                      fontSize: "0.8rem",
                    }}
                  >
                    {other
                      ? getInitials(
                          `${other.firstName || ""} ${other.lastName || ""}`.trim(),
                        )
                      : "?"}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontFamily: F_BODY,
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: "#0f172a",
                      }}
                    >
                      {other
                        ? `${other.firstName || ""} ${other.lastName || ""}`.trim()
                        : "Невідомий"}
                    </Typography>
                    {ad?.title && (
                      <Typography
                        sx={{
                          fontFamily: F_BODY,
                          fontSize: "0.72rem",
                          color: "#94a3b8",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {ad.title}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Messages */}
                <Box
                  sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: 2.5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  {loadingThread ? (
                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress size={28} sx={{ color: BLUE }} />
                    </Box>
                  ) : messages.length === 0 ? (
                    <Typography
                      sx={{
                        textAlign: "center",
                        color: "#94a3b8",
                        fontFamily: F_BODY,
                        mt: 3,
                      }}
                    >
                      Немає повідомлень — напишіть першим
                    </Typography>
                  ) : (
                    messages.map((msg) => {
                      const isMine = msg.senderId === user.id;
                      return (
                        <Box
                          key={msg.id}
                          sx={{
                            display: "flex",
                            justifyContent: isMine ? "flex-end" : "flex-start",
                          }}
                        >
                          <Box
                            sx={{
                              maxWidth: "75%",
                              bgcolor: isMine ? BLUE : "#fff",
                              color: isMine ? "#fff" : "#0f172a",
                              px: 2,
                              py: 1.25,
                              borderRadius: "16px",
                              borderBottomRightRadius: isMine ? 4 : 16,
                              borderBottomLeftRadius: isMine ? 16 : 4,
                              border: isMine ? "none" : "1px solid #e2e8f0",
                              boxShadow: "0 1px 3px rgba(0,0,0,.05)",
                            }}
                          >
                            <Typography
                              sx={{
                                fontFamily: F_BODY,
                                fontSize: "0.875rem",
                                lineHeight: 1.55,
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                              }}
                            >
                              {msg.body}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: F_BODY,
                                fontSize: "0.62rem",
                                color: isMine
                                  ? "rgba(255,255,255,.65)"
                                  : "#94a3b8",
                                mt: 0.5,
                                textAlign: "right",
                              }}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString(
                                "uk-UA",
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })
                  )}
                  <div ref={threadEndRef} />
                </Box>

                {/* Zone de réponse */}
                <Box
                  component="form"
                  onSubmit={sendReply}
                  sx={{
                    p: 2,
                    borderTop: "1px solid #e2e8f0",
                    bgcolor: "#fff",
                    display: "flex",
                    gap: 1.5,
                    alignItems: "flex-end",
                  }}
                >
                  <TextField
                    fullWidth
                    multiline
                    rows={1}
                    maxRows={4}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Ваше повідомлення..."
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "14px",
                        fontFamily: F_BODY,
                        bgcolor: "#f8fafc",
                        "&:hover fieldset": { borderColor: BLUE },
                        "&.Mui-focused fieldset": { borderColor: BLUE },
                      },
                    }}
                  />
                  <IconButton
                    type="submit"
                    disabled={sending || !reply.trim()}
                    sx={{
                      bgcolor: BLUE,
                      color: "#fff",
                      borderRadius: "12px",
                      p: 1.4,
                      "&:hover": { bgcolor: "#003d82" },
                      "&.Mui-disabled": { bgcolor: "#cbd5e1" },
                    }}
                  >
                    {sending ? (
                      <CircularProgress size={20} sx={{ color: "#fff" }} />
                    ) : (
                      <SendIcon />
                    )}
                  </IconButton>
                </Box>
              </>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
