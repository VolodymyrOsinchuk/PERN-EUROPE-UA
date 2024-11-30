import React from "react";
import PropTypes from "prop-types";
import {
  Typography,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Fab,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { GridView, HeroSection, ListView } from "../components/";
import "../assets/css/ads.css";
const Ads = (props) => {
  const [category, setCategory] = React.useState("");
  const [city, setCity] = React.useState("");
  const [viewMode, setViewMode] = React.useState("grid");

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  return (
    <>
      <HeroSection
        title="Оголошення"
        typedStrings={["Оголошення"]}
        subtitle="Важлива інформація та актуальні повідомлення для української діаспори"
        buttonText="Переглянути оголошення"
        buttonLink="/ads"
        textAlign="left"
      />
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
              <TextField
                fullWidth
                label="Пошук за текстом"
                variant="outlined"
              />
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
    </>
  );
};
Ads.propTypes = {};
export default Ads;
