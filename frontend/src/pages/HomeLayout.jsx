import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "../components";
import { Stack } from "@mui/material";
import { useProfileContext } from "./ProfileLayout";
const HomeLayout = () => {
  const item = useProfileContext();
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
