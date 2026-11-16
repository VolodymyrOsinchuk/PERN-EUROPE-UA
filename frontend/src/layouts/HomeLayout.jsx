import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "../components";
import { Stack } from "@mui/material";
import { Loading } from "../components";

const HomeLayout = () => {
  const isPageLoading = false;

  return (
    <>
      <Navbar />
      <Stack
        sx={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          bgcolor: "#f5f5f5",
          pb: 4,
        }}
        component="main"
      >
        {isPageLoading ? <Loading /> : <Outlet />}
      </Stack>
      <Footer />
    </>
  );
};
export default HomeLayout;
