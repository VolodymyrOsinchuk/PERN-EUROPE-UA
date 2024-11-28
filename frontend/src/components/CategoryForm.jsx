import React from "react";
import { TextField, Button, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Form } from "react-router-dom";

function CategoryForm({ newCategoryName }) {
  return (
    <Form method="post">
      <Paper style={{ padding: "20px", marginBottom: "20px" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Нова категорія"
              name={newCategoryName}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              startIcon={<span className="material-icons">add</span>}
            >
              Додати категорію
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Form>
  );
}

export default CategoryForm;
