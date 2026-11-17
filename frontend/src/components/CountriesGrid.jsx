// frontend/src/components/CountriesGrid.jsx
import { Link } from "react-router-dom";
import { Box, Grid, Paper, Typography } from "@mui/material";
import COUNTRIES_DATA from "../data/countries.json";
import { getPublishableCountries } from "../data/validateCountries";

const F_BODY = "'Plus Jakarta Sans', sans-serif";
const F_DISPLAY = "'Playfair Display', serif";

export default function CountriesGrid() {
  const countries = getPublishableCountries(COUNTRIES_DATA);
  if (countries.length === 0) return null;

  return (
    <Grid container spacing={2}>
      {countries.map((c) => (
        <Grid key={c.code} size={{ xs: 6, sm: 4, md: 3 }}>
          <Paper
            component={Link}
            to={`/countries/${c.code}`}
            elevation={0}
            sx={{
              display: "block",
              p: 2.5,
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              textDecoration: "none",
              textAlign: "center",
              transition: "transform .2s, box-shadow .2s",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 8px 24px rgba(0,87,184,.1)",
              },
            }}
          >
            <Typography sx={{ fontSize: "2rem", lineHeight: 1 }}>
              {c.flag}
            </Typography>
            <Typography
              sx={{
                fontFamily: F_DISPLAY,
                fontWeight: 700,
                color: "#0f172a",
                mt: 1,
              }}
            >
              {c.name}
            </Typography>
            <Typography
              sx={{ fontFamily: F_BODY, fontSize: "0.75rem", color: "#64748b" }}
            >
              {c.links.length} посилань
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
