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

const defaultValues = {
    contractAddress: "",
    tokenId: "",
    price: ""
};

export const CreateListing = () => {
    const { contract } = useContract(
        "0x5C075ef16255BF7a7F0c49A0a2f5c2BB325cd2f6",
        "marketplace"
    );
    const methods = useForm<IFormInput>({ defaultValues: defaultValues });
    const { handleSubmit, register, control, setValue, formState: { errors } } = methods;


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
            value: /^0x[a-fA-F0-9]{40}$/,
            message: "Invalid Contract Address",
        },
    });

    register("tokenId", {
        required: "Token Id is required",
        pattern: {
            value: /^0x[a-fA-F0-9]{40}$/,
            message: "Token Id must be a number",
        },
    });

    register("price", {
        required: "Price is required",
        pattern: {
            value: /^[0-9]+(\.[0-9]{1,18})?$/,
            message: "Price must be a whole number or a decimal with up to 18 decimal places",
        },
    });


    return (
        <Paper
            style={{
                display: "grid",
                gridRowGap: "20px",
                padding: "20px",
                margin: "10px 300px",
            }}
        >
            <Typography variant="h6">Direct Listing</Typography>

            <FormInputText name="contractAddress" control={control} label="Contract Address" />
            <FormInputText name="tokenId" control={control} label="Token Id" />
            <FormInputText name="price" control={control} label="Price" />

            <Button onClick={handleSubmit(onSubmit)} variant={"contained"}>
                {" "}
                Submit{" "}
            </Button>
        </Paper>
    );
};