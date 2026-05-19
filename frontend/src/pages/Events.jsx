// import { useState } from "react";
// import { HeroSection } from "../components";
// import {
//   Button,
//   Card,
//   CardActions,
//   CardContent,
//   CardMedia,
//   Chip,
//   Container,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField,
//   Typography,
// } from "@mui/material";
// import Grid from "@mui/material/Grid";

// import "../assets/css/events.css";
// const Events = () => {
//   const [country, setCountry] = useState("");
//   const [eventType, setEventType] = useState("");

//   const events = [
//     {
//       title: "Українські вечорниці",
//       date: "2023-12-15",
//       location: "Берлін, Німеччина",
//       type: "Культурний захід",
//       image: "https://example.com/event1.jpg",
//       description:
//         "Традиційні українські вечорниці з піснями, танцями та смачними стравами",
//     },
//     {
//       title: "Виставка сучасного мистецтва",
//       date: "2023-12-20",
//       location: "Париж, Франція",
//       type: "Мистецтво",
//       image: "https://example.com/event2.jpg",
//       description: "Виставка робіт українських художників у Парижі",
//     },
//     {
//       title: "Різдвяний ярмарок",
//       date: "2023-12-25",
//       location: "Варшава, Польща",
//       type: "Фестиваль",
//       image: "https://example.com/event3.jpg",
//       description: "Традиційний український різдвяний ярмарок",
//     },
//     {
//       title: "Концерт української музики",
//       date: "2023-12-30",
//       location: "Прага, Чехія",
//       type: "Концерт",
//       image: "https://example.com/event4.jpg",
//       description:
//         "Виступ українських музикантів з класичними та сучасними творами",
//     },
//   ];
//   return (
//     <>
//       <HeroSection
//         title="Афіша Подій"
//         typedStrings={["Культурні заходи та зустрічі діаспори"]}
//         subtitle="Простір для спілкування, обміну досвідом та підтримки"
//         buttonText="Переглянути події"
//         buttonLink="/events"
//         textAlign="left"
//       />
//       <Container style={{ marginTop: "30px" }}>
//         <Typography variant="h4" gutterBottom>
//           Афіша українських подій у Європі
//         </Typography>

//         <div className="filter-section">
//           <Grid  container spacing={3}>
//             <Grid  size={{ xs: 12, md: 4 }}>
//               <FormControl fullWidth>
//                 <InputLabel>Країна</InputLabel>
//                 <Select
//                   value={country}
//                   label="Країна"
//                   onChange={(e) => setCountry(e.target.value)}
//                 >
//                   <MenuItem value="">Всі країни</MenuItem>
//                   <MenuItem value="germany">Німеччина</MenuItem>
//                   <MenuItem value="france">Франція</MenuItem>
//                   <MenuItem value="poland">Польща</MenuItem>
//                   <MenuItem value="czech">Чехія</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid  size={{ xs: 12, md: 4 }}>
//               <FormControl fullWidth>
//                 <InputLabel>Тип події</InputLabel>
//                 <Select
//                   value={eventType}
//                   label="Тип події"
//                   onChange={(e) => setEventType(e.target.value)}
//                 >
//                   <MenuItem value="">Всі типи</MenuItem>
//                   <MenuItem value="culture">Культурні заходи</MenuItem>
//                   <MenuItem value="art">Мистецтво</MenuItem>
//                   <MenuItem value="festival">Фестивалі</MenuItem>
//                   <MenuItem value="concert">Концерти</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid  size={{ xs: 12, md: 4 }}>
//               <TextField fullWidth label="Пошук за назвою" variant="outlined" />
//             </Grid>
//           </Grid>
//         </div>

//         <Grid  container spacing={4}>
//           {events.map((event, index) => (
//             <Grid  size={{ xs: 12, md: 4, sm: 6 }} key={index}>
//               <Card className="event-card">
//                 <CardMedia
//                   component="div"
//                   style={{
//                     height: "200px",
//                     backgroundColor: "#FFD700",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <Typography variant="h6" color="textSecondary">
//                     {event.title}
//                   </Typography>
//                 </CardMedia>
//                 <CardContent>
//                   <Typography gutterBottom variant="h5" component="div">
//                     {event.title}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" paragraph>
//                     {event.description}
//                   </Typography>
//                   <Chip
//                     icon={<span className="material-icons">event</span>}
//                     label={new Date(event.date).toLocaleDateString("uk-UA")}
//                     style={{ margin: "5px" }}
//                   />
//                   <Chip
//                     icon={<span className="material-icons">location_on</span>}
//                     label={event.location}
//                     style={{ margin: "5px" }}
//                   />
//                   <Chip
//                     icon={<span className="material-icons">category</span>}
//                     label={event.type}
//                     style={{ margin: "5px" }}
//                   />
//                 </CardContent>
//                 <CardActions>
//                   <Button size="small" color="primary">
//                     Детальніше
//                   </Button>
//                   <Button size="small" color="primary">
//                     Зареєструватися
//                   </Button>
//                 </CardActions>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>
//     </>
//   );
// };
// export default Events;
import { useState } from "react";
import { HeroSection } from "../components";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const fontBody = "'Plus Jakarta Sans', sans-serif";
const fontDisplay = "'Playfair Display', serif";

