import { Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { FormInputDropdown } from "./FormInputDropdown";
import { customTheme } from "../../themes/formTheme";
import { ThemeProvider } from "@mui/material/styles";

const options = [
    {
        label: "Direct",
        value: "direct",
    },
    {
        label: "Auction",
        value: "auction",
    },
];

export const ListingType = () => {
    const methods = useForm({
        defaultValues: {
            listingType: "direct" // Set default value to the second option
        }
    });
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
