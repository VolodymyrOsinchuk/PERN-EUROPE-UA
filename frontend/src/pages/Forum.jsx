// import { Fragment } from "react";
// import { HeroSection } from "../components";
// import {
//   Button,
//   Card,
//   CardActions,
//   CardContent,
//   Chip,
//   Container,
//   Divider,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Paper,
//   TextField,
//   Typography,
// } from "@mui/material";
// import Grid from "@mui/material/Grid";
// import "../assets/css/forum.css";
// const Forum = (props) => {
//   const categories = [
//     {
//       title: "Працевлаштування",
//       description: "Пошук роботи, резюме, вакансії та поради",
//       icon: "work",
//       topics: 156,
//       posts: 1205,
//     },
//     {
//       title: "Документи та легалізація",
//       description: "Візи, дозволи на проживання, громадянство",
//       icon: "description",
//       topics: 234,
//       posts: 1876,
//     },
//     {
//       title: "Житло",
//       description: "Оренда, купівля нерухомості, пошук співмешканців",
//       icon: "home",
//       topics: 189,
//       posts: 945,
//     },
//     {
//       title: "Освіта",
//       description: "Навчання, курси, визнання дипломів",
//       icon: "school",
//       topics: 145,
//       posts: 678,
//     },
//     {
//       title: "Здоров'я",
//       description: "Медичне обслуговування, страхування",
//       icon: "local_hospital",
//       topics: 98,
//       posts: 432,
//     },
//     {
//       title: "Спільнота",
//       description: "Зустрічі, заходи, знайомства",
//       icon: "groups",
//       topics: 267,
//       posts: 1543,
//     },
//   ];

//   const recentTopics = [
//     {
//       title: "Як знайти роботу IT-спеціалісту в Німеччині?",
//       author: "Олександр",
//       replies: 23,
//       views: 456,
//       category: "Працевлаштування",
//       lastUpdate: "15 хв тому",
//     },
//     {
//       title: "Оренда квартири в Празі: на що звернути увагу",
//       author: "Марія",
//       replies: 45,
//       views: 789,
//       category: "Житло",
//       lastUpdate: "1 год тому",
//     },
//     {
//       title: "Досвід отримання Blue Card в Нідерландах",
//       author: "Петро",
//       replies: 34,
//       views: 567,
//       category: "Документи та легалізація",
//       lastUpdate: "3 год тому",
//     },
//   ];
//   return (
//     <>
//       <HeroSection
//         title="Форум"
//         typedStrings={["Простір для спілкування"]}
//         subtitle="Простір для спілкування, обміну досвідом та підтримки"
//         buttonText="Приєднатися до дискусії"
//         buttonLink="/forum"
//         textAlign="left"
//       />
//       <Container style={{ marginTop: "30px", marginBottom: "50px" }}>
//         <Paper elevation={0} style={{ padding: "20px", marginBottom: "30px" }}>
//           <Grid  container spacing={3} alignItems="center">
//             <Grid  size={{ xs: 12, md: 8 }}>
//               <Typography variant="h4" gutterBottom>
//                 Форум спільноти
//               </Typography>
//               <Typography variant="body1" color="textSecondary">
//                 Обговорюйте важливі теми, діліться досвідом та знаходьте
//                 відповіді на свої запитання
//               </Typography>
//             </Grid>
//             <Grid  size={{ xs: 12, md: 4 }} style={{ textAlign: "right" }}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 startIcon={<span className="material-icons">add</span>}
//               >
//                 Створити нову тему
//               </Button>
//             </Grid>
//           </Grid>

//           <TextField
//             fullWidth
//             variant="outlined"
//             placeholder="Пошук по форуму..."
//             style={{ marginTop: "20px" }}
//             InputProps={{
//               startAdornment: (
//                 <span
//                   className="material-icons"
//                   style={{ marginRight: "8px", color: "#666" }}
//                 >
//                   search
//                 </span>
//               ),
//             }}
//           />
//         </Paper>

//         <Grid  container spacing={4}>
//           <Grid  size={{ xs: 12, md: 8 }}>
//             <Typography variant="h5" gutterBottom>
//               Категорії форуму
//             </Typography>
//             <Paper elevation={1}>
//               <List>
//                 {categories.map((category, index) => (
//                   <Fragment key={category.title}>
//                     <ListItem className="forum-category">
//                       <ListItemIcon>
//                         <span
//                           className="material-icons"
//                           style={{ color: "#1976d2" }}
//                         >
//                           {category.icon}
//                         </span>
//                       </ListItemIcon>
//                       <ListItemText
//                         primary={category.title}
//                         secondary={category.description}
//                       />
//                       <div>
//                         <Typography variant="body2" color="textSecondary">
//                           Тем: {category.topics}
//                         </Typography>
//                         <Typography variant="body2" color="textSecondary">
//                           Повідомлень: {category.posts}
//                         </Typography>
//                       </div>
//                     </ListItem>
//                     {index < categories.length - 1 && <Divider />}
//                   </Fragment>
//                 ))}
//               </List>
//             </Paper>
//           </Grid>

