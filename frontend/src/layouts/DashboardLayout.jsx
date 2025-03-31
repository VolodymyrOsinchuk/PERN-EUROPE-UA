import PropTypes from "prop-types";

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import { DrawerContainer } from "../components";
import AppBarComponent from "../components/AppBarComponent";
// import { DrawerContainer, PermanentDrawer } from "../components/Drawer";
const drawerWidth = 240;

const DashboardLayout = (props) => {
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
DashboardLayout.propTypes = {};
export default DashboardLayout;
