import { useForm, SubmitHandler } from "react-hook-form";
import React from "react";
import { useContract } from "@thirdweb-dev/react";
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import styles from "../styles/CreateListingForms.module.css";

type FormData = {
    contractAddress: string;
    tokenId: string;
    price: string;
};

const CreateDirectListingForm = () => {
    const { contract } = useContract(
        "0x5C075ef16255BF7a7F0c49A0a2f5c2BB325cd2f6",
        "marketplace"
    );
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const createDirectListing: SubmitHandler<FormData> = async (formData) => {
        const { contractAddress, tokenId, price } = formData;
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

    return (
        <form onSubmit={handleSubmit(createDirectListing)} className={styles['form-container']}>
            <label htmlFor="contractAddress" className={styles['form-label']}>Contract Address:</label>
            <input
                defaultValue=""
                {...register("contractAddress", { required: true })}
                className={styles['form-input']}
            />
            {errors.contractAddress && <span className={styles['form-error']}>This field is required</span>}
            <label htmlFor="tokenId" className={styles['form-label']}>Token Id:</label>
            <input
                defaultValue=""
                {...register("tokenId", { required: true })}
                className={styles['form-input']}
            />
            {errors.tokenId && <span className={styles['form-error']}>This field is required</span>}
            <label htmlFor="price" className={styles['form-label']}>Price:</label>
            <input
                defaultValue=""
                {...register("price", { required: true })}
                className={styles['form-input']}
            />
            {errors.price && <span className={styles['form-error']}>This field is required</span>}
            <button type="submit" className={styles['button']}>Submit</button>
        </form>
    );
};

export default CreateDirectListingForm;
