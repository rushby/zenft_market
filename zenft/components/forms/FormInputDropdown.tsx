import React from "react";
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import { Controller } from "react-hook-form";
import { FormInputProps } from "./FormInputProps";
import { SxProps } from "@mui/system";

interface FormInputDropdownProps extends FormInputProps {
    options: { label: string; value: string }[];
    sx?: SxProps;
    onListingTypeChange: (value: string) => void; // Add this prop
}

export const FormInputDropdown: React.FC<FormInputDropdownProps> = ({
                                                                        name,
                                                                        control,
                                                                        label,
                                                                        options,
                                                                        sx,
                                                                        onListingTypeChange, // Destructure the onListingTypeChange prop
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

    const handleListingTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;
        onListingTypeChange(value); // Call the onListingTypeChange callback function with the value
    };

    return (
        <FormControl size={"small"} sx={sx}>
            {label && <InputLabel>{label}</InputLabel>}
            <Controller
                render={({ field: { onChange, value } }) => (
                    <Select onChange={(event) => { onChange(event); handleListingTypeChange(event); }} value={value}>
                        {generateSingleOptions()}
                    </Select>
                )}
                control={control}
                name={name}
            />
        </FormControl>
    );
};
