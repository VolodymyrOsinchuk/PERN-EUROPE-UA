// import {
//   Button,
//   Typography,
//   Container,
//   Card,
//   CardContent,
//   CardActions,
//   TextField,
//   Chip,
//   IconButton,
// } from "@mui/material";
// import Grid from "@mui/material/Grid";
// import "../assets/css/publications.css";
// import { HeroSection } from "../components";
// const Publications = () => {
//   const categories = [
//     "Всі публікації",
//     "Документи",
//     "Робота",
//     "Житло",
//     "Освіта",
//     "Медицина",
//     "Культура",
//     "Інтеграція",
//   ];

//   const articles = [
//     {
//       title: "Як отримати дозвіл на проживання в Німеччині",
//       category: "Документи",
//       date: "15.10.2023",
//       author: "Марія Петренко",
//       image: "https://example.com/germany-residence.jpg",
//       description:
//         "Покроковий гід з отримання дозволу на проживання в Німеччині: необхідні документи, терміни та особливості процесу.",
//       readTime: "12 хв",
//     },
//     {
//       title: "ТОП-10 сайтів для пошуку роботи в Польщі",
//       category: "Робота",
//       date: "12.10.2023",
//       author: "Олександр Коваленко",
//       image: "https://example.com/work-search.jpg",
//       description:
//         "Огляд найефективніших платформ для пошуку роботи в Польщі. Поради щодо створення резюме та проходження співбесід.",
//       readTime: "8 хв",
//     },
//     {
//       title: "Медичне страхування в країнах ЄС",
//       category: "Медицина",
//       date: "10.10.2023",
//       author: "Ірина Василенко",
//       image: "https://example.com/healthcare.jpg",
//       description:
//         "Все про системи охорони здоров'я в різних країнах ЄС, види страховок та як ними користуватися.",
//       readTime: "15 хв",
//     },
//     {
//       title: "Освіта за кордоном: можливості для українських студентів",
//       category: "Освіта",
//       date: "08.10.2023",
//       author: "Павло Мельник",
//       image: "https://example.com/education.jpg",
//       description:
//         "Огляд стипендіальних програм, грантів та можливостей навчання для українських студентів в європейських університетах.",
//       readTime: "10 хв",
//     },
//   ];
//   return (
//     <>
//       <HeroSection
//         title="Публікації"
//         typedStrings={["Корисні статті"]}
//         subtitle="Корисні статті, дослідження та матеріали про життя українців у Європі"
//         buttonText="Читати статті"
//         buttonLink="/публікації"
//         textAlign="left"
//       />
//       <Container style={{ marginTop: "30px", marginBottom: "50px" }}>
//         <Typography textAlign="center" variant="h4" gutterBottom>
//           Публікації
//         </Typography>

//         <div className="search-bar">
//           <Grid container spacing={2} alignItems="center">
//             <Grid size={{ xs: 12, md: 6 }}>
//               <TextField
//                 fullWidth
//                 label="Пошук публікацій"
//                 variant="outlined"
//                 size="small"
//                 InputProps={{
//                   startAdornment: (
//                     <span
//                       className="material-icons"
//                       style={{ marginRight: "8px" }}
//                     >
//                       search
//                     </span>
//                   ),
//                 }}
//               />
//             </Grid>
//             <Grid size={{ xs: 12 }}>
//               <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//                 {categories.map((category) => (
//                   <Chip
//                     key={category}
//                     label={category}
//                     clickable
//                     className="category-chip"
//                     color={
//                       category === "Всі публікації" ? "primary" : "default"
//                     }
//                   />
//                 ))}
//               </div>
//             </Grid>
//           </Grid>
//         </div>

//         <Grid container spacing={3}>
//           {articles.map((article, index) => (
//             <Grid size={{ xs: 12, md: 6 }} key={index}>
//               <Card className="article-card">
//                 <CardContent>
//                   <Typography color="textSecondary" gutterBottom>
//                     {article.date} · {article.readTime} читання
//                   </Typography>
//                   <Typography variant="h5" component="h2" gutterBottom>
//                     {article.title}
//                   </Typography>
//                   <Typography color="textSecondary" gutterBottom>
//                     Автор: {article.author}
//                   </Typography>
//                   <Chip
//                     label={article.category}
//                     size="small"
//                     style={{ marginBottom: "12px" }}
//                   />
//                   <Typography variant="body2" component="p">
//                     {article.description}
//                   </Typography>
//                 </CardContent>
//                 <CardActions>
//                   <Button size="small" color="primary">
//                     Читати далі
//                   </Button>
//                   <IconButton size="small">
//                     <span className="material-icons">bookmark_border</span>
//                   </IconButton>
//                   <IconButton size="small">
//                     <span className="material-icons">share</span>
//                   </IconButton>
//                 </CardActions>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>

