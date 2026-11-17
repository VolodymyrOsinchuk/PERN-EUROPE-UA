// frontend/src/pages/CountriesIndex.jsx
import { Box, Container } from "@mui/material";
import CountriesGrid from "../components/CountriesGrid";
import { HeroSection } from "../components";

export default function CountriesIndex() {
  return (
    <Box
      component="section"
      sx={{
        bgcolor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <HeroSection
        title="Країни Європи"
        badge="ДОВІДНИК ПО КРАЇНАХ"
        subtitle="Офіційна інформація для українців, перевірена з першоджерел."
        size="sm"
      />

      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 5, md: 8 },
        }}
      >
        <CountriesGrid />
      </Container>
    </Box>
  );
}
