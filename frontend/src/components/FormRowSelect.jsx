import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";

const FormRowSelect = ({
  name,
  labelText,
  defaultValue = "",
  list,
  onChange,
  error,
}) => {
  return (
    <Grid>
      <Grid size={{ xs: 12 }}>
        <FormControl
          fullWidth
          variant="outlined"
          margin="normal"
          error={!!error}
        >
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
          {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
      </Grid>
    </Grid>
  );
};

FormRowSelect.propTypes = {
  name: PropTypes.string.isRequired,
  labelText: PropTypes.string,
  defaultValue: PropTypes.string,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      native: PropTypes.string.isRequired,
    })
  ),
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  error: PropTypes.string,
};
export default FormRowSelect;
