import { useState } from "react";
import PropTypes from "prop-types";
import { HeroSection } from "../components";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import "../assets/css/events.css";
const Events = (props) => {
  const [country, setCountry] = useState("");
  const [eventType, setEventType] = useState("");

  const events = [
    {
      title: "Українські вечорниці",
      date: "2023-12-15",
      location: "Берлін, Німеччина",
      type: "Культурний захід",
      image: "https://example.com/event1.jpg",
      description:
        "Традиційні українські вечорниці з піснями, танцями та смачними стравами",
    },
    {
      title: "Виставка сучасного мистецтва",
      date: "2023-12-20",
      location: "Париж, Франція",
      type: "Мистецтво",
      image: "https://example.com/event2.jpg",
      description: "Виставка робіт українських художників у Парижі",
    },
    {
      title: "Різдвяний ярмарок",
      date: "2023-12-25",
      location: "Варшава, Польща",
      type: "Фестиваль",
      image: "https://example.com/event3.jpg",
      description: "Традиційний український різдвяний ярмарок",
    },
    {
      title: "Концерт української музики",
      date: "2023-12-30",
      location: "Прага, Чехія",
      type: "Концерт",
      image: "https://example.com/event4.jpg",
      description:
        "Виступ українських музикантів з класичними та сучасними творами",
    },
  ];
  return (
    <>
      <HeroSection
        title="Афіша Подій"
        typedStrings={["Культурні заходи та зустрічі діаспори"]}
        subtitle="Простір для спілкування, обміну досвідом та підтримки"
        buttonText="Переглянути події"
        buttonLink="/events"
        textAlign="left"
      />
      <Container style={{ marginTop: "30px" }}>
        <Typography variant="h4" gutterBottom>
          Афіша українських подій у Європі
        </Typography>

        <div className="filter-section">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Країна</InputLabel>
                <Select
                  value={country}
                  label="Країна"
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <MenuItem value="">Всі країни</MenuItem>
                  <MenuItem value="germany">Німеччина</MenuItem>
                  <MenuItem value="france">Франція</MenuItem>
                  <MenuItem value="poland">Польща</MenuItem>
                  <MenuItem value="czech">Чехія</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Тип події</InputLabel>
                <Select
                  value={eventType}
                  label="Тип події"
                  onChange={(e) => setEventType(e.target.value)}
                >
                  <MenuItem value="">Всі типи</MenuItem>
                  <MenuItem value="culture">Культурні заходи</MenuItem>
                  <MenuItem value="art">Мистецтво</MenuItem>
                  <MenuItem value="festival">Фестивалі</MenuItem>
                  <MenuItem value="concert">Концерти</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Пошук за назвою" variant="outlined" />
            </Grid>
          </Grid>
        </div>

        <Grid container spacing={4}>
          {events.map((event, index) => (
            <Grid size={{ xs: 12, md: 4, sm: 6 }} key={index}>
              <Card className="event-card">
                <CardMedia
                  component="div"
                  style={{
                    height: "200px",
                    backgroundColor: "#FFD700",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h6" color="textSecondary">
                    {event.title}
                  </Typography>
                </CardMedia>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {event.description}
                  </Typography>
                  <Chip
                    icon={<span className="material-icons">event</span>}
                    label={new Date(event.date).toLocaleDateString("uk-UA")}
                    style={{ margin: "5px" }}
                  />
                  <Chip
                    icon={<span className="material-icons">location_on</span>}
                    label={event.location}
                    style={{ margin: "5px" }}
                  />
                  <Chip
                    icon={<span className="material-icons">category</span>}
                    label={event.type}
                    style={{ margin: "5px" }}
                  />
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Детальніше
                  </Button>
                  <Button size="small" color="primary">
                    Зареєструватися
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};
Events.propTypes = {};
export default Events;
