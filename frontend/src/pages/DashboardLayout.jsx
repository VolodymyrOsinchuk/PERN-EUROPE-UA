import PropTypes from "prop-types";

import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import { DrawerContainer } from "../components";
const drawerWidth = 240;
const DashboardLayout = (props) => {
  return (
    <Box sx={{ display: "flex" }}>
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
