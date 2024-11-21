import React from "react";
import { Tabs, Tab, Box } from "@mui/material";

const TabNavigation = ({ value, handleChange }) => (
  <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
    <Tabs value={value} onChange={handleChange} centered>
      <Tab label="Особиста інформація" />
      <Tab label="Мої оголошення" />
      <Tab label="Налаштування" />
    </Tabs>
  </Box>
);

export default TabNavigation;
