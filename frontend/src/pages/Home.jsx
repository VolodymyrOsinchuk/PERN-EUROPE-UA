// import {
//   Typography,
//   Button,
//   Container,
//   Grid,
//   TextField,
//   Card,
//   CardContent,
//   CardActions,
//   Paper,
//   Box,
// } from "@mui/material";
// import { Link } from "react-router-dom";
// import { HeroSection, SectionsGrid } from "../components";
// import "../assets/css/home.css";

// // console.log("Environnement:", import.meta.env);

// // const apiUrl = import.meta.env.VITE_APP_API_URL;
// // console.log("🚀 ~ apiUrl:", apiUrl);
// // const isDebug = import.meta.env.VITE_APP_DEBUG === "true";
// // console.log("🚀 ~ isDebug :", isDebug);
// const Home = () => {
//   return (
//     <Box component="div">
//       <HeroSection
//         title="Українці в Європі"
//         typedStrings={["Українці в Європі"]}
//         subtitle="Ваш путівник у житті за кордоном"
//         buttonText="Приєднатися до спільноти"
//         buttonLink="/register"
//       />
//       <div className="search-section">
//         <Container maxWidth="lg">
//           <Grid container spacing={2} alignItems="center">
//             <Grid size={{ xs: 12, md: 8 }}>
//               <TextField
//                 fullWidth
//                 placeholder="Пошук послуг, подій або інформації..."
//                 variant="outlined"
//               />
//             </Grid>
//             <Grid size={{ xs: 12, md: 4 }}>
//               <Button variant="contained" color="primary" fullWidth>
//                 Пошук
//               </Button>
//             </Grid>
//           </Grid>
//         </Container>
//       </div>

//       <Container className="latest-posts">
//         <Typography variant="h4" className="section-title">
//           Основні категорії
//         </Typography>
//         <SectionsGrid />
//         {/* <Grid container spacing={4}>
//           <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//             <Card className="feature-card">
//               <CardContent>
//                 <div className="category-icon">
//                   <span className="material-icons">work</span>
//                 </div>
//                 <Typography variant="h6" gutterBottom>
//                   Робота
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Вакансії та можливості працевлаштування для українців
//                 </Typography>
//               </CardContent>
//               <CardActions>
//                 <Button size="small" color="primary">
//                   Детальніше
//                 </Button>
//               </CardActions>
//             </Card>
//           </Grid>

//           <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//             <Card className="feature-card">
//               <CardContent>
//                 <div className="category-icon">
//                   <span className="material-icons">school</span>
//                 </div>
//                 <Typography variant="h6" gutterBottom>
//                   Освіта
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Навчання, курси та освітні можливості
//                 </Typography>
//               </CardContent>
//               <CardActions>
//                 <Button size="small" color="primary">
//                   Детальніше
//                 </Button>
//               </CardActions>
//             </Card>
//           </Grid>

//           <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//             <Card className="feature-card">
//               <CardContent>
//                 <div className="category-icon">
//                   <span className="material-icons">home</span>
//                 </div>
//                 <Typography variant="h6" gutterBottom>
//                   Житло
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Оренда та пошук житла в різних країнах
//                 </Typography>
//               </CardContent>
//               <CardActions>
//                 <Button size="small" color="primary">
//                   Детальніше
//                 </Button>
//               </CardActions>
//             </Card>
//           </Grid>

//           <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//             <Card className="feature-card">
//               <CardContent>
//                 <div className="category-icon">
//                   <span className="material-icons">local_hospital</span>
//                 </div>
//                 <Typography variant="h6" gutterBottom>
//                   Медицина
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Медичні послуги та страхування
//                 </Typography>
//               </CardContent>
//               <CardActions>
//                 <Button size="small" color="primary">
//                   Детальніше
//                 </Button>
//               </CardActions>
//             </Card>
//           </Grid>
//         </Grid> */}
//       </Container>

//       <Container>
//         <Typography variant="h4" className="section-title">
//           Останні новини
//         </Typography>
//         <Grid container spacing={4}>
//           {[1, 2, 3].map((item) => (
//             <Grid size={{ xs: 12, md: 4 }} key={item}>
//               <Card className="news-card">
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom>
//                     Новина {item}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Короткий опис останніх подій та новин для української
//                     спільноти в Європі...
//                   </Typography>
//                 </CardContent>
//                 <CardActions>
//                   <Button size="small" color="primary">
//                     Читати більше
//                   </Button>
//                 </CardActions>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>

