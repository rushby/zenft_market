import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Controller } from "react-hook-form";
import { FormInputProps } from "./FormInputProps";
import { SxProps } from "@mui/system";

interface FormInputDropdownProps extends FormInputProps {
    options: { label: string; value: string }[];
    sx?: SxProps;
}

export const FormInputDropdown: React.FC<FormInputDropdownProps> = ({
                                                                        name,
                                                                        control,
                                                                        label,
                                                                        options,
                                                                        sx,
                                                                    }) => {
    const generateSingleOptions = () => {
        return options.map((option: any) => {
            return (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            );
        });
    };

    return (
        <FormControl size={"small"} sx={sx}>
            {label && <InputLabel>{label}</InputLabel>}
            <Controller
                render={({ field: { onChange, value } }) => (
                    <Select onChange={onChange} value={value}>
                        {generateSingleOptions()}
                    </Select>
                )}
                control={control}
                name={name}
            />
        </FormControl>
    );
};
