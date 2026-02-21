// Default React import not required with automatic JSX runtime
import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "../components";
import { Box, Container } from "@mui/material";

const AppLayout = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Container component="main" sx={{ flexGrow: 1, pb: 4 }}>
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
};

export default AppLayout;
