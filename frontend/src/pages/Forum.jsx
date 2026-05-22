import { Fragment, useState } from "react";
import { HeroSection } from "../components";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Grid,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Form, useLoaderData, useNavigation, Link } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { useAuthContext } from "../context/AuthContext";

const fontBody = "'Plus Jakarta Sans', sans-serif";
const fontDisplay = "'Playfair Display', serif";

const CAT_ICONS_COLOR = {
  Працевлаштування: { icon: "work", color: "#0057B8", bg: "#eff6ff" },
  "Документи та легалізація": {
    icon: "description",
    color: "#6d28d9",
    bg: "#f5f3ff",
  },
  Житло: { icon: "home", color: "#065f46", bg: "#ecfdf5" },
  Освіта: { icon: "school", color: "#9a3412", bg: "#fff7ed" },
  "Здоров'я": { icon: "local_hospital", color: "#be123c", bg: "#fff1f2" },
  Спільнота: { icon: "groups", color: "#7e22ce", bg: "#fdf4ff" },
};

const CATEGORIES_LIST = [
  {
    title: "Працевлаштування",
    description: "Пошук роботи, резюме, вакансії та поради",
    topics: 156,
    posts: 1205,
  },
  {
    title: "Документи та легалізація",
    description: "Візи, дозволи на проживання, громадянство",
    topics: 234,
    posts: 1876,
  },
  {
    title: "Житло",
    description: "Оренда, купівля нерухомості, пошук співмешканців",
    topics: 189,
    posts: 945,
  },
  {
    title: "Освіта",
    description: "Навчання, курси, визнання дипломів",
    topics: 145,
    posts: 678,
  },
  {
    title: "Здоров'я",
    description: "Медичне обслуговування, страхування",
    topics: 98,
    posts: 432,
  },
  {
    title: "Спільнота",
    description: "Зустрічі, заходи, знайомства",
    topics: 267,
    posts: 1543,
  },
];

const FORUM_STATS = [
  { value: "1 089", label: "Теми", icon: "forum" },
  { value: "6 679", label: "Повідомлень", icon: "chat_bubble" },
  { value: "2 400+", label: "Учасників", icon: "people" },
  { value: "24/7", label: "Підтримка", icon: "support_agent" },
];

export async function loader() {
  try {
    const { data } = await customFetch.get("/forum");
    return data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Не вдалося завантажити теми форуму",
    );
    return [];
  }
}

export async function action({ request }) {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");
  const category = formData.get("category");
  try {
    const { data } = await customFetch.post("/forum", {
      title,
      content,
      category,
    });
    toast.success("Тему створено!");
    return { success: true, data };
  } catch (error) {
    toast.error(error?.response?.data?.message || "Помилка створення теми");
    return {
      success: false,
      message: error?.response?.data?.message || "Помилка",
    };
  }
}

