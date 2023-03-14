import React, { useState } from "react";
import { Paper, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import {
    useCreateDirectListing,
    useContract,
    Web3Button, useOwnedNFTs, useAddress
} from "@thirdweb-dev/react";
import { FormInputText } from "../../FormInputText";
import styles from "../../../../styles/Listing.module.css";
import SignIn from "../../../SignIn";
import validationRules from "./formValidation";
import { handleError } from "../handleError";
import { IFormInput } from "./types";
import { handleDirectSubmit } from "./directSubmit";

interface IProps {
    isLoggedIn: boolean;
}

const defaultValues = {
    contractAddress: "",
    tokenId: "",
    price: "",
    duration: "",
};

export const DirectListing = ({ isLoggedIn }: IProps) => {
    const contractAddress = "0x5C075ef16255BF7a7F0c49A0a2f5c2BB325cd2f6";
    const {contract} = useContract(
        contractAddress,
        "marketplace"
    );
    const address = useAddress();
    const [nftContractAddress, setNftContractAddress] = useState("");
    const { contract: nftContract } = useContract(nftContractAddress);
    const { data: nftData, isLoading: nftLoading, error: nftError } = useOwnedNFTs(
        nftContractAddress ? nftContract : undefined, address);
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
        trigger,
        setValue,
        formState
    } = methods;

    register("contractAddress", validationRules.contractAddress);
    register("tokenId", validationRules.tokenId);
    register("price", validationRules.price);
    register("duration", validationRules.duration);

    const handleContractAddressChange = async (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const fieldValue = e.target.value;
        const isValid = await trigger("contractAddress");

        if (isValid) {
            setNftContractAddress(fieldValue);
        } else {
            setNftContractAddress("");
        }
    };


    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setNftContractAddress(data.contractAddress);

        const ownedNFTs = nftData?.map((nft) => nft.metadata.id) ?? [];

        if (!ownedNFTs.includes(data.tokenId)) {
            setErrorMessage("You do not own this NFT.");
            setButtonState("failed");
            setButtonText("Failed");
            setTimeout(() => {
                setErrorMessage("");
                setButtonState("normal");
                setButtonText("Create Listing");
            }, 8000);
            return;
        }

        await handleDirectSubmit(data, createDirectListing, setErrorMessage, setButtonState, setButtonText);
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
                            onChange={handleContractAddressChange}
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
                        <FormInputText
                            name="duration"
                            control={control}
                            label="Duration (days)"
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
                                    isDisabled={!formState.isValid || buttonState === "failed" || buttonState === "loading" || buttonState === "success"}
                                    onError={(error) => handleError(error, setButtonState, setButtonText, setErrorMessage)}
                                >
                                    {nftLoading || !nftData || nftData.length === 0 ? "Loading" : nftError ? "Failed" : buttonText}
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
