import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import links from "../utils/links";

function Sidebar() {
  return (
    <>
      {/* <Drawer variant="permanent" className="sidebar"> */}
      <Toolbar>
        <Typography variant="h6">Панель керування</Typography>
      </Toolbar>
      <Divider />
      <List>
        {links.map((link) => {
          const { text, path, icon, role } = link;
          return (
            <ListItem key={text} component={Link} to={path}>
              <ListItemIcon>
                <span className="material-icons">{icon}</span>
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          );
        })}
      </List>
      {/* </Drawer> */}
    </>
  );
}

export default Sidebar;
