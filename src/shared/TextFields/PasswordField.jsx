import * as React from "react";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export const PasswordField = ({ label, onChange, required = false, value }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl fullWidth>
      <InputLabel size="small" htmlFor="outlined-adornment-password">
        {label}
      </InputLabel>
      <OutlinedInput
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        size="small"
        variant="outlined"
        id="outlined-adornment-password"
        type={showPassword ? "text" : "password"}
        endAdornment={
          <InputAdornment position="end" size="small">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              onMouseUp={handleMouseUpPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label="Password"
      />
    </FormControl>
  );
};
