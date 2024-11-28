import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "../components";
import { Box } from "@mui/material";

const HomeLayout = () => {
  return (
    <Box sx={{ minHeight: "80vh" }}>
      <Navbar />
      <Outlet />
      <Footer />
    </Box>
  );
};
export default HomeLayout;
