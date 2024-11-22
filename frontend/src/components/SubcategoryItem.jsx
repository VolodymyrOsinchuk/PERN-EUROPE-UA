import React from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";

function SubcategoryItem({ subcategory, onDelete }) {
  return (
    <ListItem>
      <ListItemIcon>
        <span className="material-icons">subdirectory_arrow_right</span>
      </ListItemIcon>
      <ListItemText primary={subcategory} />
      <IconButton onClick={onDelete} color="error">
        <span className="material-icons">delete</span>
      </IconButton>
    </ListItem>
  );
}

export default SubcategoryItem;
