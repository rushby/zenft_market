import React from "react";
import { Button, Paper, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { useContract } from "@thirdweb-dev/react";
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import { FormInputText } from "./FormInputText";

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
    const { contract } = useContract(
        "0x5C075ef16255BF7a7F0c49A0a2f5c2BB325cd2f6",
        "marketplace"
    );
    const methods = useForm<IFormInput>({
        defaultValues: defaultValues,
        mode: "onChange", // add mode property here
    });
    const {
        handleSubmit,
        register,
        control,
        setValue,
        formState: { errors },
    } = methods;

    const onSubmit = async (data: IFormInput) => {
        const { contractAddress, tokenId, price } = data;
        try {
            return await contract?.direct.createListing({
                assetContractAddress: contractAddress,
                buyoutPricePerToken: price,
                currencyContractAddress: NATIVE_TOKEN_ADDRESS,
                listingDurationInSeconds: 60 * 60 * 24 * 7,
                quantity: 1,
                startTimestamp: new Date(0),
                tokenId: parseInt(tokenId),
            });
        } catch (error) {
            console.error(error);
        }
    };

    register("contractAddress", {
        required: "Contract Address is required",
        pattern: {
            value: /^0x[a-fA-F0-9]{62}$/,
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

    return (
        <>
            {!isLoggedIn && (
                <Typography variant="h6" style={{ color: "#fff", textAlign: "center", margin: "20px" }}>
                    Please sign in to create a listing.
                </Typography>
            )}
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
                <Typography variant="h6" style={{ color: "#fff" }}>Direct Listing</Typography>

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

                <Button onClick={handleSubmit(onSubmit)} variant={"contained"} disabled={!isLoggedIn}>
                    {" "}
                    Submit{" "}
                </Button>
            </Paper>
        </>
    );

};
