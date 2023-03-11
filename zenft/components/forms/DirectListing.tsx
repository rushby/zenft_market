import React, { useState } from "react";
import { Paper, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import {
    useCreateDirectListing,
    useContract,
    Web3Button
} from "@thirdweb-dev/react";
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import { FormInputText } from "./FormInputText";
import styles from "../../styles/Listing.module.css";
import SignIn from "../SignIn";

interface IFormInput {
    contractAddress: string;
    tokenId: string;
    price: string;
}

interface IProps {
    isLoggedIn: boolean;
}

const defaultValues = {
    contractAddress: "",
    tokenId: "",
    price: "",
};

export const DirectListing = ({ isLoggedIn }: IProps) => {
    const contractAddress = "0x5C075ef16255BF7a7F0c49A0a2f5c2BB325cd2f6";
    const {contract} = useContract(
        contractAddress,
        "marketplace"
    );
    const {mutateAsync: createDirectListing} = useCreateDirectListing(contract);
    const [errorMessage, setErrorMessage] = useState("");
    const [buttonState, setButtonState] = useState("normal");
    const [buttonText, setButtonText] = useState("Create Listing");

    const methods = useForm<IFormInput>({
        defaultValues: defaultValues,
        mode: "onChange",
    });
    const {
        handleSubmit,
        register,
        control,
        setValue,
        formState: {errors},
    } = methods;

    const handleError = (error: Error) => {
        if (error.message.includes("user rejected transaction")) {
            setErrorMessage("User Rejected Transaction");
        } else if (error.message.includes("without a reason string")) {
            setErrorMessage("Transaction Failed: Check Wallet Funds");
        } else if (error.message.includes("invalid token ID")) {
            setErrorMessage("Token Id is invalid");
        } else if (error.message.includes("")) {
            setErrorMessage("You do not own this NFT.");
        } else {
            setErrorMessage("");
        }

        setButtonState("failed");
        setButtonText("Failed");
        setTimeout(() => {
            setButtonState("normal");
            setButtonText("Create Listing");
        }, 5000);
    };

    register("contractAddress", {
        required: "Contract Address is required",
        pattern: {
            value: /^0x[a-fA-F0-9]{40}$/,
            message: "Invalid Contract Address",
        },
    });

    register("tokenId", {
        required: "Token Id is required",
        pattern: {
            value: /^[0-9]*$/,
            message: "Token Id must be a number",
        },
    });

    register("price", {
        required: "Price is required",
        pattern: {
            value: /^[0-9]+(\.[0-9]{1,18})?$/,
            message:
                "Price must be a whole number or a decimal with up to 18 decimal places",
        },
    });

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            await createDirectListing({
                assetContractAddress: data.contractAddress,
                buyoutPricePerToken: data.price,
                currencyContractAddress: NATIVE_TOKEN_ADDRESS,
                listingDurationInSeconds: 60 * 60 * 24 * 7,
                quantity: 1,
                startTimestamp: new Date(0),
                tokenId: parseInt(data.tokenId),
            });
            setErrorMessage("");
            setButtonState("success");
            setButtonText("Success");
            setTimeout(() => {
                setButtonState("normal");
                setButtonText("Create Listing");
            }, 5000);
        } catch (error: any) {
            console.error(error);
            handleError(error);
        }
    };

        return (
            <div style={{paddingTop: "1rem"}}>
                <>
                    <Paper
                        style={{
                            display: "grid",
                            gridRowGap: "20px",
                            padding: "20px",
                            margin: "10px 300px",
                            backgroundColor: "#303030",
                            border: "2px solid #fff",
                        }}
                    >
                        <Typography variant="h6" style={{color: "#fff"}}>
                            Direct Listing
                        </Typography>

                        <FormInputText
                            name="contractAddress"
                            control={control}
                            label="Contract Address"
                            disabled={!isLoggedIn}
                        />
                        <FormInputText
                            name="tokenId"
                            control={control}
                            label="Token Id"
                            disabled={!isLoggedIn}
                        />
                        <FormInputText
                            name="price"
                            control={control}
                            label="Price"
                            disabled={!isLoggedIn}
                        />

                        {isLoggedIn ? (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <Web3Button
                                    contractAddress={contractAddress}
                                    action={() => handleSubmit(onSubmit)()}
                                    className={`${styles.buy} ${styles[buttonState]}`}
                                    isDisabled={buttonState === "failed"}
                                    onError={(error) => handleError(error)}
                                >
                                    {buttonText}
                                </Web3Button>

                                {errorMessage && (
                                    <Typography
                                        variant="subtitle1"
                                        style={{
                                            color: "orangered",
                                            margin: "0 0 20px",
                                            paddingTop: "2rem",
                                        }}
                                    >
                                        {errorMessage}
                                    </Typography>
                                )}
                            </div>
                        ) : (
                            <div className={styles["listing-signin-container"]}>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        style={{color: "orangered", margin: "0 0 20px"}}
                                    >
                                        Must be signed in to buy...
                                    </Typography>
                                    <SignIn/>
                                </div>
                            </div>
                        )}
                    </Paper>
                </>
            </div>
        );
};

export default DirectListing;
