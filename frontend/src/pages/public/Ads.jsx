import { useState } from "react";
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
  Box,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { GridView, HeroSection, ListView } from "../../components";
import "../../assets/css/ads.css";
import customFetch from "../../utils/customFetch";
import { toast } from "react-toastify";
import { useLoaderData } from "react-router-dom";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

export const loader = async () => {
  try {
    const { data } = await customFetch.get(`/adv`);
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return [];
  }
};

const Ads = () => {
  const data = useLoaderData();
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const handleViewChange = (_, newView) => {
    if (newView !== null) setViewMode(newView);
  };

  // Client-side filtering
  const filtered = data.filter((ad) => {
    const matchCat = !category || ad.category?.slug === category;
    const adCity =
      typeof ad.location === "object"
        ? ad.location.city?.toLowerCase()
        : ad.location?.toLowerCase();
    const matchCity = !city || adCity?.includes(city);
    const matchSearch =
      !search ||
      ad.title?.toLowerCase().includes(search.toLowerCase()) ||
      ad.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchCity && matchSearch;
  });

  return (
    <>
      <HeroSection
        typedStrings={["Оголошення", "Робота", "Житло", "Послуги"]}
        subtitle="Важлива інформація та актуальні повідомлення для української діаспори"
        buttonText="Переглянути оголошення"
        buttonLink="/ads"
      />

      <Container maxWidth="lg" sx={{ mt: 5, mb: 10 }}>
        {/* Header row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Дошка оголошень
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
              {filtered.length} оголошень знайдено
            </Typography>
          </Box>

          {/* View toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewChange}
            size="small"
            sx={{
              "& .MuiToggleButton-root": {
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "8px !important",
                mx: 0.3,
                px: 1.2,
                py: 0.8,
                color: "text.secondary",
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": { bgcolor: "primary.dark" },
                },
              },
            }}
          >
            <ToggleButton value="grid" aria-label="vue grille">
              <GridViewOutlinedIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="list" aria-label="vue liste">
              <ViewListOutlinedIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Filters */}
        <Box
          sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "16px",
            p: 2.5,
            mb: 4,
          }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Категорія</InputLabel>
                <Select
                  value={category}
                  label="Категорія"
                  onChange={(e) => setCategory(e.target.value)}
                  sx={{ borderRadius: "10px" }}
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
              <FormControl fullWidth size="small">
                <InputLabel>Місто</InputLabel>
                <Select
                  value={city}
                  label="Місто"
                  onChange={(e) => setCity(e.target.value)}
                  sx={{ borderRadius: "10px" }}
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
                size="small"
                label="Пошук за текстом"
                variant="outlined"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Results */}
        {filtered.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography variant="h6" color="text.secondary">
              Нічого не знайдено
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
              Спробуйте змінити фільтри або пошуковий запит
            </Typography>
          </Box>
        ) : viewMode === "grid" ? (
          <GridView ads={filtered} />
        ) : (
          <ListView ads={filtered} />
        )}

        {/* FAB */}
        <Tooltip title="Додати оголошення" placement="left">
          <Fab
            color="primary"
            aria-label="add"
            sx={{
              position: "fixed",
              bottom: 32,
              right: 32,
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </Container>
    </>
  );
};

export default Ads;
