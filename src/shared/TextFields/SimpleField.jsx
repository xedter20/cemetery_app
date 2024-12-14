import * as React from "react";
import { TextField, Box, InputLabel } from "@mui/material";

export const SimpleField = (props) => {
  return (
    <Box
      component="form"
      sx={{ "& > :not(style)": { width: "100%" } }}
      noValidate
      autoComplete="off"
    >
      <TextField
        placeholder={props?.placeholder ?? ""}
        fullWidth={props.fullWidth}
        required={props.required ?? false}
        type={props.type}
        size={props.size ?? 'small'}
        onChange={(e) => props.onChange(e)}
        id="outlined-basic"
        label={props.label}
        variant="outlined"
        value={props.value}
      />
    </Box>
  );
};

export const TextFieldWithLabelOnTop = ({ onChange, label, type }) => {
  return (
    <Box fullWidth>
      <InputLabel shrink htmlFor="bootstrap-input">
        {label}
      </InputLabel>
      <TextField size="small" fullWidth id="bootstrap-input"></TextField>
    </Box>
  );
};
