import PropTypes from "prop-types";
import {
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Chip,
  Fab,
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListItem,
  ListItemText,
  // ListItemSecondary,
  Divider,
  Box,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import "../assets/css/ads.css";
import React from "react";
const Ads = (props) => {
  const [category, setCategory] = React.useState("");
  const [city, setCity] = React.useState("");
  const [viewMode, setViewMode] = React.useState("grid");

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  const ads = [
    {
      title: "Шукаю роботу викладача української мови",
      category: "Робота",
      location: "Берлін, Німеччина",
      date: "2023-12-10",
      description:
        "Маю досвід викладання 5 років, сертифікати. Можу викладати онлайн або офлайн.",
      contact: "+49123456789",
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format",
    },
    {
      title: "Здам кімнату в квартирі",
      category: "Житло",
      location: "Париж, Франція",
      date: "2023-12-11",
      description:
        "Затишна кімната в центрі міста. Всі зручності, інтернет. Для однієї людини.",
      contact: "room@email.com",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format",
    },
    {
      title: "Пропоную послуги перекладача",
      category: "Послуги",
      location: "Варшава, Польща",
      date: "2023-12-12",
      description:
        "Письмові та усні переклади українська-польська-англійська. Досвід роботи 3 роки.",
      contact: "translator@email.com",
      image:
        "https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=600&auto=format",
    },
  ];

  const GridView = () => (
    <Grid container spacing={4}>
      {ads.map((ad, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card className="ad-card">
            <CardMedia
              component="img"
              className="ad-image"
              image={ad.image}
              alt={ad.title}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {ad.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {ad.description}
              </Typography>
              <Chip
                icon={<span className="material-icons">category</span>}
                label={ad.category}
                style={{ margin: "5px" }}
              />
              <Chip
                icon={<span className="material-icons">location_on</span>}
                label={ad.location}
                style={{ margin: "5px" }}
              />
              <Chip
                icon={<span className="material-icons">event</span>}
                label={new Date(ad.date).toLocaleDateString("uk-UA")}
                style={{ margin: "5px" }}
              />
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                Контакти
              </Button>
              <Button size="small" color="primary">
                Поскаржитись
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const ListView = () => (
    <List>
      {ads.map((ad, index) => (
        <React.Fragment key={index}>
          <ListItem className="list-view-item" alignItems="flex-start">
            <Box display="flex">
              <img src={ad.image} alt={ad.title} className="list-view-image" />
              <ListItemText
                primary={<Typography variant="h6">{ad.title}</Typography>}
                secondary={
                  <React.Fragment>
                    <Typography variant="body2" color="text.secondary">
                      {ad.description}
                    </Typography>
                    <Chip
                      size="small"
                      icon={<span className="material-icons">category</span>}
                      label={ad.category}
                      style={{ margin: "5px" }}
                    />
                    <Chip
                      size="small"
                      icon={<span className="material-icons">location_on</span>}
                      label={ad.location}
                      style={{ margin: "5px" }}
                    />
                    <Chip
                      size="small"
                      icon={<span className="material-icons">event</span>}
                      label={new Date(ad.date).toLocaleDateString("uk-UA")}
                      style={{ margin: "5px" }}
                    />
                    <div style={{ marginTop: "10px" }}>
                      <Button size="small" color="primary">
                        Контакти
                      </Button>
                      <Button size="small" color="primary">
                        Поскаржитись
                      </Button>
                    </div>
                  </React.Fragment>
                }
              />
            </Box>
          </ListItem>
          {index < ads.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );

  return (
    <Container style={{ marginTop: "30px" }}>
      <Typography variant="h4" gutterBottom>
        Дошка оголошень
      </Typography>

      <div className="filter-section">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Категорія</InputLabel>
              <Select
                value={category}
                label="Категорія"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">Всі категорії</MenuItem>
                <MenuItem value="work">Робота</MenuItem>
                <MenuItem value="housing">Житло</MenuItem>
                <MenuItem value="services">Послуги</MenuItem>
                <MenuItem value="education">Освіта</MenuItem>
                <MenuItem value="other">Інше</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Місто</InputLabel>
              <Select
                value={city}
                label="Місто"
                onChange={(e) => setCity(e.target.value)}
              >
                <MenuItem value="">Всі міста</MenuItem>
                <MenuItem value="berlin">Берлін</MenuItem>
                <MenuItem value="paris">Париж</MenuItem>
                <MenuItem value="warsaw">Варшава</MenuItem>
                <MenuItem value="prague">Прага</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth label="Пошук за текстом" variant="outlined" />
          </Grid>
        </Grid>
      </div>

      <div className="view-toggle">
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewChange}
        >
          <ToggleButton value="grid" aria-label="grid view">
            <span className="material-icons">grid_view</span>
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            <span className="material-icons">view_list</span>
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {viewMode === "grid" ? <GridView /> : <ListView />}

      <Fab color="primary" className="add-button" aria-label="add">
        <span className="material-icons">add</span>
      </Fab>
    </Container>
  );
};
Ads.propTypes = {};
export default Ads;