//         <div style={{ textAlign: "center", marginTop: "40px" }}>
//           <Button variant="outlined" color="primary">
//             Завантажити більше
//           </Button>
//         </div>
//       </Container>
//     </>
//   );
// };
// export default Publications;
import {
  Box,
  Button,
  Container,
  Card,
  CardContent,
  CardActions,
  TextField,
  Chip,
  Typography,
  Grid,
  InputAdornment,
} from "@mui/material";
import { HeroSection } from "../components";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useState } from "react";

const fontBody = "'Plus Jakarta Sans', sans-serif";
const fontDisplay = "'Playfair Display', serif";

const CATEGORIES = [
  "Всі публікації",
  "Документи",
  "Робота",
  "Житло",
  "Освіта",
  "Медицина",
  "Культура",
  "Інтеграція",
];

const CAT_COLORS = {
  Документи: { bg: "#eff6ff", text: "#1d4ed8" },
  Робота: { bg: "#ecfdf5", text: "#065f46" },
  Житло: { bg: "#fff7ed", text: "#9a3412" },
  Освіта: { bg: "#f5f3ff", text: "#6d28d9" },
  Медицина: { bg: "#fff1f2", text: "#be123c" },
  Культура: { bg: "#fdf4ff", text: "#7e22ce" },
  Інтеграція: { bg: "#f0fdf4", text: "#166534" },
};

const ARTICLES = [
  {
    id: 1,
    title: "Як отримати дозвіл на проживання в Німеччині",
    category: "Документи",
    date: "15.10.2023",
    author: "Марія Петренко",
    description:
      "Покроковий гід з отримання дозволу на проживання: документи, терміни та особливості.",
    readTime: "12 хв",
  },
  {
    id: 2,
    title: "ТОП-10 сайтів для пошуку роботи в Польщі",
    category: "Робота",
    date: "12.10.2023",
    author: "Олександр Коваленко",
    description:
      "Огляд найефективніших платформ для пошуку роботи в Польщі та поради для резюме.",
    readTime: "8 хв",
  },
  {
    id: 3,
    title: "Медичне страхування в країнах ЄС",
    category: "Медицина",
    date: "10.10.2023",
    author: "Ірина Василенко",
    description:
      "Все про системи охорони здоров'я, види страховок та як ними користуватися.",
    readTime: "15 хв",
  },
  {
    id: 4,
    title: "Освіта за кордоном: можливості для студентів",
    category: "Освіта",
    date: "08.10.2023",
    author: "Павло Мельник",
    description:
      "Огляд стипендіальних програм та грантів для українських студентів в ЄС.",
    readTime: "10 хв",
  },
  {
    id: 5,
    title: "Оренда житла в Чехії: на що звернути увагу",
    category: "Житло",
    date: "05.10.2023",
    author: "Тетяна Бондар",
    description:
      "Практичні поради щодо пошуку та оренди квартири в Чехії для новоприбулих.",
    readTime: "9 хв",
  },
  {
    id: 6,
    title: "Інтеграція в суспільство: перший рік",
    category: "Інтеграція",
    date: "01.10.2023",
    author: "Андрій Лисенко",
    description:
      "Особистий досвід та практичні поради щодо адаптації до нової країни.",
    readTime: "11 хв",
  },
];

