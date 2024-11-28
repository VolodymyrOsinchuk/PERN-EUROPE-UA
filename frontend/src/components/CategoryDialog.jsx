// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
// } from "@mui/material";

// function CategoryDialog({
//   open,
//   onClose,
//   onAddSubcategory,
//   newSubcategoryName,
//   setNewSubcategoryName,
// }) {
//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Додати підкатегорію</DialogTitle>
//       <DialogContent>
//         <TextField
//           autoFocus
//           margin="dense"
//           label="Назва підкатегорії"
//           fullWidth
//           value={newSubcategoryName}
//           onChange={(e) => setNewSubcategoryName(e.target.value)}
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Скасувати</Button>
//         <Button onClick={onAddSubcategory} color="primary">
//           Додати
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// export default CategoryDialog;

// src/components/CategoryDialog.js
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const CategoryDialog = ({
  open,
  onClose,
  onSubmit,
  categoryName,
  setCategoryName,
  isEditMode,
  isSubcategory,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {isEditMode
          ? "Змінити назву"
          : isSubcategory
            ? "Додати підкатегорію"
            : "Додати категорію"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Назва категорії"
          fullWidth
          variant="outlined"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Скасувати</Button>
        <Button onClick={onSubmit} variant="contained">
          {isEditMode ? "Зберегти" : "Додати"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDialog;
