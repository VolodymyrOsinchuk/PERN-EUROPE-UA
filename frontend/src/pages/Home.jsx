import PropTypes from "prop-types";
import {
  Typography,
  Button,
  Container,
  Grid2,
  TextField,
  Card,
  CardContent,
  CardActions,
  Paper,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import { HeroSection, SectionsGrid } from "../components";
import "../assets/css/home.css";

// console.log("Environnement:", import.meta.env);

// const apiUrl = import.meta.env.VITE_APP_API_URL;
// console.log("🚀 ~ apiUrl:", apiUrl);
// const isDebug = import.meta.env.VITE_APP_DEBUG === "true";
// console.log("🚀 ~ isDebug :", isDebug);
const Home = (props) => {
  return (
    <Box component="div" sx={{ backgroundColor: "#f5f5f5" }}>
      <HeroSection
        title="Українці в Європі"
        typedStrings={["Українці в Європі"]}
        subtitle="Ваш путівник у житті за кордоном"
        buttonText="Приєднатися до спільноти"
        buttonLink="/register"
      />
      <div className="search-section">
        <Container maxWidth="lg">
          <Grid2 container spacing={2} alignItems="center">
            <Grid2 size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                placeholder="Пошук послуг, подій або інформації..."
                variant="outlined"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Button variant="contained" color="primary" fullWidth>
                Пошук
              </Button>
            </Grid2>
          </Grid2>
        </Container>
      </div>

      <Container className="latest-posts">
        <Typography variant="h4" className="section-title">
          Основні категорії
        </Typography>
        <SectionsGrid />
        {/* <Grid2 container spacing={4}>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Card className="feature-card">
              <CardContent>
                <div className="category-icon">
                  <span className="material-icons">work</span>
                </div>
                <Typography variant="h6" gutterBottom>
                  Робота
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Вакансії та можливості працевлаштування для українців
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Детальніше
                </Button>
              </CardActions>
            </Card>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Card className="feature-card">
              <CardContent>
                <div className="category-icon">
                  <span className="material-icons">school</span>
                </div>
                <Typography variant="h6" gutterBottom>
                  Освіта
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Навчання, курси та освітні можливості
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Детальніше
                </Button>
              </CardActions>
            </Card>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Card className="feature-card">
              <CardContent>
                <div className="category-icon">
                  <span className="material-icons">home</span>
                </div>
                <Typography variant="h6" gutterBottom>
                  Житло
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Оренда та пошук житла в різних країнах
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Детальніше
                </Button>
              </CardActions>
            </Card>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Card className="feature-card">
              <CardContent>
                <div className="category-icon">
                  <span className="material-icons">local_hospital</span>
                </div>
                <Typography variant="h6" gutterBottom>
                  Медицина
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Медичні послуги та страхування
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Детальніше
                </Button>
              </CardActions>
            </Card>
          </Grid2>
        </Grid2> */}
      </Container>

      <Container>
        <Typography variant="h4" className="section-title">
          Останні новини
        </Typography>
        <Grid2 container spacing={4}>
          {[1, 2, 3].map((item) => (
            <Grid2 size={{ xs: 12, md: 4 }} key={item}>
              <Card className="news-card">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Новина {item}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Короткий опис останніх подій та новин для української
                    спільноти в Європі...
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Читати більше
                  </Button>
                </CardActions>
              </Card>
            </Grid2>
          ))}
        </Grid2>

        <Paper elevation={3} style={{ marginTop: "40px", padding: "20px" }}>
          <Typography variant="h4" gutterBottom>
            Про нас
          </Typography>
          <Typography variant="body1" paragraph>
            "Українці в Європі" - це онлайн-платформа, створена для об'єднання
            та підтримки української діаспори в європейських країнах. Наша мета
            - допомогти українцям адаптуватися до життя за кордоном, зберігаючи
            зв'язок з рідною культурою та традиціями.
          </Typography>
          <Typography variant="body1">
            Ми пропонуємо актуальну інформацію, корисні ресурси та можливості
            для спілкування, щоб зробити ваше життя в Європі комфортним та
            насиченим.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

Home.propTypes = {};
export default Home;