//         <Paper elevation={3} style={{ marginTop: "40px", padding: "20px" }}>
//           <Typography variant="h4" gutterBottom>
//             Про нас
//           </Typography>
//           <Typography variant="body1" paragraph>
//             "Українці в Європі" - це онлайн-платформа, створена для об'єднання
//             та підтримки української діаспори в європейських країнах. Наша мета
//             - допомогти українцям адаптуватися до життя за кордоном, зберігаючи
//             зв'язок з рідною культурою та традиціями.
//           </Typography>
//           <Typography variant="body1">
//             Ми пропонуємо актуальну інформацію, корисні ресурси та можливості
//             для спілкування, щоб зробити ваше життя в Європі комфортним та
//             насиченим.
//           </Typography>
//         </Paper>
//       </Container>
//     </Box>
//   );
// };

// export default Home;
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import { HeroSection } from "../components";
import { SectionsGrid } from "../components";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const STATS = [
  { value: "12 000+", label: "Українців", icon: "🇺🇦" },
  { value: "8", label: "Країн", icon: "🌍" },
  { value: "3 400+", label: "Оголошень", icon: "📋" },
  { value: "600+", label: "Подій", icon: "🎉" },
];

const NEWS_ITEMS = [
  {
    category: "Документи",
    catColor: { bg: "#eff6ff", text: "#1d4ed8" },
    date: "15 трав. 2025",
    title: "Нові правила перебування для українців в ЄС",
    excerpt: "Важливі зміни у законодавстві щодо тимчасового захисту.",
  },
  {
    category: "Робота",
    catColor: { bg: "#ecfdf5", text: "#065f46" },
    date: "12 трав. 2025",
    title: "Топ вакансії для IT-спеціалістів у Берліні",
    excerpt: "Огляд найактуальніших можливостей для технічних фахівців.",
  },
  {
    category: "Культура",
    catColor: { bg: "#fdf4ff", text: "#7e22ce" },
    date: "10 трав. 2025",
    title: "Великий фестиваль діаспори у Варшаві",
    excerpt: "Понад 5 000 учасників на найбільшій культурній події року.",
  },
];

const fontBody = "'Plus Jakarta Sans', sans-serif";
const fontDisplay = "'Playfair Display', serif";

