import { Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { FormInputDropdown } from "./FormInputDropdown";
import { customTheme } from "../../themes/formTheme";
import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import { useUser } from "@thirdweb-dev/react";

interface ListingTypeDropdownProps {
    onListingTypeChange: (value: string) => void;
}

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

export const ListingTypeDropdown: React.FC<ListingTypeDropdownProps> = ({ onListingTypeChange }) => {
    const methods = useForm({
        defaultValues: {
            listingType: "direct" // Set default value to the second option
        }
    });
    const { control } = methods;
    const { isLoggedIn } = useUser();

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
            <Typography variant="h6"> Choose Listing Type </Typography>
            <div style={{ marginTop: "16px" }}>
                <ThemeProvider theme={customTheme}>
                    <FormInputDropdown name="listingType" control={control} options={options} sx={{ width: "250px" }} onListingTypeChange={onListingTypeChange} />
                </ThemeProvider>
                {!isLoggedIn && (
                    <Typography variant="subtitle1" style={{ color: "orangered", paddingTop: "1rem" }}>
                        Please sign in to create a listing.
                    </Typography>
                )}
            </div>
        </div>
    );
};
