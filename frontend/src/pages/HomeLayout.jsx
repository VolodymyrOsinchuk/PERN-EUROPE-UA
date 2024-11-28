import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "../components";
import { Container, Stack } from "@mui/material";

const HomeLayout = () => {
  return (
    <Stack
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
      className="main"
    >
      <Navbar />
      <Outlet />
      <Footer />
    </Stack>
  );
};
export default HomeLayout;
