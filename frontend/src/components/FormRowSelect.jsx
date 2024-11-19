import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

const FormRowSelect = ({
  name,
  labelText,
  defaultValue = "",
  list,
  onChange,
}) => {
  return (
    <Grid>
      <Grid size={{ xs: 12 }}>
        <FormControl fullWidth variant="outlined" required margin="normal">
          <InputLabel>{labelText || name}</InputLabel>
          <Select
            label={labelText || name}
            name={name}
            id={name}
            defaultValue={defaultValue}
            onChange={onChange}
          >
            {list.map((itemValue) => (
              <MenuItem key={itemValue.id} value={itemValue.name}>
                {itemValue.native}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};
export default FormRowSelect;
