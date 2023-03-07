import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { FormInputProps } from "./FormInputProps";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SxProps } from "@mui/system";

const customTheme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiInputLabel-root": {color: 'white'}, //styles the label
                    "& .MuiInputBase-input": {
                        color: "white", //styles the input text
                    },
                    "& .MuiOutlinedInput-root": {
                        "& > fieldset": { borderColor: "#0e9de5" },
                    },
                    "& .MuiOutlinedInput-root.Mui-focused": {
                        "& > fieldset": {
                            borderColor: "#26db8d"
                        }
                    },
                    "& .MuiOutlinedInput-root:hover": {
                        "& > fieldset": {
                            borderColor: "#26db8d"
                        }
                    },
                },
            },
        },
    },
});


export const FormInputText = ({ name, control, label, sx}: FormInputProps & { sx?: SxProps }) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({
                         field: { onChange, value },
                         fieldState: { error },
                         formState,
                     }) => (
                <ThemeProvider theme={customTheme}>
                <TextField
                    helperText={error ? error.message : null}
                    size="small"
                    error={!!error}
                    onChange={onChange}
                    value={value}
                    fullWidth
                    label={label}
                    variant="outlined"
                    color="primary"
                    style={{color: "#fff"}}
                    sx={sx} // add `sx` to the `TextField` component
                />
                </ThemeProvider>
            )}
        />
    );
};