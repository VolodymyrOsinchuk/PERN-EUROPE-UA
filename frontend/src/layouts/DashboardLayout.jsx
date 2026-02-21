// Use named imports for hooks - default React import is not necessary
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import { DrawerContainer } from "../components";
import AppBarComponent from "../components/AppBarComponent";
// import { DrawerContainer, PermanentDrawer } from "../components/Drawer";
const drawerWidth = 240;

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", flexGrow: 1 }}>
      <AppBarComponent handleDrawerToggle={handleDrawerToggle} />
      <DrawerContainer />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: "85vh",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};
export default DashboardLayout;