const TYPE_COLORS = {
  "Культурний захід": { bg: "#f5f3ff", text: "#6d28d9" },
  Мистецтво: { bg: "#fdf4ff", text: "#7e22ce" },
  Фестиваль: { bg: "#fff7ed", text: "#9a3412" },
  Концерт: { bg: "#ecfdf5", text: "#065f46" },
};

const BG_GRADIENTS = [
  "linear-gradient(135deg, #0057B8 0%, #003d82 100%)",
  "linear-gradient(135deg, #FFD700 0%, #f59e0b 100%)",
  "linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%)",
  "linear-gradient(135deg, #065f46 0%, #022c22 100%)",
];

const EVENTS = [
  {
    id: 1,
    title: "Українські вечорниці",
    date: "2025-12-15",
    location: "Берлін, Німеччина",
    type: "Культурний захід",
    description:
      "Традиційні українські вечорниці з піснями, танцями та стравами.",
  },
  {
    id: 2,
    title: "Виставка сучасного мистецтва",
    date: "2025-12-20",
    location: "Париж, Франція",
    type: "Мистецтво",
    description: "Виставка робіт сучасних українських художників у Парижі.",
  },
  {
    id: 3,
    title: "Різдвяний ярмарок",
    date: "2025-12-25",
    location: "Варшава, Польща",
    type: "Фестиваль",
    description: "Традиційний різдвяний ярмарок з українськими ремеслами.",
  },
  {
    id: 4,
    title: "Концерт класичної музики",
    date: "2025-12-30",
    location: "Прага, Чехія",
    type: "Концерт",
    description: "Виступ українських музикантів — класика та народна музика.",
  },
  {
    id: 5,
    title: "Майстер-клас вишиванки",
    date: "2026-01-08",
    location: "Відень, Австрія",
    type: "Культурний захід",
    description: "Навчіться традиційної вишивки від майстринь із Полтавщини.",
  },
  {
    id: 6,
    title: "День незалежності України",
    date: "2026-08-24",
    location: "Берлін, Німеччина",
    type: "Фестиваль",
    description: "Масштабне святкування Дня незалежності для діаспори.",
  },
];

