import { useState } from "react";
import { HeroSection } from "../components";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import "../assets/css/news.css";

const News = () => {
  const [languageAnchor, setLanguageAnchor] = useState(null);
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [newsItems, setNewsItems] = useState([
    {
      title: "Нова програма допомоги для українських біженців у Франції",
      date: "15 Лис 2023",
      category: "Соціальна допомога",
      description: "Французький уряд запускає нову програму допомоги...",
      importance: "high",
    },
    {
      title: "Фестиваль української культури в Берліні",
      date: "12 Лис 2023",
      category: "Культура",
      description: "Великий фестиваль української культури відбудеться...",
      importance: "medium",
    },
    {
      title: "Можливості працевлаштування для українців у Німеччині",
      date: "10 Лис 2023",
      category: "Робота",
      description:
        "Нові можливості працевлаштування в технологічному секторі...",
      importance: "high",
    },
    {
      title: "Безкоштовні мовні курси онлайн",
      date: "8 Лис 2023",
      category: "Освіта",
      description: "Нова платформа пропонує безкоштовні мовні курси...",
      importance: "medium",
    },
  ]);

  const loadMoreNews = () => {
    setIsLoading(true);
    // Simulating API call
    setTimeout(() => {
      const newItems = [
        {
          title: "Нові правила перебування в ЄС",
          date: "7 Лис 2023",
          category: "Соціальна допомога",
          description: "Важливі зміни у правилах перебування українців в ЄС...",
          importance: "high",
        },
        {
          title: "Українська школа відкривається у Варшаві",
          date: "5 Лис 2023",
          category: "Освіта",
          description: "Нова українська школа починає роботу у Варшаві...",
          importance: "medium",
        },
      ];
      setNewsItems([...newsItems, ...newItems]);
      setPage(page + 1);
      setIsLoading(false);
    }, 1500);
  };

  const handleLanguageClick = (event) => {
    setLanguageAnchor(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageAnchor(null);
  };

  const handleFilterClick = (event) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Соціальна допомога": "#f44336",
      Культура: "#2196f3",
      Робота: "#4caf50",
      Освіта: "#ff9800",
    };
    return colors[category] || "#757575";
  };

  return (
    <>
      <HeroSection
        title="Останні Новини"
        typedStrings={["Актуальна інформація"]}
        subtitle="Актуальна інформація для українців в Європі"
        // backgroundImage="/path/to/news-background.jpg"
        textColor="white"
      />

      <Container style={{ marginTop: "30px" }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="h4" gutterBottom textAlign="center">
              Новини
            </Typography>
            <Typography variant="subtitle1" gutterBottom color="textSecondary">
              Будьте в курсі останніх новин про українську спільноту в Європі
            </Typography>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Пошук новин..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <span className="material-icons">search</span>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button
              variant="outlined"
              onClick={handleFilterClick}
              startIcon={<span className="material-icons">filter_list</span>}
            >
              Фільтрувати за категорією
            </Button>
            <Menu
              anchorEl={filterAnchor}
              open={Boolean(filterAnchor)}
              onClose={handleFilterClose}
            >
              <MenuItem onClick={() => setSelectedCategory("all")}>
                Всі категорії
              </MenuItem>
              <MenuItem
                onClick={() => setSelectedCategory("Соціальна допомога")}
              >
                Соціальна допомога
              </MenuItem>
              <MenuItem onClick={() => setSelectedCategory("Культура")}>
                Культура
              </MenuItem>
              <MenuItem onClick={() => setSelectedCategory("Робота")}>
                Робота
              </MenuItem>
              <MenuItem onClick={() => setSelectedCategory("Освіта")}>
                Освіта
              </MenuItem>
            </Menu>
          </Grid>

          {newsItems.map((item, index) => (
            <Grid size={{ xs: 12 }} key={index}>
              <Card className="news-card">
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    {item.title}
                  </Typography>
                  <Chip
                    label={item.category}
                    style={{
                      backgroundColor: getCategoryColor(item.category),
                      color: "white",
                      marginBottom: "10px",
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {item.date}
                  </Typography>
                  <Typography variant="body1" style={{ marginTop: "10px" }}>
                    {item.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Читати далі
                  </Button>
                  <Button
                    size="small"
                    startIcon={<span className="material-icons">share</span>}
                  >
                    Поділитися
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}

          <Grid
            size={{ xs: 12 }}
            style={{ textAlign: "center", marginTop: "20px" }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={loadMoreNews}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  Завантаження...
                  <CircularProgress
                    size={20}
                    color="inherit"
                    className="loading-spinner"
                  />
                </>
              ) : (
                "Завантажити більше новин"
              )}
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
export default News;
