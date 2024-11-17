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
} from "@mui/material";

import "../assets/css/home.css";
const Home = (props) => {
  return (
    <>
      <div className="hero">
        <Container>
          <Typography variant="h2" gutterBottom>
            Ukrainians in Europe
          </Typography>
          <Typography variant="h5" gutterBottom>
            Your guide to European life
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            style={{ marginTop: 20 }}
          >
            Join the community
          </Button>
        </Container>
      </div>

      <div className="search-section">
        <Container>
          <Grid2 container spacing={2} alignItems="center">
            <Grid2 size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                placeholder="Search for services, events or information..."
                variant="outlined"
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Button variant="contained" color="primary" fullWidth>
                Search
              </Button>
            </Grid2>
          </Grid2>
        </Container>
      </div>

      <Container className="latest-posts">
        <Typography variant="h4" className="section-title">
          Main Categories
        </Typography>

        <Grid2 container spacing={4}>
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
        </Grid2>
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
      </Container>
    </>
  );
};
Home.propTypes = {};
export default Home;
