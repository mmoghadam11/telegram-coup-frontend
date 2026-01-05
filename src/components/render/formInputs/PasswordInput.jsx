import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";

const PasswordInput = ({ label, name, errors, Defaultfont=false,controllerField, elementProps }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <TextField
      name={name}
      label={label}
      error={Boolean(errors)}
      helperText={errors}
      {...controllerField}
      {...elementProps}
      type={showPassword ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      inputProps={{ style: !Defaultfont?{ fontSize: 16 }:null }} // font size of input text
      InputLabelProps={{ style: !Defaultfont?{ fontSize: 16 }:null  }}
      fullWidth
      size="small"
    />
  );
};

export default PasswordInput;
