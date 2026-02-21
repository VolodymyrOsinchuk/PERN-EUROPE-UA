// React import not required with automatic JSX runtime
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
  console.log("🚀 ~ category:", category);

  return (
    <Paper sx={{ mb: "16px", p: 2 }}>
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
        {category.SubCategories.map((subcategory, index) => (
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

// src/components/CategoryList.js
// import React from "react";
// import { Box, Button, IconButton, Typography, Paper } from "@mui/material";

// const CategoryItem = ({
//   categories,
//   onEditCategory,
//   onDeleteCategory,
//   onAddSubCategory,
// }) => {
//   return (
//     <Paper className="category-tree">
//       {categories.map((category) => {
//         return (
//           <Box key={category.id}>
//             <div className="category-item">
//               <span className="material-icons" style={{ marginRight: "8px" }}>
//                 folder
//               </span>
//               <Typography
//                 variant="subtitle1"
//                 className="category-name"
//                 onClick={() => onEditCategory(category.name)}
//                 style={{
//                   flexGrow: 1,
//                   cursor: "pointer",
//                   padding: "8px",
//                   backgroundColor:
//                     window.location.pathname === "/edit"
//                       ? "#f5f5f5"
//                       : "transparent",
//                   borderRadius: "4px",
//                 }}
//               >
//                 {category.name}
//                 {window.location.pathname === "/edit" && (
//                   <span
//                     className="material-icons"
//                     style={{ marginLeft: "8px", fontSize: "16px" }}
//                   >
//                     edit
//                   </span>
//                 )}
//               </Typography>
//               <Button
//                 size="small"
//                 startIcon={<span className="material-icons">add</span>}
//                 onClick={() => onAddSubCategory(category.name)}
//               >
//                 Додати підкатегорію
//               </Button>
//               <IconButton
//                 size="small"
//                 color="error"
//                 onClick={() => onDeleteCategory(category.id)}
//               >
//                 <span className="material-icons">delete</span>
//               </IconButton>
//             </div>
//             <div className="subcategory">
//               {category.SubCategories.map((sub) => {
//                 return (
//                   <div key={sub.id} className="category-item">
//                     <span
//                       className="material-icons"
//                       style={{ marginRight: "8px" }}
//                     >
//                       subdirectory_arrow_right
//                     </span>
//                     <Typography
//                       variant="body1"
//                       className="category-name"
//                       onClick={() => onEditCategory(category.name, sub.name)}
//                       style={{
//                         flexGrow: 1,
//                         padding: "8px",
//                         backgroundColor:
//                           window.location.pathname === "/edit"
//                             ? "#f5f5f5"
//                             : "transparent",
//                         borderRadius: "4px",
//                       }}
//                     >
//                       {sub.name}
//                       {window.location.pathname === "/edit" && (
//                         <span
//                           className="material-icons"
//                           style={{ marginLeft: "8px", fontSize: "16px" }}
//                         >
//                           edit
//                         </span>
//                       )}
//                     </Typography>
//                     <IconButton
//                       size="small"
//                       color="error"
//                       onClick={() =>
//                         onDeleteCategory(category.id, sub.categoryId)
//                       }
//                     >
//                       <span className="material-icons">delete</span>
//                     </IconButton>
//                   </div>
//                 );
//               })}
//             </div>
//           </Box>
//         );
//       })}
//     </Paper>
//   );
// };

// export default CategoryItem;
