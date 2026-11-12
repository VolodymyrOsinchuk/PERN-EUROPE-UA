import { useState, useEffect } from "react";
import {
  useLoaderData,
  Form,
  useActionData,
  Link,
  useNavigate,
} from "react-router-dom";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PushPinIcon from "@mui/icons-material/PushPin";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import { useAuthContext } from "../../context/AuthContext";

const F_BODY = "'Plus Jakarta Sans', sans-serif";
const F_DISPLAY = "'Playfair Display', serif";
const BLUE = "#0057B8";
const GOLD = "#FFD700";

export async function loader({ params }) {
  try {
    const [{ data: topic }, { data: replies }, { data: categories }] =
      await Promise.all([
        customFetch.get(`/forum/${params.id}`),
        customFetch.get(`/forum/${params.id}/replies`),
        customFetch.get(`/forum/categories`).catch(() => ({ data: [] })),
      ]);
    return { topic, replies, categories };
  } catch (error) {
    console.error(error);
    return { topic: null, replies: [], categories: [] };
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

function ReplyCard({ reply, index, currentUser, onDeleteReply, onReportReply }) {
  const initials = reply.author
    ? reply.author
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const isOwnerOrStaff =
    currentUser &&
    (currentUser.userId === reply.userId ||
      ["admin", "moderator"].includes(currentUser.role));

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
        animation: "fadeUp 0.3s ease both",
        animationDelay: `${index * 0.04}s`,
      }}
    >
      <Avatar
        sx={{
          width: 38,
          height: 38,
          bgcolor: "#eff6ff",
          color: BLUE,
          fontSize: "0.85rem",
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
            {reply.user?.role && reply.user.role !== "user" && (
              <Chip
                label={reply.user.role === "admin" ? "Адміністратор" : "Модератор"}
                size="small"
                sx={{
                  fontFamily: F_BODY,
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  bgcolor: reply.user.role === "admin" ? "#fef3c7" : "#e0e7ff",
                  color: reply.user.role === "admin" ? "#92400e" : "#3730a3",
                  height: 18,
                }}
              />
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              sx={{ fontFamily: F_BODY, fontSize: "0.72rem", color: "#94a3b8" }}
            >
              {new Date(reply.createdAt).toLocaleString("uk-UA", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Typography>
            {currentUser && (
              <Tooltip title="Поскаржитися">
                <IconButton
                  size="small"
                  onClick={() => onReportReply(reply.id)}
                  sx={{ color: "#94a3b8", "&:hover": { color: "#e11d48" } }}
                >
                  <FlagOutlinedIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            )}
            {isOwnerOrStaff && (
              <Tooltip title="Видалити відповідь">
                <IconButton
                  size="small"
                  onClick={() => onDeleteReply(reply.id)}
                  sx={{ color: "#94a3b8", "&:hover": { color: "#e11d48" } }}
                >
                  <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
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
  const { topic: initialTopic, replies: initialReplies, categories } = useLoaderData();
  const actionData = useActionData();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [topic, setTopic] = useState(initialTopic);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState(initialReplies || []);

  // Moderation state & dialogs
  const [moveOpen, setMoveOpen] = useState(false);
  const [targetCatId, setTargetCatId] = useState("");
  const [targetSubCatId, setTargetSubCatId] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState({ topicId: null, replyId: null });
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

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

  const isStaff = user && ["admin", "moderator"].includes(user.role);
  const isOwner = user && user.userId === topic.userId;
  const canModerate = isStaff || isOwner;

  // Pin toggle
  const handleTogglePin = async () => {
    try {
      const { data } = await customFetch.patch(`/forum/${topic.id}/pin`);
      setTopic((prev) => ({ ...prev, isPinned: data.isPinned }));
      toast.success(data.isPinned ? "Тему закріплено!" : "Тему відкріплено!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Помилка");
    }
  };

  // Close toggle
  const handleToggleClose = async () => {
    try {
      const { data } = await customFetch.patch(`/forum/${topic.id}/close`);
      setTopic((prev) => ({ ...prev, isClosed: data.isClosed }));
      toast.success(
        data.isClosed
          ? "Тему закрито для нових відповідей"
          : "Тему відкрито для обговорення"
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || "Помилка");
    }
  };

  // Move topic
  const handleMoveTopic = async () => {
    if (!targetCatId) {
      toast.error("Оберіть розділ форуму");
      return;
    }
    try {
      const { data } = await customFetch.patch(`/forum/${topic.id}/move`, {
        targetCategoryId: Number(targetCatId),
        targetSubcategoryId: targetSubCatId ? Number(targetSubCatId) : null,
      });
      setTopic((prev) => ({
        ...prev,
        forumCategoryId: data.forumCategoryId,
        category: data.category,
        forumSubcategoryId: data.forumSubcategoryId,
      }));
      toast.success("Тему успішно перенесено!");
      setMoveOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Помилка перенесення");
    }
  };

  // Delete topic
  const handleDeleteTopic = async () => {
    if (!window.confirm("Ви дійсно бажаєте видалити цю тему та всі відповіді?")) {
      return;
    }
    try {
      await customFetch.delete(`/forum/${topic.id}`);
      toast.success("Тему видалено");
      navigate("/forum");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Помилка видалення");
    }
  };

  // Delete reply
  const handleDeleteReply = async (replyId) => {
    if (!window.confirm("Видалити цю відповідь?")) return;
    try {
      await customFetch.delete(`/forum/replies/${replyId}`);
      setReplies((prev) => prev.filter((r) => r.id !== replyId));
      toast.success("Відповідь видалено");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Помилка видалення");
    }
  };

  // Open complaint dialog
  const handleOpenReport = (target) => {
    if (!user) {
      toast.warning("Увійдіть в акаунт, щоб подати скаргу");
      return;
    }
    setReportTarget(target);
    setReportReason("");
    setReportDetails("");
    setReportOpen(true);
  };

  // Send report
  const handleSendReport = async () => {
    if (!reportReason) {
      toast.error("Оберіть причину скарги");
      return;
    }
    setIsSubmittingReport(true);
    try {
      await customFetch.post("/forum/reports", {
        topicId: reportTarget.topicId,
        replyId: reportTarget.replyId,
        reason: reportReason,
        details: reportDetails,
      });
      toast.success("Скаргу прийнято до розгляду модератором");
      setReportOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Помилка надсилання скарги");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const authorInitials = topic.author
    ? topic.author
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  const selectedCategoryObj = categories.find(
    (c) => String(c.id) === String(targetCatId)
  );

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* ── Hero strip ── */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #0057B8 0%, #003d82 55%, #002255 100%)",
          py: { xs: 4, md: 5.5 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative" }}>
          <Button
            component={Link}
            to="/forum"
            startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
            sx={{
              fontFamily: F_BODY,
              fontWeight: 600,
              textTransform: "none",
              color: "rgba(255,255,255,.8)",
              fontSize: "0.85rem",
              mb: 2.5,
              p: 0,
              "&:hover": { color: "#fff", bgcolor: "transparent" },
            }}
          >
            Назад до списку тем
          </Button>

          {/* Badges row */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1.5 }}>
            {topic.isPinned && (
              <Chip
                icon={<PushPinIcon sx={{ fontSize: "13px !important", color: "#854d0e" }} />}
                label="Закріплена тема"
                size="small"
                sx={{
                  bgcolor: "#fef9c3",
                  color: "#854d0e",
                  fontFamily: F_BODY,
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  border: "1px solid #fde047",
                }}
              />
            )}
            {topic.isClosed && (
              <Chip
                icon={<LockOutlinedIcon sx={{ fontSize: "13px !important", color: "#fff" }} />}
                label="Обговорення закрито"
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,.2)",
                  color: "#fff",
                  fontFamily: F_BODY,
                  fontWeight: 700,
                  fontSize: "0.72rem",
                }}
              />
            )}
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
                  border: "1px solid rgba(255,255,255,.2)",
                }}
              />
            )}
            {topic.forumSubcategory && (
              <Chip
                label={topic.forumSubcategory.title}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,.1)",
                  color: "#e2e8f0",
                  fontFamily: F_BODY,
                  fontWeight: 600,
                  fontSize: "0.7rem",
                }}
              />
            )}
            {(topic.country || topic.city) && (
              <Chip
                icon={<PlaceOutlinedIcon sx={{ fontSize: "13px !important", color: "#fff" }} />}
                label={[topic.country, topic.city].filter(Boolean).join(", ")}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,.15)",
                  color: "#fff",
                  fontFamily: F_BODY,
                  fontWeight: 600,
                  fontSize: "0.7rem",
                }}
              />
            )}
          </Box>

          <Typography
            sx={{
              fontFamily: F_DISPLAY,
              fontWeight: 700,
              fontSize: { xs: "1.5rem", md: "2.1rem" },
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1.3,
              mb: 2,
              maxWidth: 860,
            }}
          >
            {topic.title}
          </Typography>

          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <CalendarTodayOutlinedIcon sx={{ fontSize: 14, color: "rgba(255,255,255,.6)" }} />
              <Typography sx={{ fontFamily: F_BODY, fontSize: "0.8rem", color: "rgba(255,255,255,.7)" }}>
                {new Date(topic.createdAt).toLocaleDateString("uk-UA", { dateStyle: "long" })}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <ForumOutlinedIcon sx={{ fontSize: 14, color: "rgba(255,255,255,.6)" }} />
              <Typography sx={{ fontFamily: F_BODY, fontSize: "0.8rem", color: "rgba(255,255,255,.7)" }}>
                {replies.length} відповідей
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <VisibilityOutlinedIcon sx={{ fontSize: 14, color: "rgba(255,255,255,.6)" }} />
              <Typography sx={{ fontFamily: F_BODY, fontSize: "0.8rem", color: "rgba(255,255,255,.7)" }}>
                {topic.views || 0} переглядів
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ── Moderation Toolbar ── */}
      {canModerate && (
        <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #e2e8f0", py: 1.5 }}>
          <Container maxWidth="lg">
            <Box sx={{ maxWidth: 860, mx: "auto", display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
              <Typography sx={{ fontFamily: F_BODY, fontSize: "0.78rem", fontWeight: 700, color: "#64748b" }}>
                Керування темою:
              </Typography>

              {isStaff && (
                <>
                  <Button
                    size="small"
                    startIcon={<PushPinIcon />}
                    onClick={handleTogglePin}
                    sx={{
                      fontFamily: F_BODY,
                      fontSize: "0.78rem",
                      textTransform: "none",
                      color: topic.isPinned ? "#854d0e" : "#475569",
                      bgcolor: topic.isPinned ? "#fef9c3" : "transparent",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                    }}
                  >
                    {topic.isPinned ? "Відкріпити тему" : "Закріпити тему"}
                  </Button>

                  <Button
                    size="small"
                    startIcon={topic.isClosed ? <LockOpenOutlinedIcon /> : <LockOutlinedIcon />}
                    onClick={handleToggleClose}
                    sx={{
                      fontFamily: F_BODY,
                      fontSize: "0.78rem",
                      textTransform: "none",
                      color: topic.isClosed ? BLUE : "#475569",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                    }}
                  >
                    {topic.isClosed ? "Відкрити обговорення" : "Закрити тему"}
                  </Button>

                  <Button
                    size="small"
                    startIcon={<DriveFileMoveOutlinedIcon />}
                    onClick={() => {
                      setTargetCatId(String(topic.forumCategoryId || ""));
                      setTargetSubCatId(String(topic.forumSubcategoryId || ""));
                      setMoveOpen(true);
                    }}
                    sx={{
                      fontFamily: F_BODY,
                      fontSize: "0.78rem",
                      textTransform: "none",
                      color: "#475569",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                    }}
                  >
                    Перемістити
                  </Button>
                </>
              )}

              <Button
                size="small"
                startIcon={<DeleteOutlineIcon />}
                onClick={handleDeleteTopic}
                sx={{
                  fontFamily: F_BODY,
                  fontSize: "0.78rem",
                  textTransform: "none",
                  color: "#e11d48",
                  border: "1px solid #fecdd3",
                  borderRadius: "8px",
                  ml: "auto",
                  "&:hover": { bgcolor: "#fff1f2" },
                }}
              >
                Видалити тему
              </Button>
            </Box>
          </Container>
        </Box>
      )}

      {/* ── Main Post & Replies ── */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ maxWidth: 860, mx: "auto" }}>
          {/* Original Post Paper */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: "20px",
              border: "1.5px solid #e2e8f0",
              p: { xs: 3, md: 4 },
              mb: 4,
              boxShadow: "0 4px 24px rgba(0,87,184,.06)",
              bgcolor: "#fff",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Avatar
                  sx={{
                    width: 46,
                    height: 46,
                    bgcolor: "#eff6ff",
                    color: BLUE,
                    fontSize: "0.95rem",
                    fontWeight: 700,
                  }}
                >
                  {authorInitials}
                </Avatar>
                <Box>
                  <Typography
                    sx={{
                      fontFamily: F_BODY,
                      fontWeight: 700,
                      fontSize: "0.98rem",
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
                    Автор теми · {new Date(topic.createdAt).toLocaleDateString("uk-UA")}
                  </Typography>
                </Box>
              </Box>

              {user && (
                <Button
                  size="small"
                  startIcon={<FlagOutlinedIcon sx={{ fontSize: 15 }} />}
                  onClick={() => handleOpenReport({ topicId: topic.id, replyId: null })}
                  sx={{
                    fontFamily: F_BODY,
                    fontSize: "0.75rem",
                    textTransform: "none",
                    color: "#94a3b8",
                    "&:hover": { color: "#e11d48" },
                  }}
                >
                  Поскаржитися
                </Button>
              )}
            </Box>

            <Divider sx={{ borderColor: "#f1f5f9", mb: 3 }} />

            <Typography
              sx={{
                fontFamily: F_BODY,
                fontSize: "0.96rem",
                color: "#334155",
                lineHeight: 1.8,
                whiteSpace: "pre-wrap",
              }}
            >
              {topic.content}
            </Typography>
          </Paper>

          {/* Replies Section */}
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
                  {replies.length} {replies.length === 1 ? "відповідь" : "відповідей"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {replies.map((reply, i) => (
                  <ReplyCard
                    key={reply.id ?? i}
                    reply={reply}
                    index={i}
                    currentUser={user}
                    onDeleteReply={handleDeleteReply}
                    onReportReply={(replyId) =>
                      handleOpenReport({ topicId: null, replyId })
                    }
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Reply form / Closed warning */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: "20px",
              border: "1.5px solid #e2e8f0",
              p: { xs: 3, md: 4 },
              boxShadow: "0 4px 24px rgba(0,87,184,.06)",
              bgcolor: "#fff",
            }}
          >
            <Box sx={{ mb: 2.5 }}>
              <Typography
                sx={{
                  fontFamily: F_BODY,
                  fontWeight: 700,
                  fontSize: "1.05rem",
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
                Поділіться власним досвідом або дайте відповідь на запитання
              </Typography>
            </Box>

            {topic.isClosed && !isStaff ? (
              <Alert
                severity="warning"
                icon={<LockOutlinedIcon />}
                sx={{ borderRadius: "12px", fontFamily: F_BODY }}
              >
                Ця тема закрита адміністрацією форуму. Додавання нових відповідей
                призупинено.
              </Alert>
            ) : !user ? (
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
                Щоб відповісти, необхідно увійти в акаунт.
              </Alert>
            ) : (
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
                  placeholder="Напишіть вашу відповідь..."
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      fontFamily: F_BODY,
                      bgcolor: "#f8fafc",
                    },
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
                    Автор:{" "}
                    <Box component="span" sx={{ fontWeight: 700, color: "#334155" }}>
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
                      "&:hover": { bgcolor: "#003d82" },
                    }}
                  >
                    Опублікувати відповідь
                  </Button>
                </Box>
              </Form>
            )}
          </Paper>
        </Box>
      </Container>

      {/* ── Dialog: Переміщення теми ── */}
      <Dialog
        open={moveOpen}
        onClose={() => setMoveOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "18px", p: 1 } }}
      >
        <DialogTitle sx={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: "1.2rem" }}>
          Перемістити тему в інший розділ
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontFamily: F_BODY }}>Нова категорія</InputLabel>
            <Select
              value={targetCatId}
              label="Нова категорія"
              onChange={(e) => {
                setTargetCatId(e.target.value);
                setTargetSubCatId("");
              }}
              sx={{ borderRadius: "10px", fontFamily: F_BODY }}
            >
              {categories.map((c) => (
                <MenuItem key={c.id} value={String(c.id)} sx={{ fontFamily: F_BODY }}>
                  {c.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedCategoryObj?.subcategories?.length > 0 && (
            <FormControl fullWidth size="small">
              <InputLabel sx={{ fontFamily: F_BODY }}>Підкатегорія</InputLabel>
              <Select
                value={targetSubCatId}
                label="Підкатегорія"
                onChange={(e) => setTargetSubCatId(e.target.value)}
                sx={{ borderRadius: "10px", fontFamily: F_BODY }}
              >
                <MenuItem value="">Без підкатегорії</MenuItem>
                {selectedCategoryObj.subcategories.map((s) => (
                  <MenuItem key={s.id} value={String(s.id)} sx={{ fontFamily: F_BODY }}>
                    {s.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setMoveOpen(false)}
            sx={{ fontFamily: F_BODY, color: "#64748b", textTransform: "none" }}
          >
            Скасувати
          </Button>
          <Button
            onClick={handleMoveTopic}
            variant="contained"
            sx={{
              fontFamily: F_BODY,
              fontWeight: 700,
              textTransform: "none",
              bgcolor: BLUE,
              borderRadius: "10px",
            }}
          >
            Перемістити
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog: Скарга на контент ── */}
      <Dialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "18px", p: 1 } }}
      >
        <DialogTitle sx={{ fontFamily: F_DISPLAY, fontWeight: 700, fontSize: "1.2rem" }}>
          Поскаржитися на контент
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <FormControl fullWidth size="small" required>
            <InputLabel sx={{ fontFamily: F_BODY }}>Причина скарги</InputLabel>
            <Select
              value={reportReason}
              label="Причина скарги"
              onChange={(e) => setReportReason(e.target.value)}
              sx={{ borderRadius: "10px", fontFamily: F_BODY }}
            >
              <MenuItem value="Спам або реклама" sx={{ fontFamily: F_BODY }}>
                Спам або реклама
              </MenuItem>
              <MenuItem value="Неприйнятний зміст / образи" sx={{ fontFamily: F_BODY }}>
                Неприйнятний зміст / образи
              </MenuItem>
              <MenuItem value="Шахрайство" sx={{ fontFamily: F_BODY }}>
                Шахрайство
              </MenuItem>
              <MenuItem value="Неправдива інформація" sx={{ fontFamily: F_BODY }}>
                Неправдива інформація
              </MenuItem>
              <MenuItem value="Порушення правил форуму" sx={{ fontFamily: F_BODY }}>
                Порушення правил форуму
              </MenuItem>
              <MenuItem value="Інше" sx={{ fontFamily: F_BODY }}>
                Інше
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Додаткові деталі (опційно)"
            multiline
            rows={3}
            fullWidth
            value={reportDetails}
            onChange={(e) => setReportDetails(e.target.value)}
            placeholder="Опишіть суть проблеми..."
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                fontFamily: F_BODY,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setReportOpen(false)}
            sx={{ fontFamily: F_BODY, color: "#64748b", textTransform: "none" }}
          >
            Скасувати
          </Button>
          <Button
            onClick={handleSendReport}
            variant="contained"
            color="error"
            disabled={isSubmittingReport}
            sx={{
              fontFamily: F_BODY,
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "10px",
            }}
          >
            {isSubmittingReport ? "Надсилання..." : "Подати скаргу"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
