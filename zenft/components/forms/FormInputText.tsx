import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { FormInputProps } from "./FormInputProps";
import { ThemeProvider } from "@mui/material/styles";
import { SxProps } from "@mui/system";
import { customTheme } from "../../themes/formTheme"

export const FormInputText = ({
                                  name,
                                  control,
                                  label,
                                  sx,
                                  ...props // spread the `props` object
                              }: FormInputProps & { sx?: SxProps }) => {
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
                        style={{ color: "#fff" }}
                        sx={sx}
                        disabled={props.disabled}
                    />
                </ThemeProvider>
            )}
        />
    );
};