export default function Home() {
  return (
    <Box>
      {/* ── HERO ── */}
      <HeroSection
        typedStrings={["Українці в Європі"]}
        subtitle="Ваш провідник у житті за кордоном — новини, оголошення, спільнота"
        buttonText="Приєднатися безкоштовно"
        buttonLink="/register"
        secondaryButtonText="Переглянути оголошення"
        secondaryButtonLink="/ads"
        badge="🇺🇦 Платформа для діаспори"
      />

      {/* ── Stats strip ── */}
      <Box
        sx={{
          bgcolor: "#fff",
          borderBottom: "1px solid #f1f5f9",
          py: { xs: 4, md: 5 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={0} justifyContent="center">
            {STATS.map((s, i) => (
              <Grid
                item
                xs={6}
                sm={3}
                key={s.label}
                sx={{
                  textAlign: "center",
                  py: 2,
                  px: 3,
                  borderRight:
                    i < STATS.length - 1 ? { sm: "1px solid #f1f5f9" } : "none",
                }}
              >
                <Typography sx={{ fontSize: "1.8rem", mb: 0.5 }}>
                  {s.icon}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: fontDisplay,
                    fontWeight: 700,
                    fontSize: { xs: "1.6rem", md: "2rem" },
                    color: "#0057B8",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.value}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: fontBody,
                    fontSize: "0.8rem",
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

      {/* ── Quick search ── */}
      <Box sx={{ bgcolor: "#f8fafc", py: { xs: 5, md: 7 } }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              fontFamily: fontBody,
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#0057B8",
              mb: 1.5,
            }}
          >
            Знайти потрібне
          </Typography>
          <Typography
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: { xs: "1.8rem", md: "2.5rem" },
              color: "#0f172a",
              letterSpacing: "-0.02em",
              mb: 4,
            }}
          >
            Все для вашого комфорту за кордоном
          </Typography>

          <Paper
            elevation={0}
            sx={{
              display: "flex",
              gap: 0,
              border: "1.5px solid #e2e8f0",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(0,87,184,.08)",
              bgcolor: "#fff",
            }}
          >
            <Box
              component="input"
              placeholder="Пошук послуг, подій або інформації..."
              sx={{
                flex: 1,
                border: "none",
                outline: "none",
                padding: "16px 20px",
                fontFamily: fontBody,
                fontSize: "0.95rem",
                color: "#0f172a",
                bgcolor: "transparent",
                "&::placeholder": { color: "#94a3b8" },
              }}
            />
            <Button
              sx={{
                fontFamily: fontBody,
                fontWeight: 700,
                textTransform: "none",
                bgcolor: "#0057B8",
                color: "#fff",
                borderRadius: 0,
                px: 3.5,
                fontSize: "0.9rem",
                flexShrink: 0,
                "&:hover": { bgcolor: "#003d82" },
              }}
            >
              Пошук
            </Button>
          </Paper>
        </Container>
      </Box>

      {/* ── Main sections ── */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 5 }}>
            <Typography
              sx={{
                fontFamily: fontBody,
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#0057B8",
                mb: 1,
              }}
            >
              Розділи
            </Typography>
            <Typography
              sx={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: { xs: "1.8rem", md: "2.4rem" },
                color: "#0f172a",
                letterSpacing: "-0.02em",
              }}
            >
              Основні категорії
            </Typography>
            <Box
              sx={{
                width: 48,
                height: 4,
                background: "linear-gradient(90deg, #0057B8, #FFD700)",
                borderRadius: "99px",
                mt: 1.5,
              }}
            />
          </Box>
          <SectionsGrid />
        </Container>
      </Box>

      {/* ── Latest news ── */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "#f8fafc" }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              mb: 5,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: fontBody,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#0057B8",
                  mb: 1,
                }}
              >
                Актуально
              </Typography>
              <Typography
                sx={{
                  fontFamily: fontDisplay,
                  fontWeight: 700,
                  fontSize: { xs: "1.8rem", md: "2.4rem" },
                  color: "#0f172a",
                  letterSpacing: "-0.02em",
                }}
              >
                Останні новини
              </Typography>
              <Box
                sx={{
                  width: 48,
                  height: 4,
                  background: "linear-gradient(90deg, #0057B8, #FFD700)",
                  borderRadius: "99px",
                  mt: 1.5,
                }}
              />
            </Box>
            <Button
              component={Link}
              to="/news"
              endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
              sx={{
                fontFamily: fontBody,
                fontWeight: 600,
                textTransform: "none",
                color: "#0057B8",
                fontSize: "0.9rem",
                "&:hover": { bgcolor: "rgba(0,87,184,.05)" },
              }}
            >
              Всі новини
            </Button>
          </Box>

          <Grid container spacing={3}>
            {NEWS_ITEMS.map((item, i) => (
              <Grid
                item
                xs={12}
                md={4}
                key={i}
                sx={{
                  animation: "fadeUp 0.5s ease both",
                  animationDelay: `${i * 0.1}s`,
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
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 4px rgba(0,0,0,.05)",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 40px rgba(0,0,0,.1)",
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
                          bgcolor: item.catColor.bg,
                          color: item.catColor.text,
                          fontFamily: fontBody,
                          fontWeight: 700,
                          fontSize: "0.72rem",
                        }}
                      />
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
                    <Typography
                      sx={{
                        fontFamily: fontDisplay,
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        color: "#0f172a",
                        lineHeight: 1.35,
                        mb: 1.5,
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
                      }}
                    >
                      {item.excerpt}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ px: 3, pb: 2.5, pt: 0 }}>
                    <Button
                      component={Link}
                      to="/news"
                      size="small"
                      endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                      sx={{
                        fontFamily: fontBody,
                        fontWeight: 600,
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
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CTA Banner ── */}
      <Box
        sx={{
          py: { xs: 7, md: 10 },
          background: "linear-gradient(135deg, #FFD700 0%, #f5c400 100%)",
          textAlign: "center",
        }}
      >
        <Container maxWidth="sm">
          <Typography
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 900,
              fontSize: { xs: "1.8rem", md: "2.4rem" },
              color: "#003d82",
              letterSpacing: "-0.02em",
              mb: 2,
            }}
          >
            Про нас
          </Typography>
          <Typography
            sx={{
              fontFamily: fontBody,
              fontSize: "1rem",
              color: "#003d82",
              opacity: 0.8,
              lineHeight: 1.7,
              mb: 4,
            }}
          >
            "Українці в Європі" — онлайн-платформа для об'єднання та підтримки
            української діаспори. Допомагаємо адаптуватися до життя за кордоном,
            зберігаючи зв'язок з рідною культурою.
          </Typography>
          <Button
            component={Link}
            to="/about"
            endIcon={<ArrowForwardIcon />}
            sx={{
              fontFamily: fontBody,
              fontWeight: 700,
              textTransform: "none",
              bgcolor: "#003d82",
              color: "#fff",
              borderRadius: "12px",
              px: 4,
              py: 1.5,
              fontSize: "0.95rem",
              boxShadow: "0 6px 20px rgba(0,61,130,.3)",
              "&:hover": {
                bgcolor: "#002255",
                transform: "translateY(-2px)",
                boxShadow: "0 10px 28px rgba(0,61,130,.4)",
              },
              transition: "all 0.25s ease",
            }}
          >
            Дізнатися більше
          </Button>
        </Container>
      </Box>
    </Box>
  );
}