export default function Forum() {
  const topics = useLoaderData() || [];
  const navigation = useNavigation();
  const { user } = useAuthContext();
  const isSubmitting = navigation.state === "submitting";

  const [createOpen, setCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenCreate = () => {
    if (!user) {
      toast.warning("Увійдіть в акаунт, щоб створити тему");
      return;
    }
    setCreateOpen(true);
  };

  const filteredTopics = topics.filter(
    (t) =>
      !searchQuery ||
      t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <HeroSection
        title="Форум спільноти"
        typedStrings={["Простір для спілкування"]}
        subtitle="Обговорення, обмін досвідом та підтримка від людей, які пройшли той самий шлях"
        buttonText="Створити тему"
        buttonLink="/forum"
        size="sm"
      />

      {/* Stats strip */}
      <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #f1f5f9", py: 3 }}>
        <Container maxWidth="lg">
          <Grid container spacing={0} justifyContent="center">
            {FORUM_STATS.map((s, i) => (
              <Grid
                key={s.label}
                size={{ xs: 6, sm: 3 }}
                sx={{
                  textAlign: "center",
                  py: 1,
                  borderRight:
                    i < FORUM_STATS.length - 1
                      ? { sm: "1px solid #f1f5f9" }
                      : "none",
                }}
              >
                <span
                  className="material-icons"
                  style={{
                    fontSize: 20,
                    color: "#0057B8",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  {s.icon}
                </span>
                <Typography
                  sx={{
                    fontFamily: fontDisplay,
                    fontWeight: 700,
                    fontSize: "1.4rem",
                    color: "#0f172a",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.value}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: fontBody,
                    fontSize: "0.75rem",
                    color: "#64748b",
                    fontWeight: 500,
                  }}
                >
                  {s.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "#f8fafc" }}>
        <Container maxWidth="lg">
          {/* Header + search */}
          <Box
            sx={{
              bgcolor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "20px",
              p: { xs: 2.5, md: 3 },
              mb: 5,
              boxShadow: "0 2px 16px rgba(0,87,184,.05)",
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <TextField
              placeholder="Пошук по форуму..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flex: "1 1 280px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontFamily: fontBody,
                  bgcolor: "#f8fafc",
                  "&:hover fieldset": { borderColor: "#0057B8" },
                  "&.Mui-focused fieldset": { borderColor: "#0057B8" },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              }}
            />
            {/* Bouton "Нова тема" — ouvre le Dialog si connecté */}
            <Button
              variant="contained"
              startIcon={
                user ? <AddIcon /> : <LockOutlinedIcon sx={{ fontSize: 16 }} />
              }
              onClick={handleOpenCreate}
              sx={{
                fontFamily: fontBody,
                fontWeight: 700,
                textTransform: "none",
                bgcolor: "#0057B8",
                borderRadius: "12px",
                px: 2.5,
                boxShadow: "0 4px 12px rgba(0,87,184,.3)",
                "&:hover": { bgcolor: "#003d82" },
                flexShrink: 0,
              }}
            >
              Нова тема
            </Button>
          </Box>

          <Grid container spacing={4}>
            {/* Categories */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    fontFamily: fontBody,
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#0057B8",
                    mb: 0.5,
                  }}
                >
                  Розділи
                </Typography>
                <Typography
                  sx={{
                    fontFamily: fontDisplay,
                    fontWeight: 700,
                    fontSize: "1.6rem",
                    color: "#0f172a",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Категорії форуму
                </Typography>
                <Box
                  sx={{
                    width: 40,
                    height: 3,
                    background: "linear-gradient(90deg, #0057B8, #FFD700)",
                    borderRadius: "99px",
                    mt: 1,
                  }}
                />
              </Box>

              <Paper
                elevation={0}
                sx={{
                  borderRadius: "18px",
                  border: "1px solid #e2e8f0",
                  overflow: "hidden",
                }}
              >
                {CATEGORIES_LIST.map((cat, idx) => {
                  const cfg = CAT_ICONS_COLOR[cat.title] || {
                    icon: "folder",
                    color: "#64748b",
                    bg: "#f1f5f9",
                  };
                  return (
                    <Fragment key={cat.title}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          px: 3,
                          py: 2.5,
                          cursor: "pointer",
                          transition: "background 0.2s",
                          "&:hover": { bgcolor: "#f8fafc" },
                          "&:hover .cat-arrow": {
                            opacity: 1,
                            transform: "translateX(0)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "12px",
                            bgcolor: cfg.bg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <span
                            className="material-icons"
                            style={{ fontSize: 20, color: cfg.color }}
                          >
                            {cfg.icon}
                          </span>
                        </Box>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontFamily: fontBody,
                              fontWeight: 700,
                              fontSize: "0.95rem",
                              color: "#0f172a",
                              mb: 0.25,
                            }}
                          >
                            {cat.title}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: fontBody,
                              fontSize: "0.8rem",
                              color: "#64748b",
                              lineHeight: 1.4,
                            }}
                          >
                            {cat.description}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                          <Typography
                            sx={{
                              fontFamily: fontBody,
                              fontWeight: 700,
                              fontSize: "0.9rem",
                              color: "#0f172a",
                            }}
                          >
                            {cat.topics.toLocaleString()}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: fontBody,
                              fontSize: "0.72rem",
                              color: "#94a3b8",
                            }}
                          >
                            тем
                          </Typography>
                        </Box>
                        <ArrowForwardIcon
                          className="cat-arrow"
                          sx={{
                            fontSize: 18,
                            color: "#0057B8",
                            opacity: 0,
                            transform: "translateX(-4px)",
                            transition: "all 0.2s",
                            flexShrink: 0,
                          }}
                        />
                      </Box>
                      {idx < CATEGORIES_LIST.length - 1 && (
                        <Divider sx={{ borderColor: "#f1f5f9" }} />
                      )}
                    </Fragment>
                  );
                })}
              </Paper>
            </Grid>

            {/* Recent topics */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    fontFamily: fontBody,
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#0057B8",
                    mb: 0.5,
                  }}
                >
                  Активне
                </Typography>
                <Typography
                  sx={{
                    fontFamily: fontDisplay,
                    fontWeight: 700,
                    fontSize: "1.6rem",
                    color: "#0f172a",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Останні обговорення
                </Typography>
                <Box
                  sx={{
                    width: 40,
                    height: 3,
                    background: "linear-gradient(90deg, #0057B8, #FFD700)",
                    borderRadius: "99px",
                    mt: 1,
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {filteredTopics.length === 0 ? (
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: "16px",
                      border: "1px solid #e2e8f0",
                      p: 4,
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: fontBody,
                        fontSize: "0.875rem",
                        color: "#94a3b8",
                      }}
                    >
                      {searchQuery
                        ? "Нічого не знайдено"
                        : "Поки немає тем. Будьте першим!"}
                    </Typography>
                  </Paper>
                ) : (
                  filteredTopics.map((topic) => {
                    const cfg = CAT_ICONS_COLOR[topic.category] || {
                      color: "#64748b",
                      bg: "#f1f5f9",
                    };
                    const authorInitial = topic.author
                      ? topic.author[0].toUpperCase()
                      : "?";
                    return (
                      <Card
                        key={topic.id}
                        component={Link}
                        to={`/forum/${topic.id}`}
                        sx={{
                          borderRadius: "16px",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 1px 4px rgba(0,0,0,.04)",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          cursor: "pointer",
                          textDecoration: "none",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 24px rgba(0,87,184,.1)",
                          },
                        }}
                      >
                        <CardContent sx={{ p: 2.5 }}>
                          <Box sx={{ display: "flex", gap: 1.5, mb: 1.5 }}>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: cfg.bg,
                                color: cfg.color,
                                fontSize: "0.8rem",
                                fontWeight: 700,
                                flexShrink: 0,
                              }}
                            >
                              {authorInitial}
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                sx={{
                                  fontFamily: fontBody,
                                  fontWeight: 700,
                                  fontSize: "0.9rem",
                                  color: "#0f172a",
                                  lineHeight: 1.35,
                                  mb: 0.5,
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {topic.title}
                              </Typography>
                              <Typography
                                sx={{
                                  fontFamily: fontBody,
                                  fontSize: "0.75rem",
                                  color: "#94a3b8",
                                }}
                              >
                                {topic.author} ·{" "}
                                {new Date(
                                  topic.lastUpdate || topic.createdAt,
                                ).toLocaleDateString("uk-UA")}
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
                          >
                            {topic.category && (
                              <Chip
                                label={topic.category}
                                size="small"
                                sx={{
                                  bgcolor: cfg.bg,
                                  color: cfg.color,
                                  fontFamily: fontBody,
                                  fontWeight: 700,
                                  fontSize: "0.65rem",
                                }}
                              />
                            )}
                            <Chip
                              label={`${topic.replies ?? 0} відповідей`}
                              size="small"
                              sx={{
                                bgcolor: "#f1f5f9",
                                color: "#64748b",
                                fontFamily: fontBody,
                                fontWeight: 600,
                                fontSize: "0.65rem",
                              }}
                            />
                            <Chip
                              label={`${topic.views ?? 0} переглядів`}
                              size="small"
                              sx={{
                                bgcolor: "#f1f5f9",
                                color: "#64748b",
                                fontFamily: fontBody,
                                fontWeight: 600,
                                fontSize: "0.65rem",
                              }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </Box>

              <Button
                fullWidth
                variant="outlined"
                sx={{
                  mt: 2.5,
                  fontFamily: fontBody,
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: "12px",
                  borderColor: "#e2e8f0",
                  color: "#334155",
                  py: 1.2,
                  "&:hover": {
                    borderColor: "#0057B8",
                    color: "#0057B8",
                    bgcolor: "rgba(0,87,184,.04)",
                  },
                }}
              >
                Переглянути всі теми
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── Dialog de création de thème ── */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
      >
        <Form method="post" onSubmit={() => setCreateOpen(false)}>
          <DialogTitle
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: "1.3rem",
              pb: 1,
            }}
          >
            Нова тема
          </DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
          >
            <TextField
              autoFocus
              name="title"
              label="Заголовок теми"
              fullWidth
              required
              inputProps={{ minLength: 5, maxLength: 255 }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontFamily: fontBody,
                  bgcolor: "#f8fafc",
                  "&:hover fieldset": { borderColor: "#0057B8" },
                  "&.Mui-focused fieldset": { borderColor: "#0057B8" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#0057B8" },
              }}
            />
            <FormControl fullWidth>
              <InputLabel sx={{ fontFamily: fontBody }}>Категорія</InputLabel>
              <Select
                name="category"
                label="Категорія"
                defaultValue=""
                sx={{
                  borderRadius: "12px",
                  fontFamily: fontBody,
                  bgcolor: "#f8fafc",
                }}
              >
                {Object.keys(CAT_ICONS_COLOR).map((cat) => (
                  <MenuItem key={cat} value={cat} sx={{ fontFamily: fontBody }}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="content"
              label="Текст теми"
              fullWidth
              required
              multiline
              rows={5}
              inputProps={{ minLength: 10 }}
              placeholder="Опишіть вашу тему або питання..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontFamily: fontBody,
                  bgcolor: "#f8fafc",
                  "&:hover fieldset": { borderColor: "#0057B8" },
                  "&.Mui-focused fieldset": { borderColor: "#0057B8" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#0057B8" },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
            <Button
              onClick={() => setCreateOpen(false)}
              sx={{
                fontFamily: fontBody,
                fontWeight: 600,
                textTransform: "none",
                color: "#64748b",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
              }}
            >
              Скасувати
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                fontFamily: fontBody,
                fontWeight: 700,
                textTransform: "none",
                bgcolor: "#0057B8",
                borderRadius: "10px",
                px: 3,
                "&:hover": { bgcolor: "#003d82" },
              }}
            >
              {isSubmitting ? "Публікація..." : "Опублікувати тему"}
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
    </>
  );
}
