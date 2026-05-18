// import { useState } from "react";
// import { HeroSection } from "../components";
// import {
//   Button,
//   Card,
//   CardActions,
//   CardContent,
//   Chip,
//   CircularProgress,
//   Container,
//   InputAdornment,
//   Menu,
//   MenuItem,
//   TextField,
//   Typography,
// } from "@mui/material";
// import Grid from "@mui/material/Grid";
// import "../assets/css/news.css";

// const News = () => {
//   const [languageAnchor, setLanguageAnchor] = useState(null);
//   const [filterAnchor, setFilterAnchor] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [isLoading, setIsLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [newsItems, setNewsItems] = useState([
//     {
//       title: "Нова програма допомоги для українських біженців у Франції",
//       date: "15 Лис 2023",
//       category: "Соціальна допомога",
//       description: "Французький уряд запускає нову програму допомоги...",
//       importance: "high",
//     },
//     {
//       title: "Фестиваль української культури в Берліні",
//       date: "12 Лис 2023",
//       category: "Культура",
//       description: "Великий фестиваль української культури відбудеться...",
//       importance: "medium",
//     },
//     {
//       title: "Можливості працевлаштування для українців у Німеччині",
//       date: "10 Лис 2023",
//       category: "Робота",
//       description:
//         "Нові можливості працевлаштування в технологічному секторі...",
//       importance: "high",
//     },
//     {
//       title: "Безкоштовні мовні курси онлайн",
//       date: "8 Лис 2023",
//       category: "Освіта",
//       description: "Нова платформа пропонує безкоштовні мовні курси...",
//       importance: "medium",
//     },
//   ]);

//   const loadMoreNews = () => {
//     setIsLoading(true);
//     // Simulating API call
//     setTimeout(() => {
//       const newItems = [
//         {
//           title: "Нові правила перебування в ЄС",
//           date: "7 Лис 2023",
//           category: "Соціальна допомога",
//           description: "Важливі зміни у правилах перебування українців в ЄС...",
//           importance: "high",
//         },
//         {
//           title: "Українська школа відкривається у Варшаві",
//           date: "5 Лис 2023",
//           category: "Освіта",
//           description: "Нова українська школа починає роботу у Варшаві...",
//           importance: "medium",
//         },
//       ];
//       setNewsItems([...newsItems, ...newItems]);
//       setPage(page + 1);
//       setIsLoading(false);
//     }, 1500);
//   };

//   const handleLanguageClick = (event) => {
//     setLanguageAnchor(event.currentTarget);
//   };

//   const handleLanguageClose = () => {
//     setLanguageAnchor(null);
//   };

//   const handleFilterClick = (event) => {
//     setFilterAnchor(event.currentTarget);
//   };

//   const handleFilterClose = () => {
//     setFilterAnchor(null);
//   };

//   const getCategoryColor = (category) => {
//     const colors = {
//       "Соціальна допомога": "#f44336",
//       Культура: "#2196f3",
//       Робота: "#4caf50",
//       Освіта: "#ff9800",
//     };
//     return colors[category] || "#757575";
//   };

//   return (
//     <>
//       <HeroSection
//         title="Останні Новини"
//         typedStrings={["Актуальна інформація"]}
//         subtitle="Актуальна інформація для українців в Європі"
//         // backgroundImage="/path/to/news-background.jpg"
//         textColor="white"
//       />

//       <Container style={{ marginTop: "30px" }}>
//         <Grid container spacing={3}>
//           <Grid size={{ xs: 12 }}>
//             <Typography variant="h4" gutterBottom textAlign="center">
//               Новини
//             </Typography>
//             <Typography variant="subtitle1" gutterBottom color="textSecondary">
//               Будьте в курсі останніх новин про українську спільноту в Європі
//             </Typography>
//           </Grid>

//           <Grid size={{ xs: 12 }}>
//             <TextField
//               fullWidth
//               variant="outlined"
//               placeholder="Пошук новин..."
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <span className="material-icons">search</span>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Grid>

