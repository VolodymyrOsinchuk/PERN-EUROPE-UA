import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  Box,
  Drawer,
  Toolbar,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import AppBarComponent from "../components/AppBarComponent";
import theme from "./theme";

const DRAWER_WIDTH = 240;

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const drawerContent = <Sidebar />;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
        <AppBarComponent handleDrawerToggle={handleDrawerToggle} />

        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            width: DRAWER_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
            minHeight: "100vh",
          }}
        >
          <Toolbar sx={{ minHeight: "64px !important" }} />
          <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardLayout;
