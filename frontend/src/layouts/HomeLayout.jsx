import { Outlet, useMatches } from "react-router-dom";
import { Navbar, Footer, Loading } from "../components";
import { Stack, Container } from "@mui/material";
import CrossPromotionStrip from "../components/CrossPromotion/CrossPromotionSidebar";

const HomeLayout = () => {
  const isPageLoading = false;

  // Показуємо блок лише на маршрутах, позначених handle: { crossPromotion: true }
  const matches = useMatches();
  const showPromotion = matches.some((m) => m.handle?.crossPromotion);

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
        {showPromotion && <CrossPromotionStrip />}
      </Stack>
      <Footer />
    </>
  );
};

export default HomeLayout;
