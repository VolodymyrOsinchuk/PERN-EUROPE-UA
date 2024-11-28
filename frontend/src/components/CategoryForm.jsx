import React from "react";
import { Form, useNavigation, useActionData } from "react-router-dom";
import { Button, TextField, Box, Alert } from "@mui/material";

function CategoryForm() {
  const navigation = useNavigation();
  const actionData = useActionData();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Form method="post">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {actionData?.error && (
          <Alert severity="error">{actionData.error.message}</Alert>
        )}

        <TextField name="name" label="Назва категорії" required fullWidth />

        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Збереження..." : "Зберегти"}
        </Button>
      </Box>
    </Form>
  );
}

export default CategoryForm;
