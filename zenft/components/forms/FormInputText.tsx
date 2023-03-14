import React from "react";
import { Controller } from "react-hook-form";
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
                                  onChange, // Modify the type of onChange prop
                                  ...props // spread the `props` object
                              }: FormInputProps & { sx?: SxProps, onChange?: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void }) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({
                         field: { onChange: onChangeController, value },
                         fieldState: { error },
                         formState,
                     }) => (
                <ThemeProvider theme={customTheme}>
                    <TextField
                        helperText={error ? error.message : null}
                        size="small"
                        error={!!error}
                        onChange={(event) => {
                            onChangeController(event);
                            if (onChange) onChange(event); // Call the onChange prop if it exists
                        }}
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
