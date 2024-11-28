// src/components/CategoryItem.js
import React from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";

const CategoryItem = ({ category, onEdit, onAddSubcategory, onDelete }) => {
  return (
    <Box key={category.id}>
      <div className="category-item">
        <span className="material-icons" style={{ marginRight: "8px" }}>
          folder
        </span>
        <Typography
          variant="subtitle1"
          className="category-name"
          onClick={onEdit}
          style={{
            flexGrow: 1,
            cursor: "pointer",
            padding: "8px",
            backgroundColor:
              window.location.pathname === "/edit" ? "#f5f5f5" : "transparent",
            borderRadius: "4px",
          }}
        >
          {category.name}
          {window.location.pathname === "/edit" && (
            <span
              className="material-icons"
              style={{ marginLeft: "8px", fontSize: "16px" }}
            >
              edit
            </span>
          )}
        </Typography>
        <Button
          size="small"
          startIcon={<span className="material-icons">add</span>}
          onClick={onAddSubcategory}
        >
          Додати підкатегорію
        </Button>
        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete(category.id)}
        >
          <span className="material-icons">delete</span>
        </IconButton>
      </div>
    </Box>
  );
};

export default CategoryItem;