//           <Grid size={{ xs: 12 }}>
//             <Button
//               variant="outlined"
//               onClick={handleFilterClick}
//               startIcon={<span className="material-icons">filter_list</span>}
//             >
//               Фільтрувати за категорією
//             </Button>
//             <Menu
//               anchorEl={filterAnchor}
//               open={Boolean(filterAnchor)}
//               onClose={handleFilterClose}
//             >
//               <MenuItem onClick={() => setSelectedCategory("all")}>
//                 Всі категорії
//               </MenuItem>
//               <MenuItem
//                 onClick={() => setSelectedCategory("Соціальна допомога")}
//               >
//                 Соціальна допомога
//               </MenuItem>
//               <MenuItem onClick={() => setSelectedCategory("Культура")}>
//                 Культура
//               </MenuItem>
//               <MenuItem onClick={() => setSelectedCategory("Робота")}>
//                 Робота
//               </MenuItem>
//               <MenuItem onClick={() => setSelectedCategory("Освіта")}>
//                 Освіта
//               </MenuItem>
//             </Menu>
//           </Grid>

//           {newsItems.map((item, index) => (
//             <Grid size={{ xs: 12 }} key={index}>
//               <Card className="news-card">
//                 <CardContent>
//                   <Typography variant="h5" component="div" gutterBottom>
//                     {item.title}
//                   </Typography>
//                   <Chip
//                     label={item.category}
//                     style={{
//                       backgroundColor: getCategoryColor(item.category),
//                       color: "white",
//                       marginBottom: "10px",
//                     }}
//                   />
//                   <Typography variant="body2" color="text.secondary">
//                     {item.date}
//                   </Typography>
//                   <Typography variant="body1" style={{ marginTop: "10px" }}>
//                     {item.description}
//                   </Typography>
//                 </CardContent>
//                 <CardActions>
//                   <Button size="small" color="primary">
//                     Читати далі
//                   </Button>
//                   <Button
//                     size="small"
//                     startIcon={<span className="material-icons">share</span>}
//                   >
//                     Поділитися
//                   </Button>
//                 </CardActions>
//               </Card>
//             </Grid>
//           ))}

//           <Grid
//             size={{ xs: 12 }}
//             style={{ textAlign: "center", marginTop: "20px" }}
//           >
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={loadMoreNews}
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <>
//                   Завантаження...
//                   <CircularProgress
//                     size={20}
//                     color="inherit"
//                     className="loading-spinner"
//                   />
//                 </>
//               ) : (
//                 "Завантажити більше новин"
//               )}
//             </Button>
//           </Grid>
//         </Grid>
//       </Container>
//     </>
//   );
// };
// export default News;
import { useState } from "react";
import { HeroSection } from "../components";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  Container,
  InputAdornment,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const fontBody = "'Plus Jakarta Sans', sans-serif";
const fontDisplay = "'Playfair Display', serif";

const CATEGORIES = [
  { label: "Всі", key: "all" },
  { label: "Соціальна допомога", key: "Соціальна допомога" },
  { label: "Культура", key: "Культура" },
  { label: "Робота", key: "Робота" },
  { label: "Освіта", key: "Освіта" },
];

const CAT_COLORS = {
  "Соціальна допомога": { bg: "#fef2f2", text: "#991b1b" },
  Культура: { bg: "#f5f3ff", text: "#6d28d9" },
  Робота: { bg: "#ecfdf5", text: "#065f46" },
  Освіта: { bg: "#fff7ed", text: "#9a3412" },
};

const INITIAL_NEWS = [
  {
    id: 1,
    title: "Нова програма допомоги для українців у Франції",
    date: "15 Лис 2023",
    category: "Соціальна допомога",
    description:
      "Французький уряд запускає нову програму підтримки для переселенців.",
    importance: "high",
  },
  {
    id: 2,
    title: "Фестиваль української культури в Берліні",
    date: "12 Лис 2023",
    category: "Культура",
    description:
      "Великий фестиваль з концертами, виставками та майстер-класами.",
    importance: "medium",
  },
  {
    id: 3,
    title: "Нові можливості працевлаштування в Німеччині",
    date: "10 Лис 2023",
    category: "Робота",
    description: "IT-компанії активно шукають фахівців серед українців.",
    importance: "high",
  },
  {
    id: 4,
    title: "Безкоштовні мовні курси для діаспори",
    date: "8 Лис 2023",
    category: "Освіта",
    description: "Нова платформа пропонує безкоштовне навчання мовам ЄС.",
    importance: "medium",
  },
];

