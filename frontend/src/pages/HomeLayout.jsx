import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "../components";
import { Stack } from "@mui/material";

const HomeLayout = () => {
  return (
    <>
      <Navbar />
      <Stack
        sx={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
        component="main"
      >
        <Outlet />
      </Stack>
      <Footer />
    </>
  );
};
export default HomeLayout;
