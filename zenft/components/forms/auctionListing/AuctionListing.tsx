import React, { useState } from "react";
import { Paper, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import {
    useCreateAuctionListing,
    useContract,
    Web3Button, useOwnedNFTs, useAddress
} from "@thirdweb-dev/react";
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import { FormInputText } from "../FormInputText";
import styles from "../../../styles/Listing.module.css";
import SignIn from "../../SignIn";
import validationRules from "./formValidation";
import {handleError} from "./handleError";

interface IFormInput {
    contractAddress: string;
    tokenId: string;
    buyoutPricePerToken: string;
    reservePricePerToken: string;
    duration: string;
}

interface IProps {
    isLoggedIn: boolean;
}

const defaultValues = {
    contractAddress: "",
    tokenId: "",
    buyoutPricePerToken: "",
    reservePricePerToken: "",
    duration: ""
};

export const AuctionListing = ({ isLoggedIn }: IProps) => {
    const contractAddress = "0x5C075ef16255BF7a7F0c49A0a2f5c2BB325cd2f6";
    const {contract} = useContract(
        contractAddress,
        "marketplace"
    );
    const address = useAddress();
    const [nftContractAddress, setNftContractAddress] = useState("");
    const { contract: nftContract } = useContract(nftContractAddress);
    const { data: nftData, isLoading: nftLoading, error: nftError } = useOwnedNFTs(nftContract, address,);
    const {mutateAsync: createAuctionListing} = useCreateAuctionListing(contract);
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

    register("contractAddress", validationRules.contractAddress);
    register("tokenId", validationRules.tokenId);
    register("buyoutPricePerToken", validationRules.buyoutPricePerToken);
    register("reservePricePerToken", validationRules.reservePricePerToken);
    register("duration", validationRules.duration);

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
                setButtonText("Create Auction");
            }, 8000);
            return;
        }

        try {
            const requestData = {
                assetContractAddress: data.contractAddress,
                tokenId: data.tokenId,
                minimumBidAmount: 0,
                reservePricePerToken: data.reservePricePerToken,
                buyoutPricePerToken: data.buyoutPricePerToken,
                currencyContractAddress: NATIVE_TOKEN_ADDRESS,
                quantity: 1,
                startTimestamp: new Date(0),
                listingDurationInSeconds: Number(data.duration) * 24 * 60 * 60,
                bidBufferBps: 100, // Bids must be 1% higher than current bid
                timeBufferInSeconds: 300, // Extend auction by 5mins after receiving a bid
            }


            await createAuctionListing(requestData);

            setErrorMessage("");
            setButtonState("success");
            setButtonText("Success");
            setTimeout(() => {
                setButtonState("normal");
                setButtonText("Create Auction");
            }, 5000);
        } catch (error: any) {
            console.error(error);
            handleError(error, setButtonState,setButtonText,setErrorMessage);
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
                            Auction Listing
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
                            name="buyoutPricePerToken"
                            control={control}
                            label="Buy Now Price"
                            disabled={!isLoggedIn}
                        />
                        <FormInputText
                            name="reservePricePerToken"
                            control={control}
                            label="Reserve Price"
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
                                    isDisabled={buttonState === "failed"}
                                    onError={(error) => handleError(error, setButtonState, setButtonText, setErrorMessage)}
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

export default AuctionListing;
