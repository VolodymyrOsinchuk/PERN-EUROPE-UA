import React from "react";
import { TextField, Button, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";

function CategoryForm({
  newCategoryName,
  setNewCategoryName,
  handleAddCategory,
}) {
  return (
    <Paper style={{ padding: "20px", marginBottom: "20px" }}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Нова категорія"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddCategory}
            startIcon={<span className="material-icons">add</span>}
          >
            Додати категорію
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default CategoryForm;
