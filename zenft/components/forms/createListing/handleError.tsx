import React from "react";

export const handleError = (
    error: Error,
    setButtonState: React.Dispatch<React.SetStateAction<string>>,
    setButtonText: React.Dispatch<React.SetStateAction<string>>,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>
) => {
    if (error.message.includes("user rejected transaction")) {
        setErrorMessage("User Rejected Transaction");
    } else if (error.message.includes("without a reason string")) {
        setErrorMessage("Transaction Failed: Check Wallet Funds");
    } else if (error.message.includes("invalid token ID")) {
        setErrorMessage("Token Id is invalid");
    } else if (error.message.includes("")) {
        setErrorMessage("You do not own this NFT.");
    }

    setButtonState("failed");
    setButtonText("Failed");
    setTimeout(() => {
        setErrorMessage("");
        setButtonState("normal");
        setButtonText("Create Listing");
    }, 8000);
};
