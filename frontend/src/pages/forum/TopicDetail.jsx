import { useState, useEffect } from "react";
import { useLoaderData, Form, useActionData, Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Chip,
  Divider,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import { useAuthContext } from "../../context/AuthContext";

const F_BODY = "'Plus Jakarta Sans', sans-serif";
const F_DISPLAY = "'Playfair Display', serif";
const BLUE = "#0057B8";
const GOLD = "#FFD700";

const CAT_COLORS = {
  Працевлаштування: { bg: "#eff6ff", text: "#1d4ed8" },
  "Документи та легалізація": { bg: "#f5f3ff", text: "#6d28d9" },
  Житло: { bg: "#ecfdf5", text: "#065f46" },
  Освіта: { bg: "#fff7ed", text: "#9a3412" },
  "Здоров'я": { bg: "#fff1f2", text: "#be123c" },
  Спільнота: { bg: "#fdf4ff", text: "#7e22ce" },
};

export async function loader({ params }) {
  try {
    const [{ data: topic }, { data: replies }] = await Promise.all([
      customFetch.get(`/forum/${params.id}`),
      customFetch.get(`/forum/${params.id}/replies`),
    ]);
    return { topic, replies };
  } catch (error) {
    console.error(error);
    return { topic: null, replies: [] };
  }
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const content = formData.get("content");
  try {
    const { data } = await customFetch.post(`/forum/${params.id}/replies`, {
      content,
    });
    toast.success("Відповідь додано!");
    return { success: true, data };
  } catch (error) {
    // 401 = non connecté, message explicite
    if (error?.response?.status === 401) {
      toast.error("Увійдіть в акаунт, щоб відповісти");
      return { success: false, unauthorized: true };
    }
    toast.error(error?.response?.data?.message || "Помилка");
    return {
      success: false,
      message: error?.response?.data?.message || "Помилка",
    };
  }
}

function ReplyCard({ reply, index }) {
  const initials = reply.author
    ? reply.author
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 3,
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        bgcolor: "#fff",
        boxShadow: "0 1px 4px rgba(0,0,0,.04)",
        animation: "fadeUp 0.4s ease both",
        animationDelay: `${index * 0.06}s`,
        "@keyframes fadeUp": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <Avatar
        sx={{
          width: 36,
          height: 36,
          bgcolor: "#eff6ff",
          color: BLUE,
          fontSize: "0.8rem",
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {initials}
      </Avatar>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography
            sx={{
              fontFamily: F_BODY,
              fontWeight: 700,
              fontSize: "0.9rem",
              color: "#0f172a",
            }}
          >
            {reply.author || "Анонім"}
          </Typography>
          <Typography
            sx={{ fontFamily: F_BODY, fontSize: "0.72rem", color: "#94a3b8" }}
          >
            {new Date(reply.createdAt).toLocaleString("uk-UA", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </Typography>
        </Box>
        <Typography
          sx={{
            fontFamily: F_BODY,
            fontSize: "0.875rem",
            color: "#334155",
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
          }}
        >
          {reply.content}
        </Typography>
      </Box>
    </Box>
  );
}

export default function TopicDetail() {
  const { topic, replies: initialReplies } = useLoaderData();
  const actionData = useActionData();
  const { user } = useAuthContext(); // ← guard auth
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState(initialReplies || []);

  useEffect(() => {
    if (actionData?.success) {
      setReplyText("");
      if (actionData.data) {
        setReplies((prev) => [...prev, actionData.data]);
      }
    }
  }, [actionData]);

  if (!topic) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              fontFamily: F_DISPLAY,
              fontSize: "1.4rem",
              color: "#94a3b8",
              mb: 2,
            }}
          >
            Тему не знайдено
          </Typography>
          <Button
            component={Link}
            to="/forum"
            startIcon={<ArrowBackIcon />}
            sx={{
              fontFamily: F_BODY,
              fontWeight: 700,
              textTransform: "none",
              color: BLUE,
            }}
          >
            Повернутися до форуму
          </Button>
        </Box>
      </Box>
    );
  }

  const clr = CAT_COLORS[topic.category] || { bg: "#f1f5f9", text: "#64748b" };
  const authorInitials = topic.author
    ? topic.author
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* Hero strip */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #0057B8 0%, #003d82 55%, #002255 100%)",
          py: { xs: 5, md: 6 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background:
              "linear-gradient(90deg, transparent, #FFD700 30%, #FFD700 70%, transparent)",
            opacity: 0.7,
          }}
        />
        <Container maxWidth="lg" sx={{ position: "relative" }}>
          <Button
            component={Link}
            to="/forum"
            startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
            sx={{
              fontFamily: F_BODY,
              fontWeight: 600,
              textTransform: "none",
              color: "rgba(255,255,255,.7)",
              fontSize: "0.85rem",
              mb: 3,
              p: 0,
              "&:hover": { color: "#fff", bgcolor: "transparent" },
            }}
          >
            Назад до форуму
          </Button>
          {topic.category && (
            <Chip
              label={topic.category}
              size="small"
              sx={{
                bgcolor: "rgba(255,255,255,.15)",
                color: "#fff",
                fontFamily: F_BODY,
                fontWeight: 700,
                fontSize: "0.72rem",
                mb: 1.5,
                border: "1px solid rgba(255,255,255,.2)",
              }}
            />
          )}
          <Typography
            sx={{
              fontFamily: F_DISPLAY,
              fontWeight: 700,
              fontSize: { xs: "1.5rem", md: "2rem" },
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1.3,
              mb: 2,
              maxWidth: 800,
            }}
          >
            {topic.title}
          </Typography>
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {[
              {
                icon: <CalendarTodayOutlinedIcon sx={{ fontSize: 13 }} />,
                text: new Date(
                  topic.lastUpdate || topic.createdAt,
                ).toLocaleDateString("uk-UA", { dateStyle: "long" }),
              },
              {
                icon: <ForumOutlinedIcon sx={{ fontSize: 13 }} />,
                text: `${replies.length} відповідей`,
              },
              topic.views !== undefined && {
                icon: <VisibilityOutlinedIcon sx={{ fontSize: 13 }} />,
                text: `${topic.views} переглядів`,
              },
            ]
              .filter(Boolean)
              .map((item, i) => (
                <Box
                  key={i}
                  sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
                >
                  <Box sx={{ color: "rgba(255,255,255,.5)" }}>{item.icon}</Box>
                  <Typography
                    sx={{
                      fontFamily: F_BODY,
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,.65)",
                    }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              ))}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ maxWidth: 800, mx: "auto" }}>
          {/* Original post */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: "20px",
              border: "1.5px solid #e2e8f0",
              p: { xs: 3, md: 4 },
              mb: 4,
              boxShadow: "0 4px 24px rgba(0,87,184,.06)",
            }}
          >
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Avatar
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: clr.bg,
                  color: clr.text,
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {authorInitials}
              </Avatar>
              <Box>
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "#0f172a",
                  }}
                >
                  {topic.author || "Анонім"}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontSize: "0.75rem",
                    color: "#94a3b8",
                  }}
                >
                  Автор теми ·{" "}
                  {new Date(
                    topic.lastUpdate || topic.createdAt,
                  ).toLocaleDateString("uk-UA")}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ borderColor: "#f1f5f9", mb: 3 }} />
            <Typography
              sx={{
                fontFamily: F_BODY,
                fontSize: "0.95rem",
                color: "#334155",
                lineHeight: 1.8,
                whiteSpace: "pre-wrap",
              }}
            >
              {topic.content}
            </Typography>
          </Paper>

          {/* Replies */}
          {replies.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Box sx={{ mb: 2.5 }}>
                <Typography
                  sx={{
                    fontFamily: F_BODY,
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: BLUE,
                    mb: 0.5,
                  }}
                >
                  Обговорення
                </Typography>
                <Typography
                  sx={{
                    fontFamily: F_DISPLAY,
                    fontWeight: 700,
                    fontSize: "1.3rem",
                    color: "#0f172a",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {replies.length}{" "}
                  {replies.length === 1 ? "відповідь" : "відповідей"}
                </Typography>
                <Box
                  sx={{
                    width: 40,
                    height: 3,
                    background: "linear-gradient(90deg, #0057B8, #FFD700)",
                    borderRadius: "99px",
                    mt: 0.75,
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {replies.map((reply, i) => (
                  <ReplyCard key={reply.id ?? i} reply={reply} index={i} />
                ))}
              </Box>
            </Box>
          )}

          {/* Reply form — affiché seulement si connecté */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: "20px",
              border: "1.5px solid #e2e8f0",
              p: { xs: 3, md: 4 },
              boxShadow: "0 4px 24px rgba(0,87,184,.06)",
            }}
          >
            <Box sx={{ mb: 2.5 }}>
              <Typography
                sx={{
                  fontFamily: F_BODY,
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#0f172a",
                }}
              >
                Залишити відповідь
              </Typography>
              <Typography
                sx={{
                  fontFamily: F_BODY,
                  fontSize: "0.78rem",
                  color: "#64748b",
                  mt: 0.5,
                }}
              >
                Поділіться своїм досвідом або поставте питання
              </Typography>
            </Box>

            {/* ── Guard : utilisateur non connecté ── */}
            {!user ? (
              <Alert
                severity="info"
                icon={<LockOutlinedIcon fontSize="small" />}
                sx={{
                  borderRadius: "12px",
                  fontFamily: F_BODY,
                  fontSize: "0.875rem",
                }}
                action={
                  <Button
                    component={Link}
                    to="/login"
                    size="small"
                    variant="contained"
                    sx={{
                      fontFamily: F_BODY,
                      fontWeight: 700,
                      textTransform: "none",
                      borderRadius: "8px",
                      bgcolor: BLUE,
                      "&:hover": { bgcolor: "#003d82" },
                    }}
                  >
                    Увійти
                  </Button>
                }
              >
                Щоб відповісти, потрібно{" "}
                <Box
                  component={Link}
                  to="/login"
                  sx={{
                    color: BLUE,
                    fontWeight: 700,
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  увійти в акаунт
                </Box>
                .
              </Alert>
            ) : (
              /* ── Form affiché uniquement si connecté ── */
              <Form method="post">
                <TextField
                  name="content"
                  label="Ваша відповідь"
                  multiline
                  rows={4}
                  fullWidth
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Напишіть вашу відповідь тут..."
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      fontFamily: F_BODY,
                      bgcolor: "#f8fafc",
                      "& fieldset": { borderColor: "#e2e8f0" },
                      "&:hover fieldset": { borderColor: BLUE },
                      "&.Mui-focused fieldset": {
                        borderColor: BLUE,
                        borderWidth: "1.5px",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": { color: BLUE },
                    "& .MuiInputLabel-root": { fontFamily: F_BODY },
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: F_BODY,
                      fontSize: "0.78rem",
                      color: "#94a3b8",
                    }}
                  >
                    Відповідаєте як{" "}
                    <Box
                      component="span"
                      sx={{ fontWeight: 700, color: "#334155" }}
                    >
                      {user.firstName} {user.lastName}
                    </Box>
                  </Typography>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!replyText.trim()}
                    startIcon={<SendOutlinedIcon />}
                    sx={{
                      fontFamily: F_BODY,
                      fontWeight: 700,
                      textTransform: "none",
                      bgcolor: BLUE,
                      borderRadius: "12px",
                      px: 3,
                      py: 1.2,
                      boxShadow: "0 4px 14px rgba(0,87,184,.3)",
                      "&:hover": {
                        bgcolor: "#003d82",
                        transform: "translateY(-1px)",
                        boxShadow: "0 6px 20px rgba(0,87,184,.4)",
                      },
                      "&:disabled": { bgcolor: "#94a3b8", boxShadow: "none" },
                      transition: "all 0.25s ease",
                    }}
                  >
                    Відправити відповідь
                  </Button>
                </Box>
              </Form>
            )}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
