// src/components/SubcategoryItem.js
import React from "react";
import { Box, Typography, IconButton } from "@mui/material";

const SubcategoryItem = ({ subcategory, onEdit, onDelete }) => {
  return (
    <div className="category-item">
      <span className="material-icons" style={{ marginRight: "8px" }}>
        subdirectory_arrow_right
      </span>
      <Typography
        variant="body1"
        className="category-name"
        onClick={onEdit}
        style={{
          flexGrow: 1,
          padding: "8px",
          backgroundColor:
            window.location.pathname === "/edit" ? "#f5f5f5" : "transparent",
          borderRadius: "4px",
        }}
      >
        {subcategory.name}
        {window.location.pathname === "/edit" && (
          <span
            className="material-icons"
            style={{ marginLeft: "8px", fontSize: "16px" }}
          >
            edit
          </span>
        )}
      </Typography>
      <IconButton size="small" color="error" onClick={onDelete}>
        <span className="material-icons">delete</span>
      </IconButton>
    </div>
  );
};

export default SubcategoryItem;
