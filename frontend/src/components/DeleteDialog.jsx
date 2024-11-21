// DeleteDialog.js
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const DeleteDialog = ({ open, onClose, selectedAd, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Підтвердження видалення</DialogTitle>
    <DialogContent>
      <Typography>
        Ви дійсно хочете видалити оголошення "{selectedAd?.title}"?
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Скасувати</Button>
      <Button onClick={onConfirm} color="error" autoFocus>
        Видалити
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteDialog;