//           <Grid  size={{ xs: 12, md: 4 }}>
//             <Typography variant="h5" gutterBottom>
//               Останні обговорення
//             </Typography>
//             {recentTopics.map((topic) => (
//               <Card
//                 key={topic.title}
//                 className="topic-card"
//                 style={{ marginBottom: "15px" }}
//               >
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom>
//                     {topic.title}
//                   </Typography>
//                   <Typography variant="body2" color="textSecondary">
//                     Автор: {topic.author}
//                   </Typography>
//                   <div style={{ marginTop: "10px" }}>
//                     <Chip
//                       label={topic.category}
//                       size="small"
//                       style={{ marginRight: "10px" }}
//                     />
//                     <Chip
//                       icon={<span className="material-icons">forum</span>}
//                       label={`${topic.replies} відповідей`}
//                       size="small"
//                       style={{ marginRight: "10px" }}
//                     />
//                     <Chip
//                       icon={<span className="material-icons">visibility</span>}
//                       label={`${topic.views} переглядів`}
//                       size="small"
//                     />
//                   </div>
//                 </CardContent>
//                 <CardActions>
//                   <Typography variant="caption" color="textSecondary">
//                     Оновлено: {topic.lastUpdate}
//                   </Typography>
//                 </CardActions>
//               </Card>
//             ))}
//           </Grid>
//         </Grid>
//       </Container>
//     </>
//   );
// };
// export default Forum;
import { Fragment } from "react";
import { HeroSection } from "../components";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
  Grid,
  InputAdornment,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useLoaderData, Form } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

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

const CATEGORIES = [
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

const RECENT_TOPICS = [
  {
    title: "Як знайти роботу IT-спеціалісту в Німеччині?",
    author: "Олександр",
    replies: 23,
    views: 456,
    category: "Працевлаштування",
    lastUpdate: "15 хв тому",
    avatar: "О",
  },
  {
    title: "Оренда квартири в Празі: на що звернути увагу",
    author: "Марія",
    replies: 45,
    views: 789,
    category: "Житло",
    lastUpdate: "1 год тому",
    avatar: "М",
  },
  {
    title: "Досвід отримання Blue Card в Нідерландах",
    author: "Петро",
    replies: 34,
    views: 567,
    category: "Документи та легалізація",
    lastUpdate: "3 год тому",
    avatar: "П",
  },
  {
    title: "Безкоштовні курси польської мови онлайн",
    author: "Наталія",
    replies: 18,
    views: 312,
    category: "Освіта",
    lastUpdate: "5 год тому",
    avatar: "Н",
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
    toast.error(error?.response?.data?.message || "Не вдалося завантажити теми форуму");
    return [];
  }
}

export async function action({ request }) {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");
  const category = formData.get("category");

  try {
    const { data } = await customFetch.post("/forum", { title, content, category });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error?.response?.data?.message || "Помилка створення теми" };
  }
}

export default function Forum() { const topics = useLoaderData() || [];
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

      {/* ── Stats strip ── */}
      <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #f1f5f9", py: 3 }}>
        <Container maxWidth="lg">
          <Grid  container spacing={0} justifyContent="center">
            {FORUM_STATS.map((s, i) => (
              <Grid size={{ xs: 6, sm: 3 }} key={s.label}
                sx={{
                  textAlign: "center",
                  py: 1,
                  borderRight:
                    i < FORUM_STATS.length - 1
                      ? { sm: "1px solid #f1f5f9" }
                      : "none",
                }}>
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
          {/* ── Header + search ── */}
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
            <Button
              variant="contained"
              startIcon={<AddIcon />}
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

          <Grid  container spacing={4}>
            {/* ── Categories ── */}
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
                {CATEGORIES.map((cat, idx) => {
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
                      {idx < CATEGORIES.length - 1 && (
                        <Divider sx={{ borderColor: "#f1f5f9" }} />
                      )}
                    </Fragment>
                  );
                })}
              </Paper>
            </Grid>

            {/* ── Recent topics ── */}
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
                {topics.map((topic) => {
                  const cfg = CAT_ICONS_COLOR[topic.category] || {
                    color: "#64748b",
                    bg: "#f1f5f9",
                  };
                  return (
                    <Card
                      key={topic.title}
                      sx={{
                        borderRadius: "16px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 1px 4px rgba(0,0,0,.04)",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        cursor: "pointer",
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
                            {topic.avatar}
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
                              {topic.author} · {topic.lastUpdate}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
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
                          <Chip
                            label={`${topic.replies} відповідей`}
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
                            label={`${topic.views} переглядів`}
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
                })}
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
    </>
  );
}