import {Button, Card, Paper, Typography} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { FormInputDropdown } from "./FormInputDropdown";
import { customTheme } from "../../themes/formTheme";
import { ThemeProvider } from "@mui/material/styles";

const options = [
    {
        label: "Dropdown Option 1",
        value: "1",
    },
    {
        label: "Dropdown Option 2",
        value: "2",
    },
];

export const ListingType = () => {
    const methods = useForm();
    const { control } = methods;

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="h6"> Choose Listing Type </Typography>
            <div style={{ marginTop: "16px" }}>
                <ThemeProvider theme={customTheme}>
                    <FormInputDropdown name="listingType" control={control} options={options}/>
                </ThemeProvider>
            </div>
        </div>
    );
};
