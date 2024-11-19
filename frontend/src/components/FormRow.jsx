import React from "react";
import { TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";

const FormRow = ({ type, name, label, defaultValue, onChange }) => {
  return (
    <Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          type={type}
          id={name}
          name={name}
          label={label || name}
          defaultValue={defaultValue || ""}
          onChange={onChange}
          required
          fullWidth
          variant="outlined"
          margin="normal"
        />
      </Grid>
    </Grid>
  );
};
export default FormRow;
