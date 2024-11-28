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
  newCategoryName,
  setNewCategoryName,
  onSubmit,
  editMode,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {editMode ? "Змінити назву" : "Додати категорію"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Назва категорії"
          fullWidth
          variant="outlined"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Скасувати</Button>
        <Button onClick={onSubmit} variant="contained">
          {editMode ? "Зберегти" : "Додати"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDialog;