export default function Events() {
  const [country, setCountry] = useState("");
  const [eventType, setEventType] = useState("");
  const [search, setSearch] = useState("");

  const filtered = EVENTS.filter((e) => {
    const matchCountry = !country || e.location.toLowerCase().includes(country);
    const matchType = !eventType || e.type === eventType;
    const matchSearch =
      !search || e.title.toLowerCase().includes(search.toLowerCase());
    return matchCountry && matchType && matchSearch;
  });

  return (
    <>
      <HeroSection
        title="Афіша подій"
        typedStrings={["Культурні заходи"]}
        subtitle="Концерти, виставки, фестивалі та зустрічі — події для всієї діаспори"
        buttonText="Додати подію"
        buttonLink="/contact"
        size="sm"
      />

      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          {/* ── Filters ── */}
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
            <Grid  container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontFamily: fontBody }}>Країна</InputLabel>
                  <Select
                    value={country}
                    label="Країна"
                    onChange={(e) => setCountry(e.target.value)}
                    sx={{
                      borderRadius: "12px",
                      fontFamily: fontBody,
                      bgcolor: "#f8fafc",
                    }}
                  >
                    <MenuItem value="">Всі країни</MenuItem>
                    <MenuItem value="нім">Німеччина</MenuItem>
                    <MenuItem value="фра">Франція</MenuItem>
                    <MenuItem value="пол">Польща</MenuItem>
                    <MenuItem value="чех">Чехія</MenuItem>
                    <MenuItem value="авс">Австрія</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontFamily: fontBody }}>
                    Тип події
                  </InputLabel>
                  <Select
                    value={eventType}
                    label="Тип події"
                    onChange={(e) => setEventType(e.target.value)}
                    sx={{
                      borderRadius: "12px",
                      fontFamily: fontBody,
                      bgcolor: "#f8fafc",
                    }}
                  >
                    <MenuItem value="">Всі типи</MenuItem>
                    <MenuItem value="Культурний захід">
                      Культурний захід
                    </MenuItem>
                    <MenuItem value="Мистецтво">Мистецтво</MenuItem>
                    <MenuItem value="Фестиваль">Фестиваль</MenuItem>
                    <MenuItem value="Концерт">Концерт</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Пошук за назвою..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: "12px",
                      fontFamily: fontBody,
                      bgcolor: "#f8fafc",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* ── Count + results ── */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              sx={{
                fontFamily: fontBody,
                fontSize: "0.875rem",
                color: "#64748b",
                fontWeight: 500,
              }}
            >
              {filtered.length} подій знайдено
            </Typography>
          </Box>

          {/* ── Grid ── */}
          <Grid  container spacing={3}>
            {filtered.map((event, i) => {
              const typeClr = TYPE_COLORS[event.type] || {
                bg: "#f1f5f9",
                text: "#475569",
              };
              const isUpcoming = new Date(event.date) > new Date();
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={event.id}
                  sx={{
                    animation: "fadeUp 0.5s ease both",
                    animationDelay: `${(i % 6) * 0.08}s`,
                    "@keyframes fadeUp": {
                      from: { opacity: 0, transform: "translateY(20px)" },
                      to: { opacity: 1, transform: "translateY(0)" },
                    },
                  }}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "20px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 1px 4px rgba(0,0,0,.04)",
                      overflow: "hidden",
                      transition: "transform 0.25s ease, box-shadow 0.25s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 16px 48px rgba(0,87,184,.12)",
                      },
                    }}
                  >
                    {/* Colour top banner */}
                    <Box
                      sx={{
                        height: 120,
                        background: BG_GRADIENTS[i % BG_GRADIENTS.length],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        p: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: fontDisplay,
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          color: "rgba(255,255,255,.9)",
                          textAlign: "center",
                          lineHeight: 1.35,
                        }}
                      >
                        {event.title}
                      </Typography>
                      {/* Live/upcoming badge */}
                      <Chip
                        label={isUpcoming ? "Заплановано" : "Минула"}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          bgcolor: isUpcoming
                            ? "rgba(255,255,255,.2)"
                            : "rgba(0,0,0,.25)",
                          color: "#fff",
                          fontFamily: fontBody,
                          fontWeight: 700,
                          fontSize: "0.65rem",
                          backdropFilter: "blur(6px)",
                          border: "1px solid rgba(255,255,255,.25)",
                        }}
                      />
                    </Box>

                    <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
                      <Chip
                        label={event.type}
                        size="small"
                        sx={{
                          bgcolor: typeClr.bg,
                          color: typeClr.text,
                          fontFamily: fontBody,
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          mb: 2,
                        }}
                      />

                      <Typography
                        sx={{
                          fontFamily: fontBody,
                          fontSize: "0.85rem",
                          color: "#64748b",
                          lineHeight: 1.7,
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {event.description}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.8,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CalendarTodayOutlinedIcon
                            sx={{ fontSize: 14, color: "#94a3b8" }}
                          />
                          <Typography
                            sx={{
                              fontFamily: fontBody,
                              fontSize: "0.8rem",
                              color: "#64748b",
                              fontWeight: 500,
                            }}
                          >
                            {new Date(event.date).toLocaleDateString("uk-UA", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <LocationOnOutlinedIcon
                            sx={{ fontSize: 14, color: "#94a3b8" }}
                          />
                          <Typography
                            sx={{
                              fontFamily: fontBody,
                              fontSize: "0.8rem",
                              color: "#64748b",
                              fontWeight: 500,
                            }}
                          >
                            {event.location}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>

                    <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0, gap: 1 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        sx={{
                          fontFamily: fontBody,
                          fontWeight: 700,
                          textTransform: "none",
                          bgcolor: "#0057B8",
                          borderRadius: "10px",
                          fontSize: "0.8rem",
                          "&:hover": { bgcolor: "#003d82" },
                          boxShadow: "none",
                        }}
                      >
                        Зареєструватися
                      </Button>
                      <Button
                        size="small"
                        sx={{
                          fontFamily: fontBody,
                          fontWeight: 600,
                          textTransform: "none",
                          color: "#64748b",
                          borderRadius: "10px",
                          fontSize: "0.8rem",
                          border: "1px solid #e2e8f0",
                          minWidth: "auto",
                          px: 1.5,
                          "&:hover": {
                            borderColor: "#0057B8",
                            color: "#0057B8",
                          },
                        }}
                      >
                        Детальніше
                      </Button>
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
                Подій не знайдено
              </Typography>
              <Typography
                sx={{
                  fontFamily: fontBody,
                  fontSize: "0.875rem",
                  color: "#cbd5e1",
                }}
              >
                Спробуйте змінити фільтри
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}
