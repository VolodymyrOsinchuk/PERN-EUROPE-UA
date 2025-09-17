import React, { useState } from 'react'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import Grid from '@mui/material/Grid'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

const FormRow = ({ type, name, label, defaultValue, onChange }) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }
  return (
    <Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          type={showPassword && type === 'password' ? 'text' : type}
          id={name}
          name={name}
          label={label || name}
          defaultValue={defaultValue || ''}
          onChange={onChange}
          required
          fullWidth
          variant="outlined"
          margin="normal"
          InputProps={
            type === 'password'
              ? {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              : null
          }
        />
      </Grid>
    </Grid>
  )
}
export default FormRow
