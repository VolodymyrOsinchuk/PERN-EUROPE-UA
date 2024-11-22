import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  IconButton,
  Paper,
} from "@mui/material";
import SubcategoryItem from "./SubcategoryItem";

function CategoryItem({
  category,
  onAddSubcategory,
  onDeleteCategory,
  onDeleteSubcategory,
}) {
  return (
    <Paper style={{ marginBottom: "16px" }}>
      <ListItem>
        <ListItemIcon>
          <span className="material-icons">folder</span>
        </ListItemIcon>
        <ListItemText primary={category.name} />
        <Button color="primary" onClick={() => onAddSubcategory(category)}>
          Додати підкатегорію
        </Button>
        <IconButton onClick={() => onDeleteCategory(category.id)} color="error">
          <span className="material-icons">delete</span>
        </IconButton>
      </ListItem>
      <List>
        {category.subcategories.map((subcategory, index) => (
          <SubcategoryItem
            key={index}
            subcategory={subcategory}
            onDelete={() => onDeleteSubcategory(category.id, index)}
          />
        ))}
      </List>
    </Paper>
  );
}

export default CategoryItem;