const NEW_ARTICLES = [
  {
    id: 5,
    title: "Нові правила перебування в ЄС",
    date: "7 Лис 2023",
    category: "Соціальна допомога",
    description: "Важливі зміни у правилах для тимчасового захисту.",
    importance: "high",
  },
  {
    id: 6,
    title: "Українська школа відкривається у Варшаві",
    date: "5 Лис 2023",
    category: "Освіта",
    description: "Нова українська школа з повною програмою навчання.",
    importance: "medium",
  },
];

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [news, setNews] = useState(INITIAL_NEWS);
  const [isLoading, setIsLoading] = useState(false);

  const filtered = news.filter((item) => {
    const matchCat =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchSearch =
      !search || item.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setNews((prev) => [...prev, ...NEW_ARTICLES]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <>
      <HeroSection
        title="Останні новини"
        typedStrings={["Актуальна інформація"]}
        subtitle="Будьте в курсі подій для украiнської спільноти в Європі"
        size="sm"
      />

      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          {/* ── Filter bar ── */}
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
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {/* Search */}
              <TextField
                placeholder="Пошук новин..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="small"
                sx={{
                  flex: { xs: "1 1 100%", sm: "1 1 280px" },
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

              {/* Category filters */}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {CATEGORIES.map((cat) => (
                  <Chip
                    key={cat.key}
                    label={cat.label}
                    clickable
                    onClick={() => setSelectedCategory(cat.key)}
                    sx={{
                      fontFamily: fontBody,
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      borderRadius: "10px",
                      bgcolor:
                        selectedCategory === cat.key ? "#0057B8" : "#f1f5f9",
                      color: selectedCategory === cat.key ? "#fff" : "#64748b",
                      border:
                        selectedCategory === cat.key
                          ? "none"
                          : "1px solid #e2e8f0",
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor:
                          selectedCategory === cat.key ? "#003d82" : "#e8f0fc",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          {/* ── Count ── */}
          <Typography
            sx={{
              fontFamily: fontBody,
              fontSize: "0.875rem",
              color: "#64748b",
              mb: 3,
              fontWeight: 500,
            }}
          >
            {filtered.length} новин знайдено
          </Typography>

          {/* ── News grid ── */}
          <Grid container spacing={3}>
            {filtered.map((item, i) => {
              const catClr = CAT_COLORS[item.category] || {
                bg: "#f1f5f9",
                text: "#475569",
              };
              return (
                <Grid
                  item
                  xs={12}
                  md={6}
                  key={item.id}
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
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 36px rgba(0,87,184,.1)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Chip
                          label={item.category}
                          size="small"
                          sx={{
                            bgcolor: catClr.bg,
                            color: catClr.text,
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
                          {item.importance === "high" && (
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                bgcolor: "#dc2626",
                              }}
                            />
                          )}
                          <Typography
                            sx={{
                              fontFamily: fontBody,
                              fontSize: "0.75rem",
                              color: "#94a3b8",
                            }}
                          >
                            {item.date}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography
                        sx={{
                          fontFamily: fontDisplay,
                          fontWeight: 700,
                          fontSize: "1.15rem",
                          color: "#0f172a",
                          lineHeight: 1.35,
                          mb: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: fontBody,
                          fontSize: "0.875rem",
                          color: "#64748b",
                          lineHeight: 1.7,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.description}
                      </Typography>
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
                          fontSize: "0.8rem",
                          "&:hover": {
                            color: "#64748b",
                            bgcolor: "transparent",
                          },
                        }}
                      >
                        Поділитися
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* ── Load more ── */}
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Button
              onClick={loadMore}
              disabled={isLoading}
              sx={{
                fontFamily: fontBody,
                fontWeight: 700,
                textTransform: "none",
                bgcolor: isLoading ? "#f1f5f9" : "#0057B8",
                color: isLoading ? "#94a3b8" : "#fff",
                borderRadius: "12px",
                px: 4,
                py: 1.4,
                fontSize: "0.9rem",
                boxShadow: isLoading ? "none" : "0 4px 14px rgba(0,87,184,.3)",
                "&:hover": { bgcolor: "#003d82" },
                transition: "all 0.25s ease",
              }}
            >
              {isLoading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <CircularProgress size={16} sx={{ color: "#94a3b8" }} />
                  Завантаження...
                </Box>
              ) : (
                "Завантажити більше новин"
              )}
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}