export default function Publications() {
  const [selectedCat, setSelectedCat] = useState("Всі публікації");
  const [search, setSearch] = useState("");

  const filtered = ARTICLES.filter((a) => {
    const matchCat =
      selectedCat === "Всі публікації" || a.category === selectedCat;
    const matchSearch =
      !search || a.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <HeroSection
        title="Публікації"
        typedStrings={["Корисні статті"]}
        subtitle="Дослідження та матеріали про життя українців у Європі"
        size="sm"
      />

      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          {/* ── Search + filters ── */}
          <Box
            sx={{
              bgcolor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "20px",
              p: { xs: 2.5, md: 3 },
              mb: 5,
              boxShadow: "0 2px 16px rgba(0,87,184,.05)",
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Пошук публікацій..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                mb: 2.5,
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
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {CATEGORIES.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  clickable
                  onClick={() => setSelectedCat(cat)}
                  sx={{
                    fontFamily: fontBody,
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    borderRadius: "10px",
                    bgcolor: selectedCat === cat ? "#0057B8" : "#f1f5f9",
                    color: selectedCat === cat ? "#fff" : "#64748b",
                    border: selectedCat === cat ? "none" : "1px solid #e2e8f0",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: selectedCat === cat ? "#003d82" : "#e8f0fc",
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* ── Results count ── */}
          <Typography
            sx={{
              fontFamily: fontBody,
              fontSize: "0.875rem",
              color: "#64748b",
              mb: 3,
              fontWeight: 500,
            }}
          >
            {filtered.length} публікацій знайдено
          </Typography>

          {/* ── Cards grid ── */}
          <Grid container spacing={3}>
            {filtered.map((article, i) => {
              const clr = CAT_COLORS[article.category] || {
                bg: "#f1f5f9",
                text: "#475569",
              };
              return (
                <Grid
                  item
                  xs={12}
                  md={6}
                  key={article.id}
                  sx={{
                    animation: "fadeUp 0.5s ease both",
                    animationDelay: `${(i % 4) * 0.08}s`,
                    "@keyframes fadeUp": {
                      from: { opacity: 0, transform: "translateY(20px)" },
                      to: { opacity: 1, transform: "translateY(0)" },
                    },
                  }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "18px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 1px 4px rgba(0,0,0,.04)",
                      transition: "transform 0.25s ease, box-shadow 0.25s ease",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 40px rgba(0,87,184,.1)",
                      },
                    }}
                  >
                    {/* Top color bar */}
                    <Box sx={{ height: 4, bgcolor: clr.text, opacity: 0.5 }} />

                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Chip
                          label={article.category}
                          size="small"
                          sx={{
                            bgcolor: clr.bg,
                            color: clr.text,
                            fontFamily: fontBody,
                            fontWeight: 700,
                            fontSize: "0.72rem",
                          }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <AccessTimeIcon
                            sx={{ fontSize: 12, color: "#94a3b8" }}
                          />
                          <Typography
                            sx={{
                              fontFamily: fontBody,
                              fontSize: "0.72rem",
                              color: "#94a3b8",
                            }}
                          >
                            {article.readTime}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography
                        sx={{
                          fontFamily: fontDisplay,
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          color: "#0f172a",
                          lineHeight: 1.35,
                          mb: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {article.title}
                      </Typography>

                      <Typography
                        sx={{
                          fontFamily: fontBody,
                          fontSize: "0.875rem",
                          color: "#64748b",
                          lineHeight: 1.7,
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {article.description}
                      </Typography>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            bgcolor: clr.bg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              color: clr.text,
                            }}
                          >
                            {article.author
                              .split(" ")
                              .map((w) => w[0])
                              .join("")
                              .slice(0, 2)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              fontFamily: fontBody,
                              fontWeight: 600,
                              fontSize: "0.8rem",
                              color: "#334155",
                            }}
                          >
                            {article.author}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: fontBody,
                              fontSize: "0.72rem",
                              color: "#94a3b8",
                            }}
                          >
                            {article.date}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>

                    <CardActions
                      sx={{
                        px: 3,
                        pb: 2.5,
                        pt: 0,
                        justifyContent: "space-between",
                      }}
                    >
                      <Button
                        size="small"
                        endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                        sx={{
                          fontFamily: fontBody,
                          fontWeight: 700,
                          textTransform: "none",
                          color: "#0057B8",
                          fontSize: "0.8rem",
                          p: 0,
                          "&:hover": {
                            bgcolor: "transparent",
                            textDecoration: "underline",
                          },
                        }}
                      >
                        Читати далі
                      </Button>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Button
                          size="small"
                          startIcon={
                            <BookmarkBorderIcon sx={{ fontSize: 14 }} />
                          }
                          sx={{
                            fontFamily: fontBody,
                            fontWeight: 500,
                            textTransform: "none",
                            color: "#94a3b8",
                            fontSize: "0.75rem",
                            minWidth: "auto",
                            p: "4px 8px",
                            "&:hover": { color: "#0057B8" },
                          }}
                        >
                          Зберегти
                        </Button>
                        <Button
                          size="small"
                          startIcon={
                            <span
                              className="material-icons"
                              style={{ fontSize: 14 }}
                            >
                              share
                            </span>
                          }
                          sx={{
                            fontFamily: fontBody,
                            fontWeight: 500,
                            textTransform: "none",
                            color: "#94a3b8",
                            fontSize: "0.75rem",
                            minWidth: "auto",
                            p: "4px 8px",
                            "&:hover": { color: "#0057B8" },
                          }}
                        >
                          Поділитися
                        </Button>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {filtered.length === 0 && (
            <Box sx={{ textAlign: "center", py: 10 }}>
              <Typography
                sx={{
                  fontFamily: fontDisplay,
                  fontSize: "1.4rem",
                  color: "#94a3b8",
                  mb: 1,
                }}
              >
                Публікацій не знайдено
              </Typography>
              <Typography
                sx={{
                  fontFamily: fontBody,
                  fontSize: "0.875rem",
                  color: "#cbd5e1",
                }}
              >
                Спробуйте змінити запит або категорію
              </Typography>
            </Box>
          )}

          {/* ── Load more ── */}
          {filtered.length > 0 && (
            <Box sx={{ textAlign: "center", mt: 6 }}>
              <Button
                variant="outlined"
                sx={{
                  fontFamily: fontBody,
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: "12px",
                  px: 4,
                  py: 1.4,
                  fontSize: "0.9rem",
                  borderColor: "#e2e8f0",
                  color: "#334155",
                  "&:hover": {
                    borderColor: "#0057B8",
                    color: "#0057B8",
                    bgcolor: "rgba(0,87,184,.04)",
                  },
                }}
              >
                Завантажити більше
              </Button>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}